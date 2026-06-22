import  Express from "express";
import { userRouter } from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.handler.js";
import "dotenv/config"; 
const app=Express();
app.use(Express.json());
app.use("/api/v1/",userRouter);
app.use(errorHandler);
export {app};