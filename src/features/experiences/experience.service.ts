import type { Experience } from "../../generated/prisma/client.js";
import type ExperienceRepo from "./experience.repo.js";
import type { experienceType } from "./experience.validations.js";

export default class ExperienceService {
  constructor(private experienceRepo: ExperienceRepo) {}

  createExperience = async (
    userId: number,
    data: experienceType,
  ): Promise<Experience> => {
    return this.experienceRepo.create(userId, data);
  };
  getAllExperience = async (): Promise<Experience[] > => {
    return this.experienceRepo.findAllByUserId(-1);
  };
  getAllExperienceByUserId = async (
    userId: number,
  ): Promise<Experience[]> => {
    return await this.experienceRepo.findAllByUserId(userId);
  };
  getExpirenceByid = async (id: number): Promise<Experience | null> => {
    return this.experienceRepo.findById(id);
  };
  updateExperience = async (
    id: number,
    data: experienceType,
  ): Promise<Experience> => {
    return await this.experienceRepo.update(id, data);
  };
  deleteExperience = async (id: number) => {
    return await this.experienceRepo.delete(id);
  };
}
