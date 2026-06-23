import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { HTTP_STATUS } from "../constants/constants.js";
import AppError from "../utils/error.handler.js";
import type { zodOut } from "../types/type.js";

export const zodMiddleware = <T extends zodOut>(schema: ZodType<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      const k = validData.body;
      req.body = validData.body || req.body;
      req.params = validData.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((data) => ({
          message: data.message,
          path: data.path.join("."),
        }));

        error = new AppError(
          HTTP_STATUS.BAD_REQUEST,
          "validation error",
          errorMessage,
        );
      }
      next(error);
    }
  };
};
