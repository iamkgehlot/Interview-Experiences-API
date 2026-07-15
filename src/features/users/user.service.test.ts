import UserService from "./user.service.js";
import type { UserRepository } from "./user.repo.js";
import { SystemRole } from "@prisma/client";

jest.mock("../../context/logger.js", () => ({
  getLogger: jest.fn().mockReturnValue({
    child: jest.fn().mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    }),
  }),
}));

describe("UserService", () => {
  let userService: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  const validUser = {
    id: 1,
    role: SystemRole.USER,
    name: "kamlesh",
    age: 29,
    email: "iamk@gmail.com",
    yearsOfExperience: 6,
    current_role: "It",
    industry: "it",
  };

  const validAllUsers = [
    {
      id: 1,
      role: SystemRole.USER,
      name: "kamlesh",
      age: 29,
      email: "iamk@gmail.com",
      yearsOfExperience: 6,
      current_role: "It",
      industry: "it",
    },
    {
      id: 2,
      role: SystemRole.USER,
      name: "john",
      age: 34,
      email: "johnDoe@gmail.com",
      yearsOfExperience: 2,
      current_role: "architect",
      industry: "architecture",
    },
  ];
  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userService = new UserService(mockRepo);
  });

  describe("getUserById", () => {
    test("Happy Path: should return user when found in db", async () => {
      mockRepo.findById.mockResolvedValue(validUser);

      const result = await userService.getUserById(1);

      expect(mockRepo.findById).toHaveBeenCalledTimes(1);
      expect(mockRepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(validUser);
    });

    test("Unhappy Path: should return null when user is not found in db", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(userService.getUserById(2)).rejects.toThrow(
        "No User found with id: 2",
      );

      expect(mockRepo.findById).toHaveBeenCalledTimes(1);
      expect(mockRepo.findById).toHaveBeenCalledWith(2);
    });
  });

  describe("getAllUsers", () => {
    test("Happy Path: to return all users from db", async () => {
      mockRepo.findAll.mockResolvedValue(validAllUsers);
      const result = await userService.getAllUsers();

      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepo.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(validAllUsers);
    });
    test("Edge Case: to return empty array ", async () => {
      mockRepo.findAll.mockResolvedValue([]);
      const result = await userService.getAllUsers();
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepo.findAll).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });
  });

  describe("updateUser", () => {
    test("HappyPath: return updated user", async () => {
      const updatePayload = {
        name: "kamlesh updated",
        email: "iamkgehlot@gmail.com",
      };
      const dbResponse = { ...validUser, ...updatePayload };
      mockRepo.update.mockResolvedValue(dbResponse);

      const result = await userService.updateUser(1, updatePayload);

      expect(mockRepo.update).toHaveBeenCalledTimes(1);
      expect(mockRepo.update).toHaveBeenCalledWith(1, updatePayload);
      expect(result).toEqual(dbResponse);
    });

    test("UnhappyPath: return error", async () => {
      const invalidData = { email: "not a valid email" };

      await expect(userService.updateUser(1, invalidData)).rejects.toThrow();

      expect(mockRepo.update).toHaveBeenCalledTimes(0);
    });
  });

  describe("deleteUser", () => {
    test("HappyPath: delete user", async () => {
      mockRepo.delete.mockResolvedValue(validUser);

      const result = await userService.deleteUser(1);

      expect(mockRepo.delete).toHaveBeenCalledTimes(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
