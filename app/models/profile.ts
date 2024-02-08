import { BaseModel, column } from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";

export default class Profile extends BaseModel {
  static table = "profiles";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare firstName: string;

  @column()
  declare lastName: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;
}
