import { Router } from "express";
import type ExperienceController from "./experience.controller.js";
import type { Routes } from "../../interface/routes.js";
import { zodMiddleware } from "../../middlewares/zod.js";
import {
  userIdValidation,
  experienceIdValidation,
  updateExperienceValidation,
  userIdExperienceBodyValidation,
} from "./experience.validations.js";
import { jwtProtect } from "../../middlewares/jwt.js";
import type ExperienceRepo from "./experience.repo.js";
import { roleAndAccessCheck } from "../../middlewares/auth.guard.js";
import { SystemRole } from "@prisma/client";

export default class ExperienceRouter implements Routes {
  router = Router();
  constructor(
    private experienceController: ExperienceController,
    private experienceRepo: ExperienceRepo,
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/users/:userId/experiences",
      zodMiddleware(userIdExperienceBodyValidation),
      jwtProtect,
      roleAndAccessCheck(
        [SystemRole.ADMIN],
        "userId",
        (id: number) =>  this.experienceRepo.fetchUserId(id),
      ),
      this.experienceController.createdExperience,
    );

    this.router.get(
      "/experiences",
      jwtProtect,
      this.experienceController.getAllExperience,
    );

    this.router.get(
      "/users/:userId/experiences",
      zodMiddleware(userIdValidation),
      jwtProtect,
      this.experienceController.getAllExperienceByUserId,
    );

    this.router.get(
      "/experiences/:experienceId",
      zodMiddleware(experienceIdValidation),
      jwtProtect,
      this.experienceController.getExperienceById,
    );

    this.router.patch(
      "/experiences/:experienceId",
      zodMiddleware(updateExperienceValidation),
      jwtProtect,
      roleAndAccessCheck(
        [SystemRole.ADMIN],
        "experienceId",
        (id: number) => this.experienceRepo.fetchUserIdByExperienceId(id),
      ),
      this.experienceController.updateExperience,
    );

    this.router.delete(
      "/experiences/:experienceId",
      zodMiddleware(experienceIdValidation),
      jwtProtect,
      roleAndAccessCheck([SystemRole.ADMIN], "experienceId", (id: number) =>
        this.experienceRepo.fetchUserIdByExperienceId(id),
      ),
      this.experienceController.deleteExperience,
    );
  }
}
