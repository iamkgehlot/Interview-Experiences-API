import type { Tag } from "@prisma/client";
import type TagsRepo from "./tag.repo.js";
import type { tagsType } from "./tag.validations.js";
import AppError from "../../utils/error.handler.js";
import { HTTP_STATUS, TAG_MESSAGE } from "../../constants/constants.js";
import { getLogger } from "../../context/logger.js";
const logger =()=> getLogger().child({
  module: "Tags",
  service: "service",
});
export default class TagService {
  constructor(private tagRepo: TagsRepo) {}

  create = async (createdByUserid: number, tagName: Tag): Promise<tagsType> => {
    logger().info({ tag: tagName.tagName }, "tag created successfully");
    return await this.tagRepo.create(createdByUserid, tagName);
  };
  findById = async (tagId: number): Promise<tagsType> => {
    const data = await this.tagRepo.findById(tagId);
    if (!data) {
      logger().warn({ tagId: tagId }, "tag fetch unsuccessfull");
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        TAG_MESSAGE.TAG_FETCH_FAIL(tagId),
      );
    }
    logger().info({ tagId: tagId }, "tag fetch successfully");
    return data;
  };
  findAll = async () => {
    logger().info( "all tags fetch successfully");
    return await this.tagRepo.findAll();
  };
  update = async (tagId: number, tagName: Tag) => {
    logger().info( " tags updated successfully");
    return await this.tagRepo.update(tagId, tagName);
  };
  delete = async (tagId: number) => {
    logger().info( " tags deleted successfully");
    return await this.tagRepo.delete(tagId);
  };
}
