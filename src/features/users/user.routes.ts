import { Router } from "express";
import UserController from "./user.controller.js";
import { zodMiddleware } from "../../middlewares/zod.js";
import {
  updateUserValidation,
  userBodyValidation,
  userIdValidation,
} from "./user.validations.js";
import type { Routes } from "../../interface/routes.js";

export default class UserRouter implements Routes {
  router = Router();

  constructor(private userController: UserController) {
    this.userRoutes();
  }

  private userRoutes() {
    this.router.post(
      "/users",
      zodMiddleware(userBodyValidation),
      this.userController.postedUser,
    );


    this.router.get(
      "/users/:id",
      zodMiddleware(userIdValidation),
      this.userController.getUserById,
    );

    this.router.get("/users", this.userController.getAllUsers);

    this.router.patch(
      "/users/:id",
      zodMiddleware(updateUserValidation),
      this.userController.updatedUser,
    );
    
    this.router.delete("/users/:id",this.userController.deletedUser)
  }
}
