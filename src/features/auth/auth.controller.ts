import type { RequestHandler } from "express";
import {
  AUTH_MESSAGE,
  HTTP_STATUS,
  USER_MESSAGE,
} from "../../constants/constants.js";
import AuthService from "./auth.service.js";
import { envConfig } from "../../config/env.config.js";

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
    const { userId, accessToken, refreshToken } = await this.authService.login(
      req.body,
    );

    res.cookie("token", refreshToken, {
      httpOnly: true,
      maxAge: envConfig.REFRESH_COOKIE_MAXAGE,
      sameSite: "strict",
      secure: envConfig.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: AUTH_MESSAGE.LOGIN_SUCESS,
      data: { userId, token: accessToken },
    });
  };

  loggedOutUser: RequestHandler = async (req, res) => {
    const logoutUser = await this.authService.logOut(req.cookies.token);
    res.cookie("token", "", {
      httpOnly: true,
      maxAge: 0,
      sameSite: "strict",
      secure: envConfig.NODE_ENV === "production",
    });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: AUTH_MESSAGE.LOGOUT_SUCESS,
      data: { userId: logoutUser },
    });
  };

  refreshToken: RequestHandler = async (req, res) => {
    const token = req.cookies.token;
    const newTokens = await this.authService.refreshToken(token);

    res.cookie("token", newTokens.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: envConfig.NODE_ENV === "production",
      maxAge: envConfig.REFRESH_COOKIE_MAXAGE,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "refresh done",
      data: { accesstoken: newTokens.accessToken },
    });
  };
}
