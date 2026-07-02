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
    return this.experienceRepo.findAllExperience();
  };
  getAllExperienceByUserId = async (
    userId: number,
  ): Promise<Experience[]> => {
    return await this.experienceRepo.findAllByUserId(userId);
  };
  getExperienceByid = async (id: number): Promise<Experience | null> => {
    return this.experienceRepo.findById(id);
  };
  updateExperience = async (
    id: number,
    userId:number,
    data: experienceType,
  ): Promise<Experience> => {
    
    const safeData= {
    company: data.company,
    role: data.role,
    roundsCount: data.roundsCount,
    difficulty: data.difficulty,
    outcome:data.outcome,
    content: data.content,
    interviewDate: data.interviewDate,
    tagName: data.tagName
}
    return await this.experienceRepo.update(id,userId, safeData);
  };
  deleteExperience = async (id: number) => {
    return await this.experienceRepo.delete(id);
  };

  findUserId=async(experienceId:number)=>{
    return await this.experienceRepo.fetchUserId(experienceId);
  }
}
