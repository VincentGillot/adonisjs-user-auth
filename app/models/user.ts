import { DateTime } from "luxon";
import { BaseModel, column } from "@adonisjs/lucid/orm";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}
export default class User extends BaseModel {
  static table = "users";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare email: string;

  @column({ serializeAs: null })
  declare password: string;

  @column()
  declare role: UserRole;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;
}
