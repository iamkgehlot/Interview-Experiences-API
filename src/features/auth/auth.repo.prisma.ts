import { prisma } from "../../config/prisma.js";
import type { CleanedUser } from "../../interface/user.cleaned.js";
import type { AuthRepository } from "./auth.repo.js";
import type { loginType, userType } from "./auth.validations.js";

export default class PrismaAuthRepository implements AuthRepository {
  async create(data: userType,hashedPassowrd:string): Promise<CleanedUser> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password,...cleanedUser} =await prisma.user.create({ data:{
      ...data,
      password:hashedPassowrd
    } });
    return cleanedUser;
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