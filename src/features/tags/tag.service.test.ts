import { HTTP_STATUS, TAG_MESSAGE } from "../../constants/constants.js";
import type TagsRepo from "./tag.repo.js";
import TagService from "./tag.service.js";

jest.mock("../../context/logger.js", () => ({
  getLogger: jest.fn().mockReturnValue({
    child: jest.fn().mockReturnValue({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }),
  }),
}));

describe("Tag Service", () => {
  let tagService: TagService;
  let mockRepo: jest.Mocked<TagsRepo>;

  const validTag = {
    id: 1,
    tagName: "javascript",
    createdByUserid: 1,
    addedOn: new Date("12/2/26"),
  };
  const validAllTags = [
    {
      id: 2,
      tagName: "typescript",
      createdByUserid: 1,
      addedOn: new Date("2026-07-07"),
    },
    {
      id: 1,
      tagName: "javascript",
      createdByUserid: 1,
      addedOn: new Date("12/2/26"),
    },
  ];

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findUserId: jest.fn(),
    };

    tagService = new TagService(mockRepo);
  });

  describe("create()", () => {
    test("HappyPath: return created user", async () => {
      mockRepo.create.mockResolvedValue(validTag);

      const result = await tagService.create(1, "javascript");

      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRepo.create).toHaveBeenCalledWith(1, "javascript");
      expect(result).toEqual(validTag);
    });
  });
  describe("findById())", () => {
    test("HappyPath: return user with id", async () => {
      mockRepo.findById.mockResolvedValue(validTag);

      const result = await tagService.findById(1);

      expect(mockRepo.findById).toHaveBeenCalledTimes(1);
      expect(mockRepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(validTag);
    });
    test("UnhappyPath: to throw error", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(tagService.findById(44)).rejects.toMatchObject({
        status: "fail",
        message: TAG_MESSAGE.TAG_FETCH_FAIL(44),
      });

      expect(mockRepo.findById).toHaveBeenCalledTimes(1);
      expect(mockRepo.findById).toHaveBeenCalledWith(44);
    });
  });

  describe("findAll", () => {
    test("HappyPath: return all tags", async () => {
      mockRepo.findAll.mockResolvedValue(validAllTags);

      const result = await tagService.findAll();
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepo.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(validAllTags);
    });
    test("EdgeCase: returm empty array", async () => {
      mockRepo.findAll.mockResolvedValue([]);

      const result = await tagService.findAll();

      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepo.findAll).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });
  });

  describe("Update", () => {
    test("HappyPath: update and return updated user", async () => {
      const payload = { tagName: "c++" };
      const dbRespnse = { ...validTag, ...payload };
      mockRepo.update.mockResolvedValue(dbRespnse);

      const result = await tagService.update(1, payload);

      expect(mockRepo.update).toHaveBeenCalledTimes(1);
      expect(mockRepo.update).toHaveBeenCalledWith(1, payload);
      expect(result).toEqual(dbRespnse);
    });
  });

  describe("Delete", () => {
    test("HappyPath:delete and return void", async () => {
      const result = await tagService.delete(1);

      expect(mockRepo.delete).toHaveBeenCalledTimes(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
