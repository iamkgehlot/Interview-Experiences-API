import { error } from "node:console";

export default class AppError extends Error{
     isOperational :boolean;
     status:string;
 
    constructor(public statusCode:number,message:string,public errorPathReason?:any[]){
        super(message);
        this.isOperational=true;
        this.status=`${statusCode}`.startsWith("4")?"fail":"error";
        Error.captureStackTrace(this,this.constructor)
    }
}