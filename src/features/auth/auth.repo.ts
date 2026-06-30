
import type { CleanedUser } from "../../interface/user.cleaned.js";
import type { loginType, userType } from "./auth.validations.js";

export interface AuthRepository {
  create(data: userType,hashedPassowrd:string): Promise<CleanedUser>;
  login(data:loginType):Promise<{ id:number,password: string} | null>;
}