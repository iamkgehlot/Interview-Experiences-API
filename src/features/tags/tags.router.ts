import { Router } from "express";
import type { Routes } from "../../interface/routes.js";
import type TagController from "./tag.controller.js";
import { zodMiddleware } from "../../middlewares/zod.js";
import { tagBodyValidation, tagIdValidation } from "./tag.validations.js";
import { jwtProtect } from "../../middlewares/jwt.js";
import { roleAndAccessCheck } from "../../middlewares/auth.gaurd.js";
import { SystemRole } from "@prisma/client";
import type TagsRepo from "./tag.repo.js";

export default class TagRouter implements Routes {
  constructor(
    private tagControler: TagController,
    private tagRepo: TagsRepo,
  ) {
    this.initaliazeRoutes();
  }
  router = Router();

  initaliazeRoutes() {
    this.router.post(
      "/tags/",
      zodMiddleware(tagBodyValidation),
      jwtProtect,
      this.tagControler.created,
    );
    this.router.get(
      "/tags/:tagId",
      zodMiddleware(tagIdValidation),
      jwtProtect,
      this.tagControler.findById,
    );
    this.router.get("/tags/", jwtProtect, this.tagControler.findAll);
    this.router.patch(
      "/tags/:tagId",
      zodMiddleware(tagBodyValidation),
      jwtProtect,
      roleAndAccessCheck(
        [SystemRole.ADMIN],
        "tagId",
        (id) => this.tagRepo.findUserId(id),
      ),
      this.tagControler.updated,
    );
    this.router.delete(
      "/tags/:tagId",
      zodMiddleware(tagIdValidation),
      jwtProtect,
      roleAndAccessCheck([SystemRole.ADMIN], "tagId", (id) =>
        this.tagRepo.findUserId(id),
      ),
      this.tagControler.deleted,
    );
  }
}
