import { Router } from "express";
import { zodMiddleware } from "../../middlewares/zod.js";
import type { Routes } from "../../interface/routes.js";
import type AuthController from "./auth.controller.js";
import { loginValidation, userBodyValidation } from "./auth.validations.js";
import { refreshTokenCheck } from "../../middlewares/refresh.jwt.js";


export default class AuthRouter implements Routes {
  router = Router();

  constructor(private authController: AuthController) {
    this.authRoutes();
  }

  private authRoutes() {
    this.router.post(
      "/register",
      zodMiddleware(userBodyValidation),
      this.authController.registeredUser,
    );

    this.router.post(
      "/login",
      zodMiddleware(loginValidation),
      this.authController.loggedInUser,
    );
    this.router.post(
      "/logout",
      refreshTokenCheck,
      this.authController.loggedOutUser,
    );

    this.router.post(
      "/refresh",
      refreshTokenCheck,
      this.authController.refreshToken,
    );
  }
}
