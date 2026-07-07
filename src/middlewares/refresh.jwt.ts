import type { RequestHandler } from "express";
import AppError from "../utils/error.handler.js";
import { AUTH_MESSAGE, HTTP_STATUS } from "../constants/constants.js";
import { envConfig } from "../config/env.config.js";
import jwt from "jsonwebtoken";

export const refreshTokenCheck: RequestHandler = (req, res, next) => {
  if (!req.cookies?.token) {
    return next(
      new AppError(HTTP_STATUS.UNAUTHORISED, AUTH_MESSAGE.TOKEN_NOT_FOUND),
    );
  }
  try {
    const token = req.cookies.token;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const verified = jwt.verify(token, envConfig.REFRESH_JWT_SECRET);
  } catch {
    return next(
      new AppError(HTTP_STATUS.UNAUTHORISED, AUTH_MESSAGE.INVALID_TOKEN),
    );
  }

  next();
};
