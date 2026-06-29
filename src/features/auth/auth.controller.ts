import type { RequestHandler } from "express";
import { HTTP_STATUS, USER_MESSAGE } from "../../constants/constants.js";
import AuthService from "./auth.service.js";
import { success } from "zod";

export default class AuthController {
  constructor(private authService: AuthService) {}

  //register user
  registeredUser:RequestHandler = 
    async (req, res) => {
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: USER_MESSAGE.SIGNUP_SUCCESS,
        data: await this.authService.register(req.body),
      });
    }

    loggedInUser:RequestHandler=async (req,res , next)=>{
        const passwordCheck=await this.authService.login(req.body);
        if(passwordCheck){
                  return res.status(HTTP_STATUS.OK).json({success:true,message:"logged in"});

        }
        return res.status(HTTP_STATUS.UNAUTHORISED).json({success:false,message:"auth failed"});

  
    }
  }