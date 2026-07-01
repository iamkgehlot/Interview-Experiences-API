import type { RequestHandler } from "express";

import type ExperienceService from "./experience.service.js";
import {
  AUTH_MESSAGE,
  EXPERIENCE_MESSAGES,
  HTTP_STATUS,
} from "../../constants/constants.js";

import AppError from "../../utils/error.handler.js";

export default class ExperienceController {
  constructor(private experienceService: ExperienceService) {}

  createdExperience: RequestHandler = async (req, res,next) => {
    const userIdParams = Number(req.params.userId);
    const userIdAuth=req.userId;
    if(userIdAuth!==userIdParams){
     return next(new AppError(HTTP_STATUS.FORBIDDEN,AUTH_MESSAGE.NOT_PERMITTED));
    }
    const data = await this.experienceService.createExperience(
      userIdAuth,
      req.body,
    );
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: EXPERIENCE_MESSAGES.EXPERIENCE_CREATE,
      data: data,
    });
  };

  getAllExperience: RequestHandler = async (req, res) => {
    const data = await this.experienceService.getAllExperience();
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: data,
    });
  };
  getAllExperienceByUserId: RequestHandler = async (req, res) => {
    const userId = Number(req.params.userId);
     const data = await this.experienceService.getAllExperienceByUserId(userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: data,
    });
  };

  getExperienceById: RequestHandler = async (req, res, next) => {
    const experienceId = Number(req.params.experienceId);
    const data = await this.experienceService.getExperienceByid(experienceId);
    if (!data) {
      return next(
        new AppError(
          HTTP_STATUS.NOT_FOUND,
          EXPERIENCE_MESSAGES.NO_EXPERIENCE_FOUND_FOR_ID(experienceId),
        ),
      );
    }
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: data,
    });
  };

  updateExperience: RequestHandler = async (req, res, next) => {
    const experienceId = Number(req.params.experienceId);
    const authUserId = Number(req.userId);
    const fetchedUserid = await this.experienceService.findUserId(experienceId);
    if (fetchedUserid?.userId !== authUserId) {
      return next(
        new AppError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGE.NOT_PERMITTED),
      );
    }
    req.body.userId=authUserId;
    const data = await this.experienceService.updateExperience(
      experienceId,
      req.body,
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: EXPERIENCE_MESSAGES.EXPERIENCE_UPDATED,
      data: data,
    });
  };

  deleteExperience: RequestHandler = async (req, res, next) => {
    const experienceId = Number(req.params.experienceId);
    const userId = Number(req.userId);
    const fetchedUserid = await this.experienceService.findUserId(experienceId);
    if (fetchedUserid?.userId !== userId) {
      return next(
        new AppError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGE.NOT_PERMITTED),
      );
    }
    await this.experienceService.deleteExperience(experienceId);
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  };
}
