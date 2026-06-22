import { HTTP_STATUS } from "../constants/constants.js";
import { Prisma } from "../generated/prisma/client.js";
import type { NextFunction,Request,Response } from "express";

export const errorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
   if(err instanceof Prisma.PrismaClientKnownRequestError){
    if(err.code==="P2002"){
        const targets=err.meta?.target as string||"field";
   
        return res.status(HTTP_STATUS.BAD_REQUEST).json({success:false,message:targets+" already exists"})
    }
    
   }
console.log(err);
return res.status(400).json({message:"error occurred"})
}