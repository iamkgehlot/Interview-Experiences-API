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

export default class CommentRouter implements Routes {
  router = Router();
  constructor(private commentController: CommentController) {
    this.initalizeComment();
  }

  initalizeComment() {
    this.router.post(
      "/experiences/:experienceId/comments",
      zodMiddleware(commentBodyExperienceIDValidation),
      this.commentController.create,
    );
    this.router.get(
      "/experiences/:experienceId/comments",
      zodMiddleware(experienceIdValidation),
      this.commentController.findByExperienceId,
    );
    this.router.get(
      "/users/:userId/comments",
      zodMiddleware(userIdValidation),
      this.commentController.findByUserId,
    );
    this.router.patch(
      "/comments/:commentId",
      zodMiddleware(commentIdCommentBodyValidation),
      this.commentController.update,
    );
    this.router.delete(
      "/comments/:commentId",
      zodMiddleware(commentIdValidation),
      this.commentController.delete,
    );
  }
}
