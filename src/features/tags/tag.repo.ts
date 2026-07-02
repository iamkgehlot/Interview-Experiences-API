import type { Tag } from "@prisma/client";
import type { tagsType } from "./tag.validations.js";

export default interface TagsRepo {
  create(createdByUserid: number, tagName: Tag): Promise<tagsType>;
  update(tagId: number, tagName: Tag): Promise<tagsType>;
  delete(tagId: number): Promise<Tag | null>;
  findById(tagId: number): Promise<tagsType | null>;
  findAll(): Promise<tagsType[]>;
  findUserId(tagId:number):Promise<{createdByUserid:number}|null>;
}
