import { Router } from "express";
import UserController from "./user.controller.js";
import { zodMiddleware } from "../../middlewares/zod.js";
import { updateUserValidation, userIdValidation } from "./user.validations.js";
import type { Routes } from "../../interface/routes.js";
import { jwtProtect } from "../../middlewares/jwt.js";
import { roleAndAccessCheck } from "../../middlewares/auth.guard.js";
import { SystemRole } from "@prisma/client";
import type { UserRepository } from "./user.repo.js";

export default class UserRouter implements Routes {
  router = Router();

  constructor(
    private userController: UserController,
    private userRepo: UserRepository,
  ) {
    this.userRoutes();
  }

  private userRoutes() {
    // this.router.post(
    //   "/users",
    //   zodMiddleware(userBodyValidation),
    //   this.userController.postedUser,
    // );

    this.router.get(
      "/users/:id",
      jwtProtect,
      zodMiddleware(userIdValidation),
      jwtProtect,
      this.userController.getUserById,
    );

    this.router.get("/users", jwtProtect, this.userController.getAllUsers);

    this.router.patch(
      "/users/:id",
      zodMiddleware(updateUserValidation),
      jwtProtect,
            roleAndAccessCheck([SystemRole.ADMIN], "id", (id: number) =>
        this.userRepo.findUserId(id),
      ),
      
      this.userController.updatedUser,
    );

    this.router.delete(
      "/users/:id",
      jwtProtect,
            roleAndAccessCheck([SystemRole.ADMIN], "id", (id: number) =>
        this.userRepo.findUserId(id),
      ),
      this.userController.deletedUser,
    );
  }
}
