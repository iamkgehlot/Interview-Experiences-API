import type { RequestHandler } from "express";

import type ExperienceService from "./experience.service.js";
import { EXPERIENCE_MESSAGES, HTTP_STATUS } from "../../constants/constants.js";

export default class ExperienceController {
  constructor(private experienceService: ExperienceService) {}

  createdExperience: RequestHandler = async (req, res) => {
    const userIdAuth = req.userId;

    const data = await this.experienceService.createExperience(
      userIdAuth!,
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
    const userId = req.userId;
    const data = await this.experienceService.getAllExperienceByUserId(userId!);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: data,
    });
  };

  getExperienceById: RequestHandler = async (req, res) => {
    const experienceId = Number(req.params.experienceId);
    const data = await this.experienceService.getExperienceByid(experienceId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: data,
    });
  };

  updateExperience: RequestHandler = async (req, res) => {
    const experienceId = Number(req.params.experienceId);
    const authUserId = req.userId;
    const data = await this.experienceService.updateExperience(
      experienceId,
      authUserId!,
      req.body,
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: EXPERIENCE_MESSAGES.EXPERIENCE_UPDATED,
      data: data,
    });
  };

  deleteExperience: RequestHandler = async (req, res) => {
    const experienceId = Number(req.params.experienceId);
    await this.experienceService.deleteExperience(experienceId);
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  };
}
