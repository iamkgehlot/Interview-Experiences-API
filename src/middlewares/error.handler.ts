import { ERROR_MESSAGE, HTTP_STATUS } from "../constants/constants.js";
import { Prisma } from "../generated/prisma/client.js";
import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/error.handler.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  if (err?.type === "entity.parse.failed") {
    err = new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGE.JSON_DATA_ERROR);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P1001") {
      err = new AppError(500, "Database connection failed");
    }
    if (err.code === "P2002") {
      const targets = (err.meta?.target as string) || "field";
      err = new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.P2002_ERROR(targets),
      );
    }

    if (err.code === 'P2025') {
      console.log(err);
  
      err = new AppError(HTTP_STATUS.NOT_FOUND, err.meta.cause as string);
    }
  }

  if(err?.message?.includes("prisma")||err?.message?.includes("database")){
    err=new AppError(500,"internal database error occurred")
  }
  const message = err.message || ERROR_MESSAGE.INERNAL_SERVER_ERROR;
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  return res
    .status(statusCode)
    .json({ success: false, message: message, path: err.errorPathReason });
};
