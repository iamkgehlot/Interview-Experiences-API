import type { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service.js";
import { catchAsync } from "../utils/catch.async.js";
import { HTTP_STATUS, USER_MESSAGE } from "../constants/constants.js";

export default class UserController {
  constructor(private userService: UserService) {}

  //post user
  postedUserController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: USER_MESSAGE.SIGNUP_SUCCESS,
        data: await this.userService.postUserService(req.body),
      });
    },
  );

  //get user by id
  getUserByIdController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.id);
      const data = await this.userService.getUserByIdService(id);
      if (!data) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: USER_MESSAGE.USER_FETCH_FAIL(id),
        });
      }
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: USER_MESSAGE.USER_FETCH_SUCCESS,
        data: data,
      });
    },
  );

  //get all users
  getAllUsersController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.userService.getAllUsersService();
      if (data.length === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: USER_MESSAGE.ALL_USERS_FETCH_FAIL,
        });
      }
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: USER_MESSAGE.ALL_USERS_FETCH_SUCCESS,
        data: data,
      });
    },
  );

  //update User by id
  updatedUserController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.id);
      const data = req.body;
      console.log(data);
      const updatedUser = await this.userService.updateUserService(id, data);
      console.log(updatedUser);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: USER_MESSAGE.UPDATE_USER_SUCCESS(id),
        data: updatedUser,
      });
    },
  );
}
