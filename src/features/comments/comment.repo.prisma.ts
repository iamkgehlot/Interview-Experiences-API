import { prisma } from "../../config/prisma.js";
import type { Comment } from "../../generated/prisma/client.js";
import type CommentRepo from "./comment.repo.js";
import type { commentType } from "./comment.validation.js";

export default class PrismaCommentRepo implements CommentRepo {
  async create(experienceId: number, comment: commentType): Promise<Comment> {
    console.log( await prisma.comment.create({ data: { ...comment, experienceId } }))
    return await prisma.comment.create({ data: { ...comment, experienceId } });
  }

  async findAllByExperience(experienceId: number): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: {
        experienceId,
      },
    });
  }

  async findAllByUser(userId: number): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: {
        userId,
      },
    });
  }

  async update(commentId: number, comment: commentType): Promise<Comment> {
    return await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: comment,
    });
  }

  async delete(commentId: number): Promise<Comment> {
    return await prisma.comment.delete({ where: { id: commentId } });
  }
}
