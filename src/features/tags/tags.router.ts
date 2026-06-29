import { Router } from "express";
import type { Routes } from "../../interface/routes.js";
import type TagController from "./tag.controller.js";
import { zodMiddleware } from "../../middlewares/zod.js";
import { tagBodyValidation, tagIdValidation } from "./tag.validations.js";

export default class TagRouter implements Routes {
  constructor(private tagControler: TagController) {
    this.initaliazeRoutes();
  }
  router = Router();

  async initaliazeRoutes() {
    this.router.post("/tags/",zodMiddleware(tagBodyValidation), await this.tagControler.created);
    this.router.get("/tags/:tagId", zodMiddleware(tagIdValidation),await this.tagControler.findById);
    this.router.get("/tags/", await this.tagControler.findAll);
    this.router.patch("/tags/:tagId",zodMiddleware(tagBodyValidation) ,await this.tagControler.updated);
    this.router.delete("/tags/:tagId",zodMiddleware(tagIdValidation), await this.tagControler.deleted);
  }
}
