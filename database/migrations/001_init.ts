import { BaseSchema } from "@adonisjs/lucid/schema";
import { UserRole } from "../../app/models/user.js";

export default class extends BaseSchema {
  protected tableName = "users";

  async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments("id");
      table.string("email", 254).notNullable().unique();
      table.string("password").notNullable();
      table
        .enu("role", Object.values(UserRole), {
          enumName: "user_role",
          useNative: true,
        })
        .notNullable();
      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
