import { Router } from "express";
import type ExperienceController from "./experience.controller.js";
import type { Routes } from "../../interface/routes.js";
import { zodMiddleware } from "../../middlewares/zod.js";
import { userIdValidation, experienceIdValidation, updateExperienceValidation, userIdExperienceBodyValidation } from "./experience.validations.js";


export default class ExperienceRouter implements Routes {
  router = Router();
  constructor(private experienceController: ExperienceController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.post(
      "/users/:userId/experiences",zodMiddleware(userIdExperienceBodyValidation),
      this.experienceController.createdExperience,
    );

    this.router.get("/experiences", this.experienceController.getAllExperience);

    this.router.get(
      "/users/:userId/experiences",zodMiddleware(userIdValidation),
      this.experienceController.getAllExperienceByUserId,
    );

    this.router.get(
      "/experiences/:experienceId",zodMiddleware(experienceIdValidation),
      this.experienceController.getExperienceById,
    );

    this.router.patch(
      "/experiences/:experienceId",zodMiddleware(updateExperienceValidation),
      this.experienceController.updateExperience,
    );

    this.router.delete(
      "/experiences/:experienceId",zodMiddleware(experienceIdValidation),
      this.experienceController.deleteExperience,
    );
  }
}
