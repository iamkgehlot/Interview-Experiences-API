import { PrismaClient } from "../generated/prisma/client.js";
import type { IUserRepo } from "../interface/user.repository.interface.js";
import type { userType } from "../validations/user.validations.js";
export const prisma = new PrismaClient();

export default class PrismaUserRepository implements IUserRepo {
  async create(data: userType): Promise<userType> {
    return await prisma.user.create({ data });
  }

  async findAll(): Promise<userType[]> {
    return await prisma.user.findMany();
  }

  async findById(id: number): Promise<userType | null> {
    return await prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: userType): Promise<userType> {
    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
