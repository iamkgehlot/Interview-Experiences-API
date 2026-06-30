import type { RequestHandler } from "express";
import type TagService from "./tag.service.js";
import { HTTP_STATUS, TAG_MESSAGE } from "../../constants/constants.js";
import AppError from "../../utils/error.handler.js";

export default class TagController { 
  constructor(private tagService: TagService) {}

  created: RequestHandler = async (req, res) => {
    const createdByUserid = 1;
    const tagName = req.body;
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message:TAG_MESSAGE.TAG_CREATED,
      data: await this.tagService.create(createdByUserid, tagName),
    });
  };

  updated: RequestHandler = async (req, res) => {
    const tagId = Number(req.params.tagId);
    const tagName = req.body;
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message:TAG_MESSAGE.TAG_UPDATED,
      data: await this.tagService.update(tagId, tagName),
    });
  };

  findById: RequestHandler = async (req, res,next) => {
    const tagId = Number(req.params.tagId);
    const data= await this.tagService.findById(tagId);
    if(!data){
        return next(new AppError(HTTP_STATUS.NOT_FOUND,TAG_MESSAGE.TAG_FETCH_FAIL(tagId)))
    }

    return res
      .status(HTTP_STATUS.OK)
      .json({ success: true, data:data });
  };

  findAll: RequestHandler = async (req, res) => {
    const data =await this.tagService.findAll();

    return res
      .status(HTTP_STATUS.OK)
      .json({ success: true, data: data });
  };

  deleted: RequestHandler = async (req, res) => {
     await this.tagService.delete(Number(req.params.tagId));
    return res
      .status(HTTP_STATUS.NO_CONTENT)
      .send();
  };
}
