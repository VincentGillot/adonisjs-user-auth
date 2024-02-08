import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";
import User, { UserRole } from "../models/user.js";
import JWTService from "../services/jwt_service.js";

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class CookieAuthMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options?: {
      roles?: UserRole[];
    }
  ) {
    // Get cookie parsed
    const authCookie = JWTService.decodeAuthCookie(
      ctx.request.cookie("auth_token")
    );
    if (!authCookie) {
      return ctx.response.forbidden("Unauthorized");
    }
    // Get user from cookie
    const user = await User.query()
      .where("id", authCookie.id)
      .where("email", authCookie.email)
      .where("role", authCookie.role)
      .first();
    if (!user) {
      return ctx.response.forbidden("Unauthorized");
    }
    // Match user role if needed
    if (options && options.roles) {
      if (!options.roles?.includes(user.role)) {
        return ctx.response.forbidden("Unauthorized");
      }
    }
    ctx.user = user;
    return next();
  }
}
