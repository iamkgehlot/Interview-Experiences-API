import App from "./app.js";
import { envConfig } from "./config/env.config.js";
import CommentController from "./features/comments/comment.controller.js";
import PrismaCommentRepo from "./features/comments/comment.repo.prisma.js";
import CommentRouter from "./features/comments/comment.router.js";
import CommentService from "./features/comments/comment.service.js";
import ExperienceController from "./features/experiences/experience.controller.js";
import PrismaExperienceRepository from "./features/experiences/experience.repo.prisma.js";
import ExperienceRouter from "./features/experiences/experience.router.js";
import ExperienceService from "./features/experiences/experience.service.js";
import TagController from "./features/tags/tag.controller.js";
import PrismaTagRepo from "./features/tags/tag.repo.prisma.js";
import TagService from "./features/tags/tag.service.js";
import TagRouter from "./features/tags/tags.router.js";
import UserController from "./features/users/user.controller.js";
import PrismaUserRepository from "./features/users/user.repo.prisma.js";
import UserRouter from "./features/users/user.router.js";
import UserService from "./features/users/user.service.js";
import PrismaAuthRepository from "./features/auth/auth.repo.prisma.js";
import AuthService from "./features/auth/auth.service.js";
import AuthController from "./features/auth/auth.controller.js";
import AuthRouter from "./features/auth/auth.router.js";


export default function createApp(port?:number){
//auth
const authRepo = new PrismaAuthRepository();
const authService = new AuthService(authRepo);
const authController = new AuthController(authService);
const authRouter = new AuthRouter(authController);

//user
const repo = new PrismaUserRepository();
const userService = new UserService(repo);
const userController = new UserController(userService);
const userRouter = new UserRouter(userController, repo);

//experiences
const experienceRepo = new PrismaExperienceRepository();
const experienceService = new ExperienceService(experienceRepo);
const experienceController = new ExperienceController(experienceService);
const experienceRouter = new ExperienceRouter(
  experienceController,
  experienceRepo,
);

//comment
const commentRepo = new PrismaCommentRepo();
const commentService = new CommentService(commentRepo);
const commentController = new CommentController(commentService);
const commentRouter = new CommentRouter(commentController, commentRepo);

//tags
const tagRepo = new PrismaTagRepo();
const tagService = new TagService(tagRepo);
const tagController = new TagController(tagService);
const tagRouter = new TagRouter(tagController, tagRepo);
//app
return new App(
  [authRouter, userRouter, experienceRouter, commentRouter, tagRouter],
  port??envConfig.PORT,
);}

if(process.env.NODE_ENV!=="test")
{

  const app=createApp(envConfig.PORT)
  app.listen();
}