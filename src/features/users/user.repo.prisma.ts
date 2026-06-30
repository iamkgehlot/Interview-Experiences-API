import { type User } from "../../generated/prisma/client.js";
import type { UserRepository } from "./user.repo.js";
import type { userType } from "./user.validations.js";
import {prisma } from "../../config/prisma.js";

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
  
  async delete(id:number):Promise<User>{
    return await prisma.user.delete({where:{
      id
    }})
  }
}
