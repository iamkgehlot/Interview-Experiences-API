import type { AuthRepository } from "./auth.repo.js";
import type { loginType, userType } from "./auth.validations.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { envConfig } from "../../config/env.config.js";
import type login from "../../interface/login.service.promise.js";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../constants/constants.js";
import AppError from "../../utils/error.handler.js";
import type { CleanedUser } from "../../interface/user.cleaned.js";
import type { StringValue } from "ms";

export default class AuthService {
  constructor(public authRepo: AuthRepository) {}

  register = async (data: userType): Promise<CleanedUser> => {
    const { password, ...cleanData } = data;
    const saltRounds = 10;
    const hashedPassowrd = await bcrypt.hash(password, saltRounds);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...user } = await this.authRepo.create(
      cleanData,
      hashedPassowrd,
    );
    return user;
  };

  login = async (data: loginType): Promise<login> => {
    const user = await this.authRepo.login(data);
    if (!user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORISED,
        ERROR_MESSAGE.INVALID_CREDENTIALS,
      );
    }
    const result = await bcrypt.compare(data.password, user.password);
    if (!result) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORISED,
        ERROR_MESSAGE.INVALID_CREDENTIALS,
      );
    }

    const accessToken = jwt.sign(
      { sub: String(user.id) },
      envConfig.JWT_SECRET!,
      {
        expiresIn: envConfig.JWT_EXPIRES_IN,
      },
    );

    const refreshToken = jwt.sign(
      { sub: String(user.id) },
      envConfig.REFRESH_JWT_SECRET,
      { expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue },
    );

    const dateMs = Date.now();
    const DaysToMs7 = 7 * 24 * 60 * 60 * 1000;
    const nowPlus7Days = dateMs + DaysToMs7;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const savedToken = await this.authRepo.createRefreshToken(
      user.id,
      refreshToken,
      new Date(nowPlus7Days),
    );

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  };

  refreshToken = async (
    token: string,
  ): Promise<{ refreshToken: string; acessToken: string }> => {
    const userIdObj = jwt.verify(token, envConfig.REFRESH_JWT_SECRET) as {
      sub: string;
    };

    const userId = Number(userIdObj.sub);

    const oldToken = await this.authRepo.refreshToken(token);

    if (!oldToken?.token) {
      await this.authRepo.deleteRefreshToken(userId);
      throw new AppError(HTTP_STATUS.FORBIDDEN, "security breach");
    }

    const newToken = jwt.sign({ sub: userId }, envConfig.REFRESH_JWT_SECRET, {
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue,
    });

    const newAccessToken = jwt.sign({ sub: userId }, envConfig.JWT_SECRET, {
      expiresIn: envConfig.JWT_EXPIRES_IN,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const replacedToken = await this.authRepo.replaceRefreshToken(
      oldToken!.token,
      newToken,
    );
    return { refreshToken: newToken, acessToken: newAccessToken };
  };
}
