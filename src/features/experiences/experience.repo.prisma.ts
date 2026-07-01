import type { Experience } from "../../generated/prisma/client.js";
import type ExperienceRepo from "./experience.repo.js";
import { prisma } from "../../config/prisma.js";
import type { experienceType } from "./experience.validations.js";

export default class PrismaExperienceRepository implements ExperienceRepo {
  async create(userId: number, data: experienceType): Promise<Experience> {
    const { tagName, ...experienceFields } = data;
    return await prisma.experience.create({
      data: {
        ...experienceFields,
        userId,
        tags: {
          connectOrCreate: tagName.map((tag) => ({
            where: { tagName: tag },
            create: {
              tagName: tag,
              createdByUserid: userId,
            },
          })),
        },
      },
    });
  }

  async update(id: number, data: experienceType): Promise<Experience> {
    const { tagName, userId, ...experienceFields } = data;
    return await prisma.experience.update({
      where: { id },
      data: {
        ...experienceFields,
        tags: tagName
          ? {
              connectOrCreate: tagName.map((tag) => ({
                where: { tagName: tag },
                create: {
                  tagName: tag,
                  createdByUserid: userId,
                },
              })),
            }
          : {},
      },
    });
  }

  async findAllByUserId(userId: number): Promise<Experience[]> {
    return await prisma.experience.findMany({
      where: userId === -1 ? {} : { userId },
      include: {
        tags: {
          select: {
            tagName: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Experience | null> {
    return await prisma.experience.findFirst({
      where: { id },
      include: {
        tags: {
          select: {
            tagName: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<Experience> {
    return await prisma.experience.delete({ where: { id } });
  }

  async fetchUserId(experienceId:number):Promise<{userId:number}|null>{
    return await prisma.experience.findFirst({where:{id:experienceId},
    select:{
      userId:true
    }});
  }
}
