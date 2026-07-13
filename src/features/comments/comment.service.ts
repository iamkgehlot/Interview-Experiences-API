import { getLogger } from "../../context/logger.js";
import type CommentRepo from "./comment.repo.js";
import type { commentType, updateCommentType } from "./comment.validation.js";
const logger=()=>getLogger().child({
  module:"comment",
  service:"service"
})
export default class CommentService {
  constructor(private commentRepo: CommentRepo) {}

  create = async (experienceId: number, comment: commentType) => {
    const safeData = {
      userId: comment.userId,
      comment: comment.comment,
    };
    logger().info({experienceId:experienceId},"comment posted on given experience")
    return this.commentRepo.create(experienceId, safeData);
  };

  findByExperienceId = async (experienceId: number) => {
    logger().info({experienceId:experienceId},"comments fetched successfully for given experience")
    return await this.commentRepo.findAllByExperience(experienceId);
  };

  findByUserId = async (userId: number) => {
    logger().info({userId:userId},"comment fetched for user id")
    return await this.commentRepo.findAllByUser(userId);
  };

  update = async (commentId: number, comment: updateCommentType) => {
    const safeData = {
      comment: comment.comment,
    };
    logger().info({commentid:commentId},"comment fetched successfully")
    return await this.commentRepo.update(commentId, safeData);
  };

  delete = async (commentId: number) => {
    logger().info({commentid:commentId},"comment deleted successfully")
    return await this.commentRepo.delete(commentId);
  };
}
