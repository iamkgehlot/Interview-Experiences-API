import type { RequestHandler } from "express";

import type ExperienceService from "./experience.service.js";
import { EXPERIENCE_MESSAGES, HTTP_STATUS } from "../../constants/constants.js";

import AppError from "../../utils/error.handler.js";

export default class ExperienceController {
  constructor(private experienceService: ExperienceService) {}

  createdExperience: RequestHandler = async (req, res) => {
    const userId = Number(req.params.userId);
    const data = await this.experienceService.createExperience(
      userId,
      req.body,
    );
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: EXPERIENCE_MESSAGES.EXPERIENCE_CREATE,
      data: data,
    });
  };

  getAllExperience: RequestHandler = async (req, res, next) => {
    const data = await this.experienceService.getAllExperience();
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: data,
    });
  };
  getAllExperienceByUserId: RequestHandler = async (req, res) => {
    const userId = Number(req.params.userId);
    console.log(userId);
    const data = await this.experienceService.getAllExperienceByUserId(userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: data,
    });
  };

  getExperienceById: RequestHandler = async (req, res, next) => {
    const experienceId = Number(req.params.experienceId);
    const data = await this.experienceService.getExpirenceByid(experienceId);
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

  updateExperience: RequestHandler = async (req, res) => {
    const data = await this.experienceService.updateExperience(
      Number(req.params.experienceId),
      req.body,
    );
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: EXPERIENCE_MESSAGES.EXPERIENCE_UPDATED,
      data: data,
    });
  };

  deleteExperience: RequestHandler = async (req, res) => {
    await this.experienceService.deleteExperience(
      Number(req.params.experienceId),
    );
    return res.status(HTTP_STATUS.NO_CONTENT).send;
  };
}
