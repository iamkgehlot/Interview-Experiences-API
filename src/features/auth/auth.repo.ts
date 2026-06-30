
import type { User } from "../../generated/prisma/index.js";
import type { cleanData } from "../../interface/user.cleaned.js";
import type { loginType } from "./auth.validations.js";

export interface AuthRepository {
  create(data: cleanData,hashedPassowrd:string): Promise<User>;
  login(data:loginType):Promise<{ id:number,password: string} | null>;
}