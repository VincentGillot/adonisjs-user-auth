import type { HttpContext } from "@adonisjs/core/http";

export default class AccountController {
  async login(ctx: HttpContext) {
    ctx.request.body();
    console.log("login");
    console.log(ctx.request.body());
  }
}
