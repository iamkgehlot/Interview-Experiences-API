import { Router } from "express";
import { postedUserController } from "../controllers/user.controller.js";
import { zodMiddleware } from "../middlewares/zod.js";
import { userValidation } from "../validations/user.validations.js";

const userRouter = Router();

userRouter.post("/users", zodMiddleware(userValidation), postedUserController);

export { userRouter };
