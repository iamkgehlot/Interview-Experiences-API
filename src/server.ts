import { app } from "./app.js";
import {prisma} from "./repositories/prisma.js"
import {envConfig} from "./config/env.config.js"

const bootServer=async()=>{
    try{
        await prisma.$connect();
        app.listen(envConfig.PORT,()=>{console.log("server is spinning")});
    }catch(error){
        console.log("Critical failure:cannot connect to database server");
        process.exit(1);
    }
}
bootServer();
