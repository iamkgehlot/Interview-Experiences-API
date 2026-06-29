import type { RequestHandler } from "express";
import type CommentService from "./comment.service.js";
import { COMMENT_MESSAGE, HTTP_STATUS } from "../../constants/constants.js";

export default class CommentController {
  constructor(private commentService: CommentService) {}

  create: RequestHandler = async (req, res) => {
    const experienceId = Number(req.params.experienceId);
    const comment = req.body;
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: COMMENT_MESSAGE.COMMENT_CREATED,
      data: await this.commentService.create(experienceId, comment),
    });
  };

  findByExperienceId: RequestHandler = async (req, res) => {
    const experienceId = Number(req.params.experienceId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: await this.commentService.findByExperienceId(experienceId),
    });
  };

  findByUserId: RequestHandler = async (req, res) => {
    const userId = Number(req.params.userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: await this.commentService.findByUserId(userId),
    });
  };

  update: RequestHandler = async (req, res) => {
    const commentId = Number(req.params.commentId);
    const comment = req.body;
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: COMMENT_MESSAGE.COMMENT_UPDATED,
      data: await this.commentService.update(commentId, comment),
    });
  };

  delete: RequestHandler = async (req, res) => {
    const commentId = Number(req.params.commentId);
    await this.commentService.delete(commentId);
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  };
}
