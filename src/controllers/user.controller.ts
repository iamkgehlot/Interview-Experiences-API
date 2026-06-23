import type { NextFunction, Request, RequestHandler, Response } from "express";
import {
  getAllUsersService,
  getUserByIdService,
  postUserService,
  updateUserService,
} from "../services/user.service.js";
import { catchAsync } from "../utils/catch.async.js";
import { HTTP_STATUS, USER_MESSAGE } from "../constants/constants.js";
import { type userType} from "../validations/user.validations.js"
import type { User } from "../generated/prisma/client.js";

//post user
const postedUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: USER_MESSAGE.SIGNUP_SUCCESS,
      data: await postUserService(req.body),
    });
  },
);

//get user by id
const getUserByIdController=catchAsync(
  async (req: Request
    , res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const data = await getUserByIdService(id);
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
const getAllUsersController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getAllUsersService();
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
const updatedUserController = catchAsync(
  async (req: Request
    , res: Response, next: NextFunction) => {
    const id =Number( req.params.id );
    const data = req.body;
    console.log(data)
    const updatedUser =await updateUserService(id, data);
console.log(updatedUser);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: USER_MESSAGE.UPDATE_USER_SUCCESS(id),
      data:updatedUser
    });
  },
);

export { postedUserController, getUserByIdController, getAllUsersController, updatedUserController};
