import App from "./app.js";
import { envConfig } from "./config/env.config.js";
import UserController from "./controllers/user.controller.js";
import PrismaUserRepository from "./repositories/prisma.js";
import UserRouter from "./routes/user.routes.js";
import UserService from "./services/user.service.js";

const repo=new PrismaUserRepository();
const userService=new UserService(repo);
const userController=new UserController(userService);
const routerUser=new UserRouter(userController);
const app=new App([routerUser],envConfig.PORT);
app.listen();