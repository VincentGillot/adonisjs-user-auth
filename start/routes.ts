/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router";
import AccountController from "../app/controllers/account_controller.js";
import { middleware } from "./kernel.js";
import { UserRole } from "../app/models/user.js";
const UsersController = () => import("../app/controllers/users_controller.js");

router.on("/").redirect("/v1");

router
  .group(() => {
    // INDEX
    router.get("/", () => {
      return "Hello world from the home page.";
    });

    // USERS
    router
      .group(() => {
        // GET ALL
        router.get("/", [UsersController, "all"]);
        // GET BY ID
        router.get("/:id", [UsersController, "show"]);
        // CREATE
        router.post("/", [UsersController, "store"]);
        // EDIT
        router.post("/:id", [UsersController, "update"]);
        // DELETE
        router.delete("/:id", [UsersController, "destroy"]);
      })
      .prefix("/users")
      .use(
        middleware.cookieAuth({
          roles: [UserRole.ADMIN],
        })
      );

    // ACCOUNT
    router
      .group(() => {
        router
          .group(() => {
            // AUTH ACCOUNT
            router.get("/", [AccountController, "getAccount"]);
            router.get("/auth", [AccountController, "auth"]);
          })
          .use(middleware.cookieAuth());
        // UNAUTH ACCOUNT
        router.post("/login", [AccountController, "login"]);
        router.delete("/logout", [AccountController, "logout"]);
        router.post("/forgot-password", [AccountController, "forgotPassword"]);
        router.post("/reset-password", [AccountController, "resetPassword"]);
      })
      .prefix("/account");
  })
  .prefix("/v1");
