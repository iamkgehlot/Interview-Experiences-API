import type { RequestHandler } from "express";
import { AUTH_MESSAGE, HTTP_STATUS, USER_MESSAGE } from "../../constants/constants.js";
import AuthService from "./auth.service.js";

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
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(200).json({ message: AUTH_MESSAGE.LOGIN_SUCESS, userId });
  };

  loggedOutUser:RequestHandler =(req , res )=>{
    res.cookie('token',"",{});
    res.status(HTTP_STATUS.OK).json({success:true,message:AUTH_MESSAGE.LOGOUT_SUCESS})
  }
}
