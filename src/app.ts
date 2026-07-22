import Express, { type Application } from "express";
import { errorHandler } from "./middlewares/error.handler.js";
import type { Routes } from "./interface/routes.js";
import { prisma } from "./config/prisma.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "node:url";
// import { dirname } from "node:path";
import { httpLoggerMiddleware } from "./middlewares/http.logger.js";
import { getLogger } from "./context/logger.js";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/openapi.js";

// const _filename = fileURLToPath(import.meta.url);
// const _dirname = dirname(_filename);
const logger=()=>getLogger().child({
  service:"app-js",
  module:"root"
})

export default class App {
  private app: Application;
  constructor(
    private routers: Routes[],
    private port?: number,
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
    this.app.use(httpLoggerMiddleware);
    this.app.use(cookieParser());
    this.app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(openApiDocument))
  }
  private initializeRoutes(routerClasses: Routes[]) {
    routerClasses.forEach((routerClass) => {
      this.app.use("/api", routerClass.router);
    });
    //serve front end page
    // this.app.use(Express.static(path.join(_dirname, "../public")));
    // this.app.get("/", (req, res) => {
    //   res.sendFile(path.join(_dirname, "../public/index.html"));
    // });
  }
  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }
  public async listen() {
    try {
      await prisma.$connect();
      logger().info("connected to server")
      this.app.listen(this.port, () => {
       logger().info(`Server is spining at port ${this.port}`);
      });
    } catch {
      logger().fatal("Critical: there is a issue with Database connection");
      process.exit(1);
    }
  }
  public getServer():Application{
    return this.app;
  }
}
