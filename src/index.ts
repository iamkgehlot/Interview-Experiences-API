import App from "./app.js";
import { envConfig } from "./config/env.config.js";
import UserController from "./features/users/user.controller.js";
import PrismaUserRepository from "./features/users/prisma.user.repository.js";
import UserRouter from "./features/users/user.routes.js";
import UserService from "./features/users/user.service.js";

//user 
const repo=new PrismaUserRepository();
const userService=new UserService(repo);
const userController=new UserController(userService);
const routerUser=new UserRouter(userController);

//app
const app=new App([routerUser],envConfig.PORT);
app.listen();