import type { RequestHandler } from "express";
import AppError from "../utils/error.handler.js";
import { AUTH_MESSAGE, HTTP_STATUS } from "../constants/constants.js";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";
import type { SystemRole } from "@prisma/client";
import { getLogger } from "../context/logger.js";
const logger = ()=>getLogger().child({
    module: "middleware",
    service: "jwt.ts",
  });
export const jwtProtect: RequestHandler = (req, res, next) => {
  

  let token: string | undefined;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    logger().warn("access token not found with the request");
    return next(
      new AppError(HTTP_STATUS.UNAUTHORISED, AUTH_MESSAGE.TOKEN_NOT_FOUND),
    );
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET as string) as {
      sub: string;
      role: SystemRole;
    };

    req.userId = Number(decoded.sub);
    req.role = decoded.role;
    logger().info({ userid: req.userId }, "access token verified successfully");

    next();
  } catch {
    logger().warn("access token is invalid");
    return next(
      new AppError(HTTP_STATUS.UNAUTHORISED, AUTH_MESSAGE.INVALID_TOKEN),
    );
  }
};
