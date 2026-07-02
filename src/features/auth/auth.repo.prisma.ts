import { prisma } from "../../config/prisma.js";
import type { User } from "@prisma/client";
import type { cleanData } from "../../interface/user.cleaned.js";
import type { AuthRepository } from "./auth.repo.js";
import type { loginType } from "./auth.validations.js";

export default class PrismaAuthRepository implements AuthRepository {
  async create(data: cleanData,hashedPassowrd:string): Promise<User> {
        return await prisma.user.create({ data:{
      ...data,
      password:hashedPassowrd
    } });
   
  }
  async login(data:loginType):Promise<{ id:number,password: string } | null>{
    return await prisma.user.findUnique({where:{
      email:data.email
    },
    select:{
      id:true,
      password:true
    }
  })
  }
}