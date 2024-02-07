import { BaseSeeder } from "@adonisjs/lucid/seeders";
import User, { UserRole } from "../../app/models/user.js";

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const user = await User.findBy("email", "admin@example.com");
    if (!user) {
      await User.create({
        email: "admin@example.com",
        role: UserRole.ADMIN,
        password: "asdf",
      });
    }
  }
}
