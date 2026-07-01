import type { Tag } from "../../generated/prisma/index.js";
import type TagsRepo from "./tag.repo.js";
import type { tagsType } from "./tag.validations.js";

export default class TagService {
  constructor(private tagRepo: TagsRepo) {}

  create = async (createdByUserid: number, tagName: Tag): Promise<tagsType> => {
    return await this.tagRepo.create(createdByUserid, tagName);
  };
  findById = async (tagId: number) => {
    return await this.tagRepo.findById(tagId);
  };
  findAll = async () => {
    return await this.tagRepo.findAll();
  };
  update = async (tagId: number, tagName: Tag) => {
    return await this.tagRepo.update(tagId, tagName);
  };
  delete = async (tagId: number) => {
    return await this.tagRepo.delete(tagId);
  };

  findUserId=async (tagId:number)=>{
    return await this.tagRepo.findUserId(tagId);
  }
}
