import type { Experience } from "@prisma/client";
import type ExperienceRepo from "./experience.repo.js";
import type { experienceType } from "./experience.validations.js";
import AppError from "../../utils/error.handler.js";
import { EXPERIENCE_MESSAGES, HTTP_STATUS } from "../../constants/constants.js";

export default class ExperienceService {
  constructor(private experienceRepo: ExperienceRepo) {}

  createExperience = async (
    userId: number,
    data: experienceType,
  ): Promise<Experience> => {
    return this.experienceRepo.create(userId, data);
  };
  getAllExperience = async (): Promise<Experience[]> => {
    return this.experienceRepo.findAllExperience();
  };
  getAllExperienceByUserId = async (userId: number): Promise<Experience[]> => {
    return await this.experienceRepo.findAllByUserId(userId);
  };
  getExperienceById = async (id: number): Promise<Experience | null> => {
    const data = await this.experienceRepo.findById(id);
    if(!data){
      throw new AppError(HTTP_STATUS.NOT_FOUND,EXPERIENCE_MESSAGES.NO_EXPERIENCE_FOUND_FOR_ID(id));
      
    }
    return data;
  };
  updateExperience = async (
    id: number,
    userId: number,
    data: experienceType,
  ): Promise<Experience> => {
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
    return await this.experienceRepo.update(id, userId, safeData);
  };
  deleteExperience = async (id: number) => {
    return await this.experienceRepo.delete(id);
  };


}
