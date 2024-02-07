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
      .prefix("/users");

    // ACCOUNT
    router
      .group(() => {
        // GET ALL
        router.post("/login", [AccountController, "login"]);
      })
      .prefix("/account");
  })
  .prefix("/v1");
