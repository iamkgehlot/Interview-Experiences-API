import { prisma } from "../../config/prisma.js";
import type { Tag } from "@prisma/client";
import type TagsRepo from "./tag.repo.js";
import type { tagsType } from "./tag.validations.js";



export default class PrismaTagRepo implements TagsRepo {
  async create(createdByUserid: number, tagName: string): Promise<Tag> {
    return await prisma.tag.create({
      data: { tagName, createdByUserid: createdByUserid },
    });
  }
  async update(tagId: number, tagName: tagsType): Promise<Tag> {
    return await prisma.tag.update({
      where: { id: tagId },
      data: {
        tagName: tagName.tagName,
        
      },
    });
  }
  async delete(tagId: number): Promise<void> {
     await prisma.tag.delete({ where: { id: tagId } });
  }
  async findById(tagId: number): Promise<Tag | null> {
    return await prisma.tag.findFirst({ where: { id: tagId } });
  }

  async findAll(): Promise<Tag[]> {
    return await prisma.tag.findMany();
  }

  async findUserId(tagId: number): Promise<{ userId: number } | null> {
    const data = await prisma.tag.findFirst({
      where: { id: tagId },
      select: {
        createdByUserid: true,
      },
    });
    
    return data ? { userId: data.createdByUserid! } : null;
  }
}
