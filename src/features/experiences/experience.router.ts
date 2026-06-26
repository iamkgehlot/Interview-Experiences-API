import { Router } from "express";
import type ExperienceController from "./experience.controller.js";
import type { Routes } from "../../interface/routes.js";

export default class ExperienceRouter implements Routes {
  router = Router();
  constructor(private experienceController: ExperienceController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/users/:userId/experiences",
      this.experienceController.createdExperience,
    );
    this.router.get("/experiences", this.experienceController.getAllExperience);
    this.router.get(
      "/users/:userId/experiences",
      this.experienceController.getAllExperienceByUserId,
    );
    this.router.get(
      "/experiences/:experienceId",
      this.experienceController.getExperienceById,
    );
    this.router.patch(
      "/experiences/:experienceId",
      this.experienceController.updateExperience,
    );
    this.router.delete(
      "/experiences/:experienceId",
      this.experienceController.deleteExperience,
    );
  }
}
