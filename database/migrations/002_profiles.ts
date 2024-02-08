import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "profiles";

  async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .unique()
        .references("users.id")
        .onDelete("CASCADE");
      table.string("first_name");
      table.string("last_name");
      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
