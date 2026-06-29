import { prisma } from "../../config/prisma.js";
import type { Tag } from "../../generated/prisma/index.js";
import type TagsRepo from "./tag.repo.js";
import type { tagsType } from "./tag.validations.js";

export default class PrismaTagRepo implements TagsRepo{
  

    async create(createdByUserid:number,tagName: Tag): Promise<tagsType> {
       return await prisma.tag.create({data:{...tagName,createdByUserid:1}});
    }
    async update(tagId:number,tagName: Tag ): Promise<tagsType> {
        return  await prisma.tag.update({where:{id:tagId},data:{
            tagName:tagName.tagName,
            createdByUserid:1
        }})
    }
    async delete(tagId: number) :Promise<Tag|null>{
       return await prisma.tag.delete({where:{id:tagId}})
    }
   async findById(tagId: number): Promise<Tag|null> {
       return await prisma.tag.findFirst({where:{id:tagId}})
    };

    async findAll(): Promise<tagsType[]> {
        return await prisma.tag.findMany();
    }

}