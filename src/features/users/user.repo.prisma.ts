import type { UserRepository } from "./user.repo.js";
import type { userType } from "./user.validations.js";
import { prisma } from "../../config/prisma.js";
import type { UserDTOType } from "./user.DTO.js";


export default class PrismaUserRepository implements UserRepository {
  // async create(data: userType): Promise<User> {
  //   return await prisma.user.create({ data });
  // }

  async findAll(): Promise<UserDTOType[]> {
    return await prisma.user.findMany({
    omit:{
      password:false
    }
    });
  }

  async findById(id: number): Promise<UserDTOType | null> {
    return await prisma.user.findFirst({
      where: {
        id,
      },
     omit:{
      password:false
     }
    });
  }

  async update(id: number, data: userType): Promise<UserDTOType> {
    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number): Promise<UserDTOType> {
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
