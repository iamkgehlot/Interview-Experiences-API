import { type User } from "@prisma/client";
import type { UserRepository } from "./user.repo.js";
import type { userType } from "./user.validations.js";
import { prisma } from "../../config/prisma.js";

export default class PrismaUserRepository implements UserRepository {
  // async create(data: userType): Promise<User> {
  //   return await prisma.user.create({ data });
  // }

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: userType): Promise<User> {
    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [tagdel, commentDel, experienceDel, userDel] =
      await prisma.$transaction([
        prisma.tag.deleteMany({ where: { createdByUserid: id } }),
        prisma.comment.deleteMany({ where: { userId: id } }),
        prisma.experience.deleteMany({ where: { userId: id } }),

        prisma.user.delete({ where: { id } }),
      ]);
    return userDel;
  }
}
