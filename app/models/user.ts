import { DateTime } from "luxon";
import { BaseModel, beforeSave, column, hasOne } from "@adonisjs/lucid/orm";
import hash from "@adonisjs/core/services/hash";
import JWTService from "../services/jwt_service.js";
import Profile from "./profile.js";
import type { HasOne } from "@adonisjs/lucid/types/relations";

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

  @column()
  declare active: boolean;

  @column()
  declare validated: boolean;

  @column({ serializeAs: null })
  declare validationToken: string | null;

  @hasOne(() => Profile, {
    foreignKey: "userId",
    localKey: "id",
  })
  declare profile: HasOne<typeof Profile>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password);
    }
  }

  static async verifyCredentials(email: string, password: string) {
    const user = await this.query().where("email", email).first();
    if (!user) {
      throw new Error("Invalid user credentials");
    }
    const isValid = await hash.verify(user.password, password);
    if (!isValid) {
      throw new Error("Invalid user credentials");
    }
    return user;
  }

  generateAuthCookieToken() {
    return JWTService.encodeAuthCookie({
      id: this.id,
      email: this.email,
      role: this.role,
    });
  }

  async generateValidationToken() {
    this.validationToken = JWTService.encodeValidationToken({
      id: this.id,
      email: this.email,
      role: this.role,
    });
    await this.save();
  }
}
