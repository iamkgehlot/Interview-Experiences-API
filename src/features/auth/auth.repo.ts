import type { User } from "../../generated/prisma/index.js";
import type { loginType, userType } from "./auth.validations.js";

export interface AuthRepository {
  create(data: userType,hashedPassowrd:string): Promise<User>;
  login(data:loginType):Promise<{ id:number,password: string} | null>;
}