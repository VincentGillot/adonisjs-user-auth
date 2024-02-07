import { BaseSchema } from "@adonisjs/lucid/schema";
import { UserRole } from "../../app/models/user.js";

export default class extends BaseSchema {
  protected tableName = "users";

  async up() {
    this.schema.alterTable(this.tableName, table => {
      table
        .enu("role", Object.values(UserRole), {
          enumName: "user_role",
          useNative: true,
        })
        .notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
