import type { HttpContext } from "@adonisjs/core/http";
import User, { UserRole } from "../models/user.js";

export default class UsersController {
  async all(ctx: HttpContext) {
    // Return all users
    return await User.all();
  }

  async store({ request, response }: HttpContext) {
    // Create User in database
    const body = request.body();
    if (!body.email || !body.password) {
      return response.badRequest("Missing parameters");
    }

    const existingUser = await User.findBy("email", body.email);
    if (existingUser) {
      return response.conflict("User already exists");
    }

    const user = await User.create({
      email: body.email,
      password: body.password,
      role: UserRole.USER,
    });

    return user;
  }

  async show({ params, response }: HttpContext) {
    // Return user by ID
    const user = await User.find(params.id);
    if (!user) {
      return response.notFound();
    }
    return user;
  }

  async update({ params, request: { body } }: HttpContext) {
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
