import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { zodMiddleware } from "../middlewares/zod.js";
import {
  updateUserValidation,
  userBodyValidation,
  userIdValidation,
} from "../validations/user.validations.js";
import type { RouterInterface } from "../interface/user.router.interface.js";

export default class UserRouter implements RouterInterface {
  router = Router();

  constructor(private userController: UserController) {
    this.userRoutes();
  }

  private userRoutes() {
    this.router.post(
      "/users",
      zodMiddleware(userBodyValidation),
      this.userController.postedUserController,
    );


    this.router.get(
      "/users/:id",
      zodMiddleware(userIdValidation),
      this.userController.getUserByIdController,
    );

    this.router.get("/users", this.userController.getAllUsersController);

    this.router.patch(
      "/users/:id",
      zodMiddleware(updateUserValidation),
      this.userController.updatedUserController,
    );
  }
}
