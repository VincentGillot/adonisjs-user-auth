import type { HttpContext } from "@adonisjs/core/http";
import User from "../models/user.js";
import JWTService from "../services/jwt_service.js";
import hash from "@adonisjs/core/services/hash";
import { putProfileValidator } from "../validators/account.js";

export default class AccountController {
  async getAccount({ user }: HttpContext) {
    await user.load("profile");
    return user;
  }

  async login({ request, response }: HttpContext) {
    const body = request.body();
    try {
      const user = await User.verifyCredentials(body.email, body.password);
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
    const body = request.body();
    const user = await User.findBy("email", body.email);
    if (user) {
      user.generateValidationToken();
      console.log(user.validationToken);
    }
  }

  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.body();
    const decodedToken = JWTService.decodeAuthCookie(token);
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
    user.password = password;
    user.validationToken = null;
    await user.save();
  }

  async changePassword({ request, response, user }: HttpContext) {
    const { oldPassword, newPassword } = request.body();
    if (!oldPassword || !newPassword) {
      return response.badRequest("Missing parameters");
    }
    if (!(await hash.verify(user.password, oldPassword))) {
      return response.unauthorized("Wrong Password");
    }
    user.password = newPassword;
    await user.save();
  }

  async putProfile({ request, response, user }: HttpContext) {
    const payload = await request.validateUsing(putProfileValidator);

    console.log(payload);
  }
}
