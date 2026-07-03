import type { RequestHandler } from "express";
import AppError from "../utils/error.handler.js";
import { AUTH_MESSAGE, HTTP_STATUS } from "../constants/constants.js";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";

export const jwtProtect: RequestHandler = (req, res, next) => {
  let token: string | undefined;
   if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(HTTP_STATUS.UNAUTHORISED,AUTH_MESSAGE.TOKEN_NOT_FOUND ),
    );
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET as string) as {
      sub: string;
    };
    req.userId = Number(decoded.sub);
    next();
  } catch {
    return next(
      new AppError(HTTP_STATUS.UNAUTHORISED,AUTH_MESSAGE.INVALID_TOKEN ),
    );
  }
};
