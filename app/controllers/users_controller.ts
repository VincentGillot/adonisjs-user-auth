import type { HttpContext } from "@adonisjs/core/http";
import User from "../models/user.js";

export default class UsersController {
  async all(ctx: HttpContext) {
    // Return all users
    return [
      {
        id: 1,
        username: "virk",
      },
      {
        id: 2,
        username: "romain",
      },
    ];
  }

  async store({ request }: HttpContext) {
    // Create User in database
    const body = request.body();
    if (!body.email || !body.password) {
      throw new Error("Missing params");
    }

    const user = await User.create({
      email: body.email,
      password: body.password,
    });

    return user;
  }

  async show({ params }: HttpContext) {
    // Return user by ID
    return {
      id: params.id,
      username: "virk",
    };
  }

  async update({ params, request: { body } }: HttpContext) {
    // Update user information by ID
    return {
      id: params.id,
      username: "virk",
    };
  }

  async destroy({ params }: HttpContext) {
    if (!params.id) {
      throw new Error("Missing ID");
    }
    const user = await User.find(params.id);
    if (!user) {
      throw new Error("Not Found");
    }
    await user.delete();

    return user.id;
  }
}
