import { type User } from "@prisma/client";
import type { UserRepository } from "./user.repo.js";
import type { userType } from "./user.validations.js";
import { prisma } from "../../config/prisma.js";
import type { SafeUser } from "./user.return.js";

export default class PrismaUserRepository implements UserRepository {
  // async create(data: userType): Promise<User> {
  //   return await prisma.user.create({ data });
  // }

  async findAll(): Promise<SafeUser[]> {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        age: true,
        yearsOfExperience: true,
        current_role: true,
        industry: true,
      },
    });
  }

  async findById(id: number): Promise<SafeUser | null> {
    return await prisma.user.findFirst({
      where: {
        id,
      },
      select:{
         id: true,
        name: true,
        role: true,
        email: true,
        age: true,
        yearsOfExperience: true,
        current_role: true,
        industry: true,

      }
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
    return await prisma.user.delete({ where: { id } });
  }

  async findUserId(id: number): Promise<{ userId: number } | null> {
    const userIdfetched = await prisma.user.findFirst({
      where: { id },
      select: { id: true },
    });
    return userIdfetched ? { userId: userIdfetched.id } : null;
  }
}
