import { BaseSeeder } from "@adonisjs/lucid/seeders";
import User, { UserRole } from "../../app/models/user.js";
import env from "../../start/env.js";

export default class extends BaseSeeder {
  async run() {
    const user = await User.findBy("email", "admin@example.com");

    const email = env.get("DEFAULT_ADMIN_EMAIL");
    const password = env.get("DEFAULT_ADMIN_PASSWORD");

    if (!user) {
      await User.create({
        email: email,
        role: UserRole.ADMIN,
        password: password,
      });
    }
  }
}
