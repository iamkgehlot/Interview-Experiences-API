import { Router } from "express";
import type { Routes } from "../../interface/routes.js";
import type TagController from "./tag.controller.js";
import { zodMiddleware } from "../../middlewares/zod.js";
import { tagBodyValidation, tagIdValidation } from "./tag.validations.js";
import { jwtProtect } from "../../middlewares/jwt.js";

export default class TagRouter implements Routes {
  constructor(private tagControler: TagController) {
    this.initaliazeRoutes();
  }
  router = Router();

  initaliazeRoutes() {
    this.router.post(
      "/tags/",
      jwtProtect,
      zodMiddleware(tagBodyValidation),
      this.tagControler.created,
    );
    this.router.get(
      "/tags/:tagId",
      jwtProtect,
      zodMiddleware(tagIdValidation),
      this.tagControler.findById,
    );
    this.router.get("/tags/", jwtProtect, this.tagControler.findAll);
    this.router.patch(
      "/tags/:tagId",
      jwtProtect,
      zodMiddleware(tagBodyValidation),
      this.tagControler.updated,
    );
    this.router.delete(
      "/tags/:tagId",
      jwtProtect,
      zodMiddleware(tagIdValidation),
      this.tagControler.deleted,
    );
  }
}
