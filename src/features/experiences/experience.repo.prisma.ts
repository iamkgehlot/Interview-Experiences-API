import { Prisma, type Experience } from "@prisma/client";
import type ExperienceRepo from "./experience.repo.js";
import { prisma } from "../../config/prisma.js";
import { type experienceType } from "./experience.validations.js";
import type { ExperienceQuery } from "../../types/query.types.js";

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

  async update(
    id: number,
    userId: number,
    data: experienceType,
  ): Promise<Experience> {
    const { tagName, ...experienceFields } = data;
    return await prisma.experience.update({
      where: { id },
      data: {
        ...experienceFields,
        tags: tagName
          ? {
              set: [],
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

  async findAllExperience(query: ExperienceQuery): Promise<Experience[]> {
    const page = Math.max(1, Number(query.page || "1"));
    const limit = Math.max(1, Number(query.limit || "10"));
    const skip: number = (page - 1) * limit;

    const where: Prisma.ExperienceWhereInput = {};

    if (query.userId) {
      where.userId = Number(query.userId);
    }


    if (query.tagName) {
      where.tags = {
        some: {
          tagName:{contains:query.tagName}
        },
      };
    }

    if (query.tagId) {
      where.tags = {
        some: {
          id:Number(query.tagId) 
        },
      };
    }

    //   company String
    // role String
    // roundsCount Int
    // difficulty Int
    // outcome interviewOutcome
    // content String
    // interviewDate DateTime

    if (query.search) {
      where.OR = [
        { company: { contains: query.search } },
        { role: { contains: query.search } },
        { content: { contains: query.search } },
      ];
    }

    return await prisma.experience.findMany({
      where,
      skip,
      take: limit,
      include:{
        tags:{
          select:{
            tagName:true
          }
        }
      }
    });
  }

  async findAllByUserId(userId: number): Promise<Experience[]> {
    return await prisma.experience.findMany({
      where: { userId },
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

  async fetchUserIdByExperienceId(
    experienceId: number,
  ): Promise<{ userId: number } | null> {
    return await prisma.experience.findFirst({
      where: { id: experienceId },
      select: {
        userId: true,
      },
    });
  }
}
