import type { Tag } from "@prisma/client";
import type { tagsType } from "./tag.validations.js";



export default interface TagsRepo {
  create(createdByUserid: number, tagName: string): Promise<Tag>;
  update(tagId: number, tagName: tagsType): Promise<Tag>;
  delete(tagId: number): Promise<void>;
  findById(tagId: number): Promise<Tag | null>;
  findAll(): Promise<Tag[]>;
  findUserId(tagId: number): Promise<{ userId: number } | null>;
}
