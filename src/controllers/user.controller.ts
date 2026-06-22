import type { NextFunction, Request, Response } from "express";
import { postUserService } from "../services/user.service.js";
import { catchAsync } from "../utils/catch.async.js";
import {
  HTTP_STATUS,
  JSON_SUCCESS,
  USER_MESSAGE,
} from "../constants/constants.js";

const postedUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: USER_MESSAGE.SIGNUP_SUCCESS,
      data: await postUserService(req.body),
    });
  },
);
export { postedUserController };
