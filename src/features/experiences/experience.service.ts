import { type Experience } from "@prisma/client";
import type ExperienceRepo from "./experience.repo.js";
import type { experienceType } from "./experience.validations.js";
import AppError from "../../utils/error.handler.js";
import { EXPERIENCE_MESSAGES, HTTP_STATUS } from "../../constants/constants.js";
import {
  experienceQuerySchema,
  type ExperienceQueryValidation,
} from "./experience.query.validation.js";
import type { experienceTypes } from "../../types/experience.types.js";
import { getLogger } from "../../context/logger.js";
const logger =()=>getLogger().child({
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
      logger().warn(
        { experienceId: id },
        "no experience available for given experience id",
      );
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
    data: experienceType,
  ): Promise<Experience> => {
    // const getAuthorId=await this.experienceRepo.fetchUserIdByExperienceId(id);
    // if(!getAuthorId){
    //   throw new AppError(HTTP_STATUS.NOT_FOUND,EXPERIENCE_MESSAGES.NO_EXPERIENCE_FOUND_FOR_ID(id));
    // }
    // if(userId!==getAuthorId.userId){
    //   throw new AppError(HTTP_STATUS.UNAUTHORISED,AUTH_MESSAGE.NOT_PERMITTED);
    // }
    const safeData = {
      company: data.company,
      role: data.role,
      roundsCount: data.roundsCount,
      difficulty: data.difficulty,
      outcome: data.outcome,
      content: data.content,
      interviewDate: data.interviewDate,
      tagName: data.tagName,
    };
    logger().info(
      { experienceId: id, userId: userId },
      "experience updated successfully",
    );
    return await this.experienceRepo.update(id, userId, safeData);
  };
  deleteExperience = async (id: number) => {
    // const getAuthorId=await this.experienceRepo.fetchUserIdByExperienceId(id);
    // if(!getAuthorId){
    //   console.log("in no author found")
    //   throw new AppError(HTTP_STATUS.NOT_FOUND,EXPERIENCE_MESSAGES.NO_EXPERIENCE_FOUND_FOR_ID(id));
    // }
    // if(userId!==getAuthorId.userId && !(role===SystemRole.ADMIN)){
    //   console.log("usrid not equal author")
    //   throw new AppError(HTTP_STATUS.UNAUTHORISED,AUTH_MESSAGE.NOT_PERMITTED);

    // }
    // console.log("i skipped all")
    logger().info({ experienceId: id }, "experience deleted successfully");
    return await this.experienceRepo.delete(id);
  };
}
