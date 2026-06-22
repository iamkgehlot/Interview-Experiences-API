export default class AppError extends Error{
     isOperational :boolean;
     status:string;
    constructor(message:string,public statusCode:number){
        super(message);
        this.isOperational=true;
        this.status=`${statusCode}`.startsWith("4")?"fail":"error";
        Error.captureStackTrace(this,this.constructor)
    }
}