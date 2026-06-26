import type { RequestHandler } from "express";

import type ExperienceService from "./experience.service.js";
import {  HTTP_STATUS } from "../../constants/constants.js";

import AppError from "../../utils/error.handler.js";

export default class ExperienceController {
  constructor(private experienceService: ExperienceService) {}

  createdExperience: RequestHandler = async (req, res, next) => {
    const userId = Number(req.params.userId);
    const data = await this.experienceService.createExperience(
      userId,
      req.body,
    );
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: data,
    });
  };

  getAllExperience: RequestHandler = async (req, res, next) => {
    const data = await this.experienceService.getAllExperience();
    if (data.length === 0) {
      return next(new AppError(HTTP_STATUS.NOT_FOUND, "no experience shared yet"));
    }
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: data,
    });
  };
  getAllExperienceByUserId: RequestHandler = async (req, res, next) => {
    const userId = Number(req.params.userId);
    console.log(userId);
    const data = await this.experienceService.getAllExperienceByUserId(userId);
   
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: data,
    });
  };

  getExperienceById: RequestHandler = async (req, res, next) => {
    const experienceId=Number(req.params.experienceId);
    const data = await this.experienceService.getExpirenceByid(
      experienceId
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: data,
    });
  };

  updateExperience: RequestHandler = async (req, res, next) => {
    const data = await this.experienceService.updateExperience(
      Number(req.params.experienceId),
      req.body,
    );
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: data,
    });
  };

  deleteExperience: RequestHandler = async (req, res, next) => {
    const data = await this.experienceService.deleteExperience(
      Number(req.params.experienceId),
    );
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: data,
    });
  };
}
