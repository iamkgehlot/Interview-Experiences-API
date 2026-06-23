import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  postedUserController,
  updatedUserController,
} from "../controllers/user.controller.js";
import { zodMiddleware } from "../middlewares/zod.js";
import { updateUserValidation, userBodyValidation, userIdValidation } from "../validations/user.validations.js";

const userRouter = Router();

userRouter.post("/users",zodMiddleware(userBodyValidation), postedUserController);

userRouter.get("/users/:id",zodMiddleware(userIdValidation), getUserByIdController);

userRouter.get("/users", getAllUsersController);

userRouter.patch("/users/:id",zodMiddleware(updateUserValidation), updatedUserController);

export { userRouter };
