import type { NextFunction, Request, Response } from "express";
import UserService from "./user.service.js";
import { HTTP_STATUS, USER_MESSAGE } from "../../constants/constants.js";
import AppError from "../../utils/error.handler.js";
import { envConfig } from "../../config/env.config.js";
import { SystemRole } from "@prisma/client";

export default class UserController {
  constructor(private userService: UserService) {}

  //post user
  // postedUser = catchAsync(
  //   async (req: Request, res: Response) => {
  //     return res.status(HTTP_STATUS.CREATED).json({
  //       success: true,
  //       message: USER_MESSAGE.SIGNUP_SUCCESS,
  //       data: await this.userService.postUser(req.body),
  //     });
  //   },
  // );

  //get user by id
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const data = await this.userService.getUserById(id);
    if (!data) {
      return next(
        new AppError(HTTP_STATUS.NOT_FOUND, USER_MESSAGE.USER_FETCH_FAIL(id)),
      );
    }
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: data,
    });
  };

  //get all users
  getAllUsers = async (req: Request, res: Response) => {
    const data = await this.userService.getAllUsers();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: data,
    });
  };

  //update User by id
  updatedUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = req.body;
    const updatedUser = await this.userService.updateUser(id, data);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: USER_MESSAGE.UPDATE_USER_SUCCESS(id),
      data: updatedUser,
    });
  };

  //delete user
  deletedUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.userService.deleteUser(Number(id));
    if (id === req.userId) {
      res.cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
        sameSite: "strict",
        secure: envConfig.NODE_ENV === "production",
      });
    }
    return res.status(200).json({ success: true, message: "User deleted" });
  };
}
