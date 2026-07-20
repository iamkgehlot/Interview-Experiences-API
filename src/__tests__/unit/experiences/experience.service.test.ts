import { interviewOutcome } from "@prisma/client";
import type ExperienceRepo from "../../../features/experiences/experience.repo.js";
import ExperienceService from "../../../features/experiences/experience.service.js";

jest.mock("../../../context/logger.js", () => ({
  getLogger: jest.fn().mockReturnValue({
    child: jest.fn().mockReturnValue({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }),
  }),
}));

describe("Experience Service", () => {
  let experienceService: ExperienceService;
  let mockRepo: jest.Mocked<ExperienceRepo>;

  const validExperience = {
    id: 1,
    userId: 1,
    company: "test company",
    role: "backend engineer",
    roundsCount: 3,
    difficulty: 4,
    outcome: interviewOutcome.OFFER,
    content:
      "{uioshydfv iowusf op9s iwufgiopw opiwrpogfiwr opwrsifwep90o wopefi qwe0p[op0 f0op[ iwefop[;ifwe [op ifwerop[0i kwerf",
    interviewDate: new Date("12/02/26"),
    tagName: ["java", "backend", "interview"],
  };
  const validAllExperience = [
    {
      id: 12,
      userId: 1,
      company: "test company",
      role: "backend engineer",
      roundsCount: 3,
      difficulty: 4,
      outcome: interviewOutcome.OFFER,
      content:
        "{uioshydfv iowusf op9s iwufgiopw opiwrpogfiwr opwrsifwep90o wopefi qwe0p[op0 f0op[ iwefop[;ifwe [op ifwerop[0i kwerf",
      interviewDate: new Date("12/02/26"),
      tags: [
        {
          tagName: "node.js",
        },
        {
          tagName: "backend",
        },
        {
          tagName: "interview",
        },
      ],
    },
    {
      id: 21,
      userId: 1,
      company: "test company",
      role: "backend engineer",
      roundsCount: 3,
      difficulty: 4,
      outcome: interviewOutcome.OFFER,
      content:
        "{uioshydfv iowusf op9s iwufgiopw opiwrpogfiwr opwrsifwep90o wopefi qwe0p[op0 f0op[ iwefop[;ifwe [op ifwerop[0i kwerf",
      interviewDate: new Date("12/02/26"),
      tags: [
        {
          tagName: "node.js",
        },
        {
          tagName: "backend",
        },
        {
          tagName: "interview",
        },
      ],
    },
  ];

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findAllExperience: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      fetchUserIdByExperienceId: jest.fn(),
      findAllByUserId: jest.fn(),
    };
    experienceService = new ExperienceService(mockRepo);
  });

  describe("create", () => {
    test("HappyPath: create experience with give details", async () => {
      mockRepo.create.mockResolvedValue(validExperience);

      const result = await experienceService.createExperience(
        1,
        validExperience,
      );

      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRepo.create).toHaveBeenCalledWith(1, validExperience);
      expect(result).toEqual(validExperience);
    });
  });

  describe("find All Experience", () => {
    test("HappyPath: fetch all experience from db", async () => {
      const mockResult = {
        match: validAllExperience,
        totalMatch: 2,
        page: 1,
        limit: 2,
        totalPages: 1,
      };
      mockRepo.findAllExperience.mockResolvedValue(mockResult);
      const safeQuery = {};

      const result = await experienceService.getAllExperience(safeQuery);

      expect(mockRepo.findAllExperience).toHaveBeenCalledTimes(1);
      expect(mockRepo.findAllExperience).toHaveBeenCalledWith(safeQuery);
      expect(result).toEqual(mockResult);
    });
    test("UnhappyPath:return error on passing wrong Query params", async () => {
      const query = { page: "banana" };

      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        experienceService.getAllExperience(query as any),
      ).rejects.toThrow();

      expect(mockRepo.findAllExperience).toHaveBeenCalledTimes(0);
    });

    describe("getExperienceByUserId", () => {
      test("HappyPath: get experience by user id", async () => {
        mockRepo.findAllByUserId.mockResolvedValue(validAllExperience);

        const result = await experienceService.getAllExperienceByUserId(1);

        expect(mockRepo.findAllByUserId).toHaveBeenCalledTimes(1);
        expect(mockRepo.findAllByUserId).toHaveBeenCalledWith(1);
        expect(result).toEqual(validAllExperience);
      });
    });

    describe("getExperienceById", () => {
      test("HappyPath: get experience by experience by id", async () => {
        mockRepo.findById.mockResolvedValue(validExperience);

        const result = await experienceService.getExperienceById(1);

        expect(mockRepo.findById).toHaveBeenCalledTimes(1);
        expect(mockRepo.findById).toHaveBeenCalledWith(1);
        expect(result).toEqual(validExperience);
      });
      test("UnHappyPath: throw error invalid or unknown experience id", async () => {
        await expect(
          experienceService.getExperienceById(122),
        ).rejects.toThrow();

        expect(mockRepo.findById).toHaveBeenCalledTimes(1);
        expect(mockRepo.findById).toHaveBeenCalledWith(122);
      });
    });
  });

  describe("updateExperience", () => {
    test("HappyPath: update experience by id", async () => {
      const updateData = {
        content:
          "updated content: lorem ipsum is greated than defined chars in content so it passes zod validatio or zod schema if smaller zod wont let data pass to repo for update so writing this bigger content for tests",
      };
      const dbResponse = { ...validExperience, ...updateData };
      mockRepo.update.mockResolvedValue(dbResponse);

      const result = await experienceService.updateExperience(1, 1, updateData);

      expect(mockRepo.update).toHaveBeenCalledTimes(1);
      expect(mockRepo.update).toHaveBeenCalledWith(1, 1, updateData);
      expect(result).toEqual(dbResponse);
    });
    test("HappyPath: update experience by id", async () => {
      const updateData = { content: "short content failing zod parse" };

      await expect(
        experienceService.updateExperience(1, 1, updateData),
      ).rejects.toThrow();

      expect(mockRepo.update).toHaveBeenCalledTimes(0);
    });
  });
  describe("deleteExperience ", () => {
    test("HappyPath:delete experience", async () => {
      const result = await experienceService.deleteExperience(1);

      expect(mockRepo.delete).toHaveBeenCalledTimes(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
