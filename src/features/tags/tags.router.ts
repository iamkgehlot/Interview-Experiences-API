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
    this.router.post("/tags/",zodMiddleware(tagBodyValidation),  this.tagControler.created);
    this.router.get("/tags/:tagId", zodMiddleware(tagIdValidation), this.tagControler.findById);
    this.router.get("/tags/",  this.tagControler.findAll);
    this.router.patch("/tags/:tagId",zodMiddleware(tagBodyValidation) , this.tagControler.updated);
    this.router.delete("/tags/:tagId",zodMiddleware(tagIdValidation),  this.tagControler.deleted);
  }
}
