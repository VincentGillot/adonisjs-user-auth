import type { HttpContext } from "@adonisjs/core/http";
import User from "../models/user.js";

export default class AccountController {
  async getAccount({ user }: HttpContext) {
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
}
