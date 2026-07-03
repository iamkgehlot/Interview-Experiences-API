import type { RequestHandler } from "express";
import { AUTH_MESSAGE, HTTP_STATUS, USER_MESSAGE } from "../../constants/constants.js";
import AuthService from "./auth.service.js";
import { envConfig } from "../../config/env.config.js";
import AppError from "../../utils/error.handler.js";

export default class AuthController {
  constructor(private authService: AuthService) {}

  //register user
  registeredUser: RequestHandler = async (req, res) => {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: USER_MESSAGE.SIGNUP_SUCCESS,
      data: await this.authService.register(req.body),
    });
  };

  loggedInUser: RequestHandler = async (req, res) => {
    const { userId, token } = await this.authService.login(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: envConfig.COOKIE_EXPIRES_IN,
      sameSite: "strict",
      secure:envConfig.NODE_ENV==="production"
    });

    return res.status(200).json({ success:true,message: AUTH_MESSAGE.LOGIN_SUCESS, data:{userId,token:token} });
  };
  
  loggedOutUser:RequestHandler =(req , res, next  )=>{
    
       res.cookie("token", "", {
      httpOnly: true,
      maxAge: 0,
      sameSite: "strict",
      secure : envConfig.NODE_ENV==="production"
    });
    res.status(HTTP_STATUS.OK).json({success:true,message:AUTH_MESSAGE.LOGOUT_SUCESS})
  }
}
