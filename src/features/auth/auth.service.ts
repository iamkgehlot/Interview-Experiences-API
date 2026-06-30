import type { AuthRepository } from "./auth.repo.js";
import type { loginType, userType } from "./auth.validations.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { envConfig } from "../../config/env.config.js";
import type login from "../../interface/login.service.promise.js";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../constants/constants.js";
import AppError from "../../utils/error.handler.js";
import type { CleanedUser } from "../../interface/user.cleaned.js";

export default class AuthService {
  constructor(public authRepo: AuthRepository) {}

  register = async (data: userType): Promise<CleanedUser> => {
    const { password,...cleanData }=data;
    const saltRounds = 10;
    const hashedPassowrd = await bcrypt.hash(password, saltRounds);
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const {password:p,...user}=await this.authRepo.create(cleanData,hashedPassowrd);
  return user;
    
  };

  login = async (data: loginType): Promise<login> => {
    const user = await this.authRepo.login(data);
    if (!user) {
      throw new AppError(HTTP_STATUS.UNAUTHORISED,ERROR_MESSAGE.INVALID_CREDENTIALS);
    }
    const result = await bcrypt.compare(data.password, user.password);
    if (!result) {
     throw new AppError(HTTP_STATUS.UNAUTHORISED,ERROR_MESSAGE.INVALID_CREDENTIALS);
    }
  
    const token = jwt.sign({ sub: user.id }, envConfig.JWT_SECRET!, {
      expiresIn: Number(envConfig.JWT_EXPIRES_IN),
    });

    return {
      userId: user.id,
      token,
    };
  };
}
