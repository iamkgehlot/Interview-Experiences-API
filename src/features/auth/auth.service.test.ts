import type { AuthRepository } from "./auth.repo.js";
import AuthService from "./auth.service.js";
import bcrypt from "bcryptjs";
import { SystemRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGE } from "../../constants/constants.js";

jest.mock("../../context/logger.js", () => ({
  getLogger: jest.fn(() => ({
    child: jest.fn(() => ({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    })),
  })),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));
jest.mock("../../config/env.config.js", () => ({
  envConfig: {
    JWT_SECRET: "jwt_secret",
    JWT_EXPIRES_IN: 600,
    REFRESH_JWT_SECRET: "refresh_secret",
    REFRESH_TOKEN_EXPIRES_IN: "7d",
  },
}));

describe("Auth Service", () => {
  let authService: AuthService;
  let mockRepo: jest.Mocked<AuthRepository>;

  const data = {
    name: "kamlesh",
    password: "superSecretPassword123",
    email: "iamkgehlot@gmail.com",
    age: 29,
    yearsOfExperience: 3,
    current_role: "backend dev",
    industry: "it",
    role: SystemRole.USER,
  };
  const validLogin = {
    email: "iamkgehlot@gmail.com",
    password: "superSecretPassword123",
  };

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      deleteRefreshToken: jest.fn(),
      replaceRefreshToken: jest.fn(),
      createRefreshToken: jest.fn(),
      logOut: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;
    authService = new AuthService(mockRepo);
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("HappyPath: user registers successfully", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("hash_password");

      const signupData = { id: 1, ...data };
      mockRepo.create.mockResolvedValue({ ...signupData });

      const result = await authService.register(data);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        "superSecretPassword123",
        expect.any(Number),
      );
      expect(mockRepo.create).toHaveBeenCalledWith({
        ...data,
        password: "hash_password",
      });
      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...resultData } = signupData;
      expect(result).toEqual({ ...resultData });
    });
  });
  describe("login", () => {
    test("HappyPath: successful login", async () => {
      const loginDbResponse = {
        id: 1,
        role: SystemRole.ADMIN,
        password: "hashed_password",
      };
      //mock login in repo
      mockRepo.login.mockResolvedValue(loginDbResponse);
      //mock bcrypt compare to true
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      //jwt initialize
      const fakeAccessToken = "fakeAccessToken";
      const fakeRefreshToken = "fakeRefreshToken";
      const fakeExpTime = 1718000000;
      //mock jwt sign and verify
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce(fakeAccessToken)
        .mockReturnValueOnce(fakeRefreshToken);
      (jwt.verify as jest.Mock).mockReturnValue({ exp: fakeExpTime });

      const result = await authService.login(validLogin);

      //login data validation
      expect(mockRepo.login).toHaveBeenCalledWith(validLogin);
      expect(mockRepo.login).toHaveBeenCalledTimes(1);
      //bcrypt
      expect(bcrypt.compare).toHaveBeenCalledWith(
        validLogin.password,
        loginDbResponse.password,
      );
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      //jwt
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      //save taken to db
      expect(mockRepo.createRefreshToken).toHaveBeenCalledWith(
        loginDbResponse.id,
        fakeRefreshToken,
        new Date(fakeExpTime * 1000),
      );
      expect(mockRepo.createRefreshToken).toHaveBeenCalledTimes(1);
      //return val
      expect(result).toEqual({
        userId: loginDbResponse.id,
        accessToken: fakeAccessToken,
        refreshToken: fakeRefreshToken,
      });
    });
    test("UnHappyPath: incorrect email", async () => {
      const invalidLogin = {
        email: "incorrect@email.com",
        password: "incorrect",
      };
      await expect(authService.login(invalidLogin)).rejects.toThrow(
        ERROR_MESSAGE.INVALID_CREDENTIALS,
      );

      expect(mockRepo.login).toHaveBeenCalledTimes(1);
      expect(mockRepo.login).toHaveBeenCalledWith(invalidLogin);
      expect(bcrypt.compare).toHaveBeenCalledTimes(0);
      expect(mockRepo.createRefreshToken).toHaveBeenCalledTimes(0);
    });
    test("UnHappyPath: incorrect password", async () => {
      const invalidLogin = {
        email: "correct@email.com",
        password: "incorrect",
      };
      const dbResponse = {
        id: 1,
        role: SystemRole.USER,
        password: "hashed_password",
      };
      mockRepo.login.mockResolvedValue(dbResponse);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(invalidLogin)).rejects.toThrow(
        ERROR_MESSAGE.INVALID_CREDENTIALS,
      );

      expect(mockRepo.login).toHaveBeenCalledTimes(1);
      expect(mockRepo.login).toHaveBeenCalledWith(invalidLogin);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        invalidLogin.password,
        dbResponse.password,
      );
      expect(mockRepo.createRefreshToken).toHaveBeenCalledTimes(0);
    });
  });

  describe("Refresh Token", () => {
    test("HappyPath: return rotational token ", async () => {
      const oldRefreshToken = "old_refresh_token";
      const expdate = 1718000000;
      (jwt.verify as jest.Mock)
        .mockReturnValueOnce({ sub: "1", role: SystemRole.ADMIN })
        .mockReturnValueOnce({ exp: expdate });

      mockRepo.refreshToken.mockResolvedValue({ token: oldRefreshToken });

      const newRefreshToken = "new_refresh_token";
      const newAccessToken = "new_access_token";

      (jwt.sign as jest.Mock)
        .mockReturnValueOnce(newRefreshToken)
        .mockReturnValueOnce(newAccessToken);

      const result = await authService.refreshToken(oldRefreshToken);

      expect(jwt.verify).toHaveBeenCalledTimes(2);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(mockRepo.refreshToken).toHaveBeenCalledWith(oldRefreshToken);
      expect(mockRepo.refreshToken).toHaveBeenCalledTimes(1);
      expect(mockRepo.replaceRefreshToken).toHaveBeenCalledWith(
        oldRefreshToken,
        newRefreshToken,
        new Date(expdate * 1000),
      );
      expect(mockRepo.replaceRefreshToken).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        refreshToken: newRefreshToken,
        accessToken: newAccessToken,
      });
    });
    test("UnHappyPath: old token mismatched fail", async () => {
      const jwtReturnVal = { sub: "id", role: SystemRole.USER };
      const token = "incoming_refresh_token";
      (jwt.verify as jest.Mock).mockReturnValue(jwtReturnVal);
      mockRepo.refreshToken.mockResolvedValue(null);

      await expect(authService.refreshToken(token)).rejects.toThrow(
        "security breach",
      );

      expect(mockRepo.refreshToken).toHaveBeenCalledWith(token);
      expect(mockRepo.refreshToken).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(mockRepo.replaceRefreshToken).toHaveBeenCalledTimes(0);
      expect(jwt.sign).toHaveBeenCalledTimes(0);
    });
  });
  describe("logout", () => {
    test("happyPath: logout user", async () => {
      const refreshToken = "refresh_token";
      mockRepo.logOut.mockResolvedValue({ userId: 1 });

      const result = await authService.logOut(refreshToken);

      expect(mockRepo.logOut).toHaveBeenCalledWith(refreshToken);
      expect(mockRepo.logOut).toHaveBeenCalledTimes(1);
      expect(result).toEqual(1);
    });
  });
});
