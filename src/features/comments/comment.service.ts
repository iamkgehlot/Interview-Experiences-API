import type CommentRepo from "./comment.repo.js";
import type { commentType } from "./comment.validation.js";

export default class CommentService {
  constructor(private commentRepo: CommentRepo) {}

  create = async (experieceId: number, comment: commentType) => {
    console.log(experieceId,comment)
    return this.commentRepo.create(experieceId, comment);
  };

  findByExperienceId = async (experienceId: number) => {
   
    return await this.commentRepo.findAllByExperience(experienceId);
  };

  findByUserId = async (userId: number) => {
    return await this.commentRepo.findAllByUser(userId);
  };

  update = async (commentId: number, comment: commentType) => {
    return await this.commentRepo.update(commentId, comment);
  };

  delete = async (commentId: number) => {
    return await this.commentRepo.delete(commentId);
  };

  findUserid=async(commentId:number)=>{
    return await this.commentRepo.findUserId(commentId);
  }
}
