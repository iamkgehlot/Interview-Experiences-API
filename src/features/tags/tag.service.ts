import type { Tag } from "@prisma/client";
import type TagsRepo from "./tag.repo.js";
import type { tagsType } from "./tag.validations.js";
import AppError from "../../utils/error.handler.js";
import { HTTP_STATUS, TAG_MESSAGE } from "../../constants/constants.js";

export default class TagService {
  constructor(private tagRepo: TagsRepo) {}

  create = async (createdByUserid: number, tagName: Tag): Promise<tagsType> => {
    return await this.tagRepo.create(createdByUserid, tagName);
  };
  findById = async (tagId: number):Promise<tagsType> => {
    const data = await this.tagRepo.findById(tagId);
    if (!data) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        TAG_MESSAGE.TAG_FETCH_FAIL(tagId),
      );
    }
    return data;
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
}
