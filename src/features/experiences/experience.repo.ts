import type { Experience } from "@prisma/client";
import type { experienceType, updateExperienceType } from "./experience.validations.js";
import type { ExperienceQueryValidation } from "./experience.query.validation.js";
import type { experienceTypes } from "../../types/experience.types.js";

export default interface ExperienceRepo {
  create(userid: number, experience: experienceType): Promise<Experience>;

  findAllByUserId(id: number): Promise<Experience[]>;

  findAllExperience(
    query: ExperienceQueryValidation,
  ): Promise<{
    match: experienceTypes[];
    totalMatch: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  findById(id: number): Promise<Experience | null>;

  update(
    id: number,
    userId: number,
    experience: updateExperienceType,
  ): Promise<Experience>;

  delete(id: number): Promise<void>;

  fetchUserIdByExperienceId(
    experienceId: number,
  ): Promise<{ userId: number } | null>;
}
