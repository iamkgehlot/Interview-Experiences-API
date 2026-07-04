import type CommentRepo from "./comment.repo.js";
import type { commentType, updateCommentType } from "./comment.validation.js";

export default class CommentService {
  constructor(private commentRepo: CommentRepo) {}

  create = async (experieceId: number, comment: commentType) => {
    const safeData = {
      userId: comment.userId,
      comment: comment.comment,
    };
    return this.commentRepo.create(experieceId, safeData);
  };

  findByExperienceId = async (experienceId: number) => {
    return await this.commentRepo.findAllByExperience(experienceId);
  };

  findByUserId = async (userId: number) => {
    return await this.commentRepo.findAllByUser(userId);
  };

  update = async (commentId: number, comment: updateCommentType) => {
    const safeData = {
      comment: comment.comment,
    };
    return await this.commentRepo.update(commentId, safeData);
  };

  delete = async (commentId: number) => {
    return await this.commentRepo.delete(commentId);
  };

  findUserid = async (commentId: number) => {
    return await this.commentRepo.findUserId(commentId);
  };
}
