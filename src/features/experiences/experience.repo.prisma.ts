import type { Experience } from "../../generated/prisma/client.js";
import type ExperienceRepo from "./experience.repo.js";
import { prisma } from "../../config/prisma.js";
import type { experienceType } from "./experience.validations.js";

export default class PrismaExperienceRepository implements ExperienceRepo {
  async create(userId: number, data: experienceType): Promise<Experience> {
    return await prisma.experience.create({
      data: {
        ...data,
        userId,

        tags: {
          connectOrCreate: [{
            where:{
            tagName: data.tagName},
            create: {
              tagName: data.tagName,
              createdByUserid: userId,
            },
          }],
        },
      },
    });
  }

  async findAllByUserId(userId: number): Promise<Experience[]> {
    return await prisma.experience.findMany({
      where: userId === -1 ? {} : { userId },
    });
  }

  async findById(id: number): Promise<Experience | null> {
    return await prisma.experience.findFirst({ where: { id } });
  }
  async update(id: number, data: experienceType): Promise<Experience> {
    return await prisma.experience.update({ where: { id }, data });
  }
  async delete(id: number): Promise<Experience> {
    return await prisma.experience.delete({ where: { id } });
  }
}
