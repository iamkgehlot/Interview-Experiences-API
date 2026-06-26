import App from "./app.js";
import { envConfig } from "./config/env.config.js";
import ExperienceController from "./features/experiences/experience.controller.js";
import PrismaExperienceRepository from "./features/experiences/experience.repo.prisma.js";
import ExperienceRouter from "./features/experiences/experience.router.js";
import ExperienceService from "./features/experiences/experience.service.js";
import UserController from "./features/users/user.controller.js";
import PrismaUserRepository from "./features/users/user.repo.prisma.js";
import UserRouter from "./features/users/user.router.js";
import UserService from "./features/users/user.service.js";

//user 
const repo=new PrismaUserRepository();
const userService=new UserService(repo);
const userController=new UserController(userService);
const routerUser=new UserRouter(userController);

//experiences
const experienceRepo=new PrismaExperienceRepository();
const experienceService=new ExperienceService(experienceRepo);
const experienceController=new ExperienceController(experienceService);
const routerExperience=new ExperienceRouter(experienceController);

//app
const app=new App([routerUser,routerExperience],envConfig.PORT);
app.listen();