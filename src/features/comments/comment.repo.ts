import type { Comment } from "../../generated/prisma/client.js";
import type { commentType } from "./comment.validation.js";

export default interface CommentRepo {
  create(experienceId: number, comment: commentType): Promise<Comment>;
  findAllByExperience(experienceId: number): Promise<Comment[]>;
  findAllByUser(userId: number): Promise<Comment[]>;
  update(commentId: number, comment: commentType): Promise<Comment>;
  delete(commentId: number): Promise<Comment>;
  findUserId(commentId:number):Promise<{userId:number}|null>
}
