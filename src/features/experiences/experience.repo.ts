import type { Experience } from "@prisma/client";
import type { experienceType } from "./experience.validations.js";

export default interface ExperienceRepo {
  create(userid: number, experience: experienceType): Promise<Experience>;
  findAllByUserId(id: number): Promise<Experience[]>;
  findAllExperience(): Promise<Experience[]>;
  findById(id: number): Promise<Experience | null>;
  update(
    id: number,
    userId: number,
    experience: experienceType,
  ): Promise<Experience>;
  delete(id: number): Promise<Experience>;
  fetchUserIdByExperienceId(
    experienceId: number,
  ): Promise<{ userId: number } | null>;
  fetchUserId(userId: number): Promise<{ userId: number } | null>;
}
