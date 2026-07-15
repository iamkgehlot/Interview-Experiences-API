import type { Tag } from "@prisma/client";
import type TagsRepo from "./tag.repo.js";
import AppError from "../../utils/error.handler.js";
import { HTTP_STATUS, TAG_MESSAGE } from "../../constants/constants.js";
import { getLogger } from "../../context/logger.js";
import type { tagsType } from "./tag.validations.js";

const logger =()=> getLogger().child({
  module: "Tags",
  service: "service",
});
export default class TagService {
  constructor(private tagRepo: TagsRepo) {}

  create = async (createdByUserid: number, tagName: string): Promise<Tag> => {
    logger().info({ tag: tagName }, "tag created successfully");
    return await this.tagRepo.create(createdByUserid, tagName);
  };
  findById = async (tagId: number): Promise<Tag> => {
    const data = await this.tagRepo.findById(tagId);
    if (!data) {
      
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
  update = async (tagId: number, tagName: tagsType):Promise<Tag>=> {
    logger().info( " tags updated successfully");
    return await this.tagRepo.update(tagId, tagName);
  };
  delete = async (tagId: number):Promise<void> => {
    logger().info( " tags deleted successfully");
     await this.tagRepo.delete(tagId);
  };
}
