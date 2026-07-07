import Express, { type Application } from "express";
import { errorHandler } from "./middlewares/error.handler.js";
import type { Routes } from "./interface/routes.js";
import { prisma } from "./config/prisma.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class App {
  private app: Application;
  constructor(
    private routers: Routes[],
    private port: number,
  ) {
    this.app = Express();
    this.initializeMiddlewares();
    this.initializeRoutes(this.routers);
    this.initializeErrorHandling();
  }
  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.set("trust proxy", true);
    this.app.use(Express.json());
    this.app.use(morgan("combined"));
    this.app.use(cookieParser());
  }
  private initializeRoutes(routerClasses: Routes[]) {
    routerClasses.forEach((routerClass) => {
      this.app.use("/api", routerClass.router);
    });
    //serve front end page
    this.app.use(Express.static(path.join(__dirname, "../public")));
    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });
  }
  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }
  public async listen() {
    try {
      await prisma.$connect();
      console.log("Success: Connected to Database");
      this.app.listen(this.port, () => {
        console.log(`Server is spining at port ${this.port}`);
      });
    } catch {
      console.log("Critical: there is a issue with Database connection");
      process.exit(1);
    }
  }
}
