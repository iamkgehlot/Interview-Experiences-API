import { Router } from "express";
import type { Routes } from "../../interface/routes.js";
import type CommentController from "./comment.controller.js";
import { zodMiddleware } from "../../middlewares/zod.js";
import {
  commentBodyExperienceIDValidation,
  commentIdCommentBodyValidation,
  commentIdValidation,
  experienceIdValidation,
  userIdValidation,
} from "./comment.validation.js";
import { jwtProtect } from "../../middlewares/jwt.js";
import { roleAndAccessCheck } from "../../middlewares/auth.guard.js";
import { SystemRole } from "@prisma/client";
import type CommentRepo from "./comment.repo.js";

export default class CommentRouter implements Routes {
  router = Router();
  constructor(
    private commentController: CommentController,
    private commentRepo: CommentRepo,
  ) {
    this.initializeComment();
  }

  initializeComment() {
    this.router.post(
      "/experiences/:experienceId/comments",
      zodMiddleware(commentBodyExperienceIDValidation),
      jwtProtect,
      this.commentController.create,
    );
    this.router.get(
      "/experiences/:experienceId/comments",
      zodMiddleware(experienceIdValidation),
      jwtProtect,
      this.commentController.findByExperienceId,
    );
    this.router.get(
      "/users/:userId/comments",
      zodMiddleware(userIdValidation),
      jwtProtect,
      this.commentController.findByUserId,
    );
    this.router.patch(
      "/comments/:commentId",
      zodMiddleware(commentIdCommentBodyValidation),
      jwtProtect,
      roleAndAccessCheck([SystemRole.ADMIN], "commentId", (id) =>
        this.commentRepo.findUserId(id),
      ),
      this.commentController.update,
    );
    this.router.delete(
      "/comments/:commentId",
      zodMiddleware(commentIdValidation),
      jwtProtect,
      roleAndAccessCheck([SystemRole.ADMIN], "commentId", (id) =>
        this.commentRepo.findUserId(id),
      ),
      this.commentController.delete,
    );
  }
}
