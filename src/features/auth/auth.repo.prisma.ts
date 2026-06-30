import { prisma } from "../../config/prisma.js";
import type { User } from "../../generated/prisma/index.js";
import type { AuthRepository } from "./auth.repo.js";
import type { loginType, userType } from "./auth.validations.js";

export default class PrismaAuthRepository implements AuthRepository {
  async create(data: userType,hashedPassowrd:string): Promise<User> {
    return await prisma.user.create({ data });
  }
  async login(data:loginType):Promise<{ id:number,password: string } | null>{
    return await prisma.user.findFirst({where:{
      email:data.email
    },
    select:{
      id:true,
      password:true
    }
  })
  }
}