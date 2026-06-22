import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { HTTP_STATUS } from "../constants/constants.js";

export const zodMiddleware = (z: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = z.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((data) => ({
          message: data.message,
          path: data.path.join("."),
        }));
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ success: false, message: errorMessage });
      }
    }
  };
};
