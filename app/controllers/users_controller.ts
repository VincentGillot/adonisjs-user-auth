import type { HttpContext } from "@adonisjs/core/http";
import User, { UserRole } from "../models/user.js";
import {
  createUserValidator,
  deleteUserValidator,
  putUserProfileValidator,
  showUserValidator,
} from "../validators/user.js";
import Profile from "../models/profile.js";

export default class UsersController {
  async all({ request }: HttpContext) {
    const { page = 1, size = 10, ...qs } = request.qs();

    const query = User.query().preload("profile");
    if (qs.active) {
      const active = decodeURIComponent(qs.active);
      query.where("active", active);
    }
    if (qs.validated) {
      const validated = decodeURIComponent(qs.validated);
      query.where("validated", validated);
    }
    if (qs.firstName || qs.lastName) {
      query.has("profile");
      if (qs.firstName) {
        const firstName = `%${decodeURIComponent(qs.firstName)}%`;
        query.whereHas("profile", profileQuery => {
          profileQuery.whereLike("firstName", firstName);
        });
      }
      if (qs.lastName) {
        const lastName = `%${decodeURIComponent(qs.lastName)}%`;
        query.whereHas("profile", profileQuery => {
          profileQuery.whereLike("lastName", lastName);
        });
      }
    }

    const users = await query.paginate(page, size);

    return users;
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

  async putProfile({ request, response }: HttpContext) {
    const payload = await request.validateUsing(putUserProfileValidator);

    const user = await User.find(payload.params.id);
    if (!user) {
      return response.notFound();
    }

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

  async destroy({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteUserValidator);

    const user = await User.find(payload.params.id);
    if (!user) {
      return response.notFound();
    }
    await user.delete();
    return user.id;
  }
}
