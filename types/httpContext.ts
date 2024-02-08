import User from "../app/models/user.js";

interface HttpContextExtended {
  user: User;
}

declare module "@adonisjs/core/http" {
  interface HttpContext extends HttpContextExtended {}
}
