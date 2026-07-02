import type { Comment } from "@prisma/client";

import type { commentType, updateCommentType } from "./comment.validation.js";

export default interface CommentRepo {
  create(experienceId: number, comment: commentType): Promise<Comment>;
  findAllByExperience(experienceId: number): Promise<Comment[]>;
  findAllByUser(userId: number): Promise<Comment[]>;
  update(commentId: number, comment: updateCommentType): Promise<Comment>;
  delete(commentId: number): Promise<Comment>;
  findUserId(commentId:number):Promise<{userId:number}|null>
}
