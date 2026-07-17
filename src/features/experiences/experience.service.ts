import { type Experience } from "@prisma/client";
import type ExperienceRepo from "./experience.repo.js";
import {
  updatedBaseExperienceSchema,
  type experienceType,
  type updateExperienceType,
} from "./experience.validations.js";
import AppError from "../../utils/error.handler.js";
import { EXPERIENCE_MESSAGES, HTTP_STATUS } from "../../constants/constants.js";
import {
  experienceQuerySchema,
  type ExperienceQueryValidation,
} from "./experience.query.validation.js";
import type { experienceTypes } from "../../types/experience.types.js";
import { getLogger } from "../../context/logger.js";
const logger = () =>
  getLogger().child({
    module: "experience",
    service: "service",
  });
export default class ExperienceService {
  constructor(private experienceRepo: ExperienceRepo) {}

  createExperience = async (
    userId: number,
    data: experienceType,
  ): Promise<Experience> => {
    logger().info({ userId: userId }, "user posted a experience");
    return this.experienceRepo.create(userId, data);
  };

  getAllExperience = async (
    query: ExperienceQueryValidation,
  ): Promise<{
    match: experienceTypes[];
    totalMatch: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const safeQuery = experienceQuerySchema.parse(query);
    logger().info("all experience fetched successfully");
    return this.experienceRepo.findAllExperience(safeQuery);
  };

  getAllExperienceByUserId = async (userId: number): Promise<Experience[]> => {
    logger().info(
      { userid: userId },
      "all experience fetched successfully for given user id",
    );
    return await this.experienceRepo.findAllByUserId(userId);
  };

  getExperienceById = async (id: number): Promise<Experience | null> => {
    const data = await this.experienceRepo.findById(id);
    if (!data) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        EXPERIENCE_MESSAGES.NO_EXPERIENCE_FOUND_FOR_ID(id),
      );
    }
    return data;
  };

  updateExperience = async (
    id: number,
    userId: number,
    data: updateExperienceType,
  ): Promise<Experience> => {
    const safeData = updatedBaseExperienceSchema.parse(data);

    const response = await this.experienceRepo.update(id, userId, safeData);
    logger().info(
      { experienceId: id, userId: userId },
      "experience updated successfully",
    );

    return response;
  };

  deleteExperience = async (id: number) => {
    logger().info({ experienceId: id }, "experience deleted successfully");
    await this.experienceRepo.delete(id);
  };
}
