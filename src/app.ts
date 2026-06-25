import Express, { Router, type Application } from "express";
import { errorHandler } from "./middlewares/error.handler.js";
import "dotenv/config";
import type { RouterInterface } from "./interface/user.router.interface.js";

export default class App {
  private app: Application;
  constructor(private routers: any[],private port: number)
   {
    this.app = Express();
    this.initializeMiddlewares();
    this.initializeRoutes(this.routers);
    this.initializeErrorHandling();
    
  }
  private initializeMiddlewares(){
    this.app.use(Express.json());
  }
  private initializeRoutes(routerClasses:RouterInterface[]) {
    routerClasses.forEach((routerClass) => {
        this.app.use("/api",routerClass.router)
    });
  }
  private initializeErrorHandling(){
    this.app.use(errorHandler);
  }
  public listen(){
    this.app.listen(this.port,()=>{
        console.log("server is spining")
    })
    
  }
}

