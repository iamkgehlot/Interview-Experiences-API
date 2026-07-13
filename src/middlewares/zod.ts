import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { HTTP_STATUS } from "../constants/constants.js";
import AppError from "../utils/error.handler.js";
import type { ZodOut } from "../interface/zod.js";


export const zodMiddleware = <T extends ZodOut>(schema: ZodType<T>) => {

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = validData.body || req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req.params = (validData.params as any) || req.params;
     
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((data) => ({
          message: data.message,
          path: data.path.join("."),
        }));
      
        next(
          new AppError(
            HTTP_STATUS.BAD_REQUEST,
            "validation error",
            errorMessage,
          ),
        );
      }
    }
  };
};
