import type { HttpContext } from "@adonisjs/core/http";
import User, { UserRole } from "../models/user.js";
import { createUserValidator, showUserValidator } from "../validators/user.js";

export default class UsersController {
  async all(ctx: HttpContext) {
    // Return all users
    return await User.query().preload("profile");
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator);

    const existingUser = await User.findBy("email", payload.email);
    if (existingUser) {
      return response.conflict("User already exists");
    }

    const user = await User.create({
      email: payload.email,
      password: payload.password,
      role: UserRole.USER,
    });

    return user;
  }

  async show({ request, response }: HttpContext) {
    const payload = await request.validateUsing(showUserValidator);

    const user = await User.query()
      .preload("profile")
      .where("id", payload.params.id);
    if (!user) {
      return response.notFound();
    }
    return user;
  }

  async putProfile({ params, request: { body } }: HttpContext) {
    // Update user information by ID
    return {
      id: params.id,
      username: "virk",
    };
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id);
    if (!user) {
      return response.notFound();
    }

    await user.delete();

    return user.id;
  }
}
