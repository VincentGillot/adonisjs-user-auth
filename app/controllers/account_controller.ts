import type { HttpContext } from "@adonisjs/core/http";
import User from "../models/user.js";
import JWTService from "../services/jwt_service.js";
import hash from "@adonisjs/core/services/hash";
import {
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  putProfileValidator,
  resetPasswordValidator,
} from "../validators/account.js";
import Profile from "../models/profile.js";

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
}
