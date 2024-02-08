import env from "../../start/env.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

interface AuthCookieBody {
  id: User["id"];
  email: User["email"];
  role: User["role"];
}

export default class JWTService {
  static encodeAuthCookie(body: AuthCookieBody) {
    return jwt.sign(body, env.get("APP_KEY"), {
      expiresIn: "30d",
    });
  }

  static decodeAuthCookie(token: string): AuthCookieBody | null {
    try {
      return jwt.verify(token, env.get("APP_KEY")) as AuthCookieBody;
    } catch (error) {
      return null;
    }
  }
}
