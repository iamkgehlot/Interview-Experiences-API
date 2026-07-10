import { ERROR_MESSAGE, HTTP_STATUS } from "../constants/constants.js";
import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/error.handler.js";

export const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err?.type === "entity.parse.failed") {
    err = new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGE.JSON_DATA_ERROR);
  }

  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    err = new AppError(500, "internal database error occurred");
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

    if (err.code === "P2025") {
      err = new AppError(
        HTTP_STATUS.NOT_FOUND,
        (err.meta?.cause as string) || "Record not Found",
      );
    }
  }
  if (err instanceof AppError) {
    const message = err.message || ERROR_MESSAGE.INTERNAL_SERVER_ERROR;
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

    return res
      .status(statusCode)
      .json({ success: false, message: message, path: err.errorPathReason });
  }
  console.log(err.message);
  const message = ERROR_MESSAGE.INTERNAL_SERVER_ERROR;
  const statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({ success: false, message: message });
};
