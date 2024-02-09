import type { HttpContext } from "@adonisjs/core/http";
import User, { UserRole } from "../models/user.js";
import JWTService from "../services/jwt_service.js";
import hash from "@adonisjs/core/services/hash";
import {
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  putProfileValidator,
  registerUserValidator,
  resetPasswordValidator,
  validateAccountValidator,
} from "../validators/account.js";
import Profile from "../models/profile.js";
import mail from "@adonisjs/mail/services/main";
import env from "../../start/env.js";

export default class AccountController {
  async getAccount({ user }: HttpContext) {
    await user.load("profile");
    return user;
  }

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator);

    try {
      const user = await User.verifyCredentials(
        payload.email,
        payload.password
      );
      const token = user.generateAuthCookieToken();
      return response.cookie("auth_token", token);
    } catch (error) {
      console.log(error);
      return response.badRequest("Invalid Credentials");
    }
  }

  async logout({ response }: HttpContext) {
    response.clearCookie("auth_token");
  }

  async auth() {}

  async forgotPassword({ request }: HttpContext) {
    const payload = await request.validateUsing(forgotPasswordValidator);

    const user = await User.findBy("email", payload.email);
    if (user) {
      user.generateValidationToken();
      console.log(user.validationToken);
    }
  }

  async resetPassword({ request, response }: HttpContext) {
    const payload = await request.validateUsing(resetPasswordValidator);

    const decodedToken = JWTService.decodeAuthCookie(payload.token);
    if (!decodedToken) {
      return response.forbidden("Invalid Token");
    }

    const user = await User.query()
      .where("email", decodedToken.email)
      .where("id", decodedToken.id)
      .first();
    if (!user) {
      return response.forbidden("Invalid Token");
    }
    user.password = payload.password;
    user.validationToken = null;
    await user.save();
  }

  async changePassword({ request, response, user }: HttpContext) {
    const payload = await request.validateUsing(changePasswordValidator);

    if (!(await hash.verify(user.password, payload.oldPassword))) {
      return response.unauthorized("Wrong Password");
    }
    user.password = payload.newPassword;
    await user.save();
  }

  async putProfile({ request, user }: HttpContext) {
    const payload = await request.validateUsing(putProfileValidator);

    const profile = await user.related("profile").query().first();
    if (!profile) {
      await Profile.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        userId: user.id,
      });
    } else {
      profile.merge({
        firstName: payload.firstName,
        lastName: payload.lastName,
      });
      await profile.save();
    }
    await user.load("profile");
    return user;
  }

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerUserValidator);

    const existingUser = await User.findBy("email", payload.email);
    if (existingUser) {
      return response.conflict("User already exists");
    }

    const user = await User.create({
      email: payload.email,
      password: payload.password,
      role: UserRole.USER,
      validated: false,
    });

    await Profile.create({
      userId: user.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });

    await user.generateValidationToken();
    await mail.send(message => {
      message
        .to(user.email)
        .subject("Verify your email address")
        .html(
          `
          <h1> Verify email address </h1>
          <p>
            <a href="http://${env.get("HOST")}:${env.get("PORT")}/v1/account/validate-account?token=${user.validationToken}">Click here</a> to verify your email address
          </p>
          `
        )
        .text(
          `
          Verify email address
          Please visit http://${env.get("HOST")}:${env.get("PORT")}/v1/account/validate-account?token=${user.validationToken}
          `
        );
    });
    console.log(user.validationToken);
  }

  async validatePost({ request, response }: HttpContext) {
    const payload = await request.validateUsing(validateAccountValidator);
    if (payload.token && (await this.validate(payload.token))) {
      return;
    } else {
      return response.forbidden("Invalid Token");
    }
  }

  async validateGet({ request, response }: HttpContext) {
    const { token } = request.qs();
    if (token && (await this.validate(token))) {
      return;
    } else {
      return response.forbidden("Invalid Token");
    }
  }

  private async validate(token: string) {
    const decodedToken = JWTService.decodeAuthCookie(token);
    if (!decodedToken) {
      return false;
    }

    const user = await User.query()
      .where("email", decodedToken.email)
      .where("id", decodedToken.id)
      .where("validationToken", token)
      .first();
    if (!user) {
      return false;
    }
    user.validated = true;
    user.validationToken = null;
    await user.save();
    return true;
  }
}
