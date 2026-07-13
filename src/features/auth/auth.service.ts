import type { AuthRepository } from "./auth.repo.js";
import {
  userBodySchema,
  type loginType,
  type userType,
} from "./auth.validations.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { envConfig } from "../../config/env.config.js";

import { ERROR_MESSAGE, HTTP_STATUS } from "../../constants/constants.js";
import AppError from "../../utils/error.handler.js";
import type { StringValue } from "ms";
import { SystemRole } from "@prisma/client";
import { userDTO, type UserDTOType } from "../../types/user.DTO.js";
import { getLogger } from "../../context/logger.js";

//
interface login {
  userId: number;
  accessToken: string;
  refreshToken: string;
}

const logger=() => getLogger().child({
    service: "service",
    module: "auth",
  });

export default class AuthService {
  
  constructor(public authRepo: AuthRepository) {}

  register = async (data: userType): Promise<UserDTOType> => {
    //sanitizing incoming data here so service layer is not dependent on controller or zodmiddleware
    const safeData = userBodySchema.parse(data);

    const { password: pIncoming, ...cleanData } = safeData;
    const role = SystemRole.USER;

    const saltRounds = 10;
    const password = await bcrypt.hash(pIncoming, saltRounds);

    const fullData = { role, password, ...cleanData };

    const user = await this.authRepo.create(fullData);

    //service layer is independent of incoming data from repo.
    //mistaken password leak from repo will be handled below
    const safeUser = userDTO.parse(user);
    logger().info({ userId: safeUser.id }, "user registered successfully");
    return safeUser;
  };

  login = async (data: loginType): Promise<login> => {
    //check login id password in db
    const user = await this.authRepo.login(data);
    if (!user) {
      logger().warn({ user: data.email }, "invalid user credentials");
      throw new AppError(
        HTTP_STATUS.UNAUTHORISED,
        ERROR_MESSAGE.INVALID_CREDENTIALS,
      );
    }
    const result = await bcrypt.compare(data.password, user.password);
    if (!result) {
      logger().warn({ userEmail: data.email }, "invalid user credentials");
      throw new AppError(
        HTTP_STATUS.UNAUTHORISED,
        ERROR_MESSAGE.INVALID_CREDENTIALS,
      );
    }

    //create new accessToken after id pass verification
    const accessToken = jwt.sign(
      { sub: String(user.id), role: user.role },
      envConfig.JWT_SECRET!,
      {
        expiresIn: envConfig.JWT_EXPIRES_IN,
      },
    );

    //generate refresh token
    const refreshToken = jwt.sign(
      { sub: String(user.id), role: user.role },
      envConfig.REFRESH_JWT_SECRET,
      { expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue },
    );

    //Get exp time of refresh token
    const expTimeObj = jwt.verify(
      refreshToken,
      envConfig.REFRESH_JWT_SECRET,
    ) as { exp: number };
    const expTime = new Date(expTimeObj.exp * 1000);

    //save new refresh token in db
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const savedToken = await this.authRepo.createRefreshToken(
      user.id,
      refreshToken,
      expTime,
    );
    logger().info({ userId: user.id }, "logged in successfully");

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  };

  refreshToken = async (
    token: string,
  ): Promise<{ refreshToken: string; accessToken: string }> => {
    //get user id and role from incoming refresh token
    const userIdObj = jwt.verify(token, envConfig.REFRESH_JWT_SECRET) as {
      sub: string;
      role: SystemRole;
    };

    const userId = Number(userIdObj.sub);
    const role = userIdObj.role;

    // check if incoming token exists in db
    const oldToken = await this.authRepo.refreshToken(token);

    //if not delete all active refresh token of user. forcing him to login again
    if (!oldToken?.token) {
      await this.authRepo.deleteRefreshToken(userId);
      logger().warn({ userId: userId }, "refresh token mismatch detected");
      throw new AppError(HTTP_STATUS.FORBIDDEN, "security breach");
    }

    //generate new refresh token if old token is verified
    const newToken = jwt.sign(
      { sub: userId, role: role },
      envConfig.REFRESH_JWT_SECRET,
      {
        expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue,
      },
    );
    const newExpiryDateObj = jwt.verify(
      newToken,
      envConfig.REFRESH_JWT_SECRET,
    ) as { exp: number };
    const newExpiryDate = newExpiryDateObj.exp * 1000; //

    //generate new accesss token
    const newAccessToken = jwt.sign(
      { sub: userId, role: role },
      envConfig.JWT_SECRET,
      {
        expiresIn: envConfig.JWT_EXPIRES_IN,
      },
    );

    //replace new refresh token in db
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const replacedToken = await this.authRepo.replaceRefreshToken(
      oldToken!.token,
      newToken,
      new Date(newExpiryDate),
    );
    logger().info({ userId: userId }, "user logged in successfully");
    return { refreshToken: newToken, accessToken: newAccessToken };
  };

  logOut = async (token: string): Promise<number> => {
    const logoutUser = await this.authRepo.logOut(token);
    logger().info({ userId: logoutUser.id }, "user logged out from system");
    return logoutUser.id;
  };
}
