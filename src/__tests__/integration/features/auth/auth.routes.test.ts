import { SystemRole } from "@prisma/client";
import { refreshTokenGenerator } from "../../../helpers/auth.helper.js";
import { testClient } from "../../../helpers/testClient.js";
import { prisma } from "../../../../config/prisma.js";
import bcrypt from "bcryptjs";

describe("Auth routes", () => {
  beforeEach(async () => {
    await prisma.refreshTokens.deleteMany();
    await prisma.user.deleteMany();
  });

  describe("Register", () => {
    test("HappyPath: responses >200 and <300", async () => {
      const payload = {
        name: "kamlesh",
        email: "kamlesh12345@gmail.com",
        password: "securepassword123",
        age: 25,
        yearsOfExperience: 3,
        current_role: "backend developer",
        industry: "senior backend developer",
      };
      const beforeCall = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      expect(beforeCall).toBeNull();
      const register = await testClient
        .post("/api/register")
        .send(payload)
        .expect(201);

      expect(register.body.success).toBe(true);
      expect(register.body.data).not.toHaveProperty("password");
      const dbCheck = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      expect(dbCheck).not.toBeNull();
    });

    test("UnHappyPath : data validation errror", async () => {
      const payload = { name: "kamlesh", email: "invalid_email_entry" };

      const register = await testClient
        .post("/api/register")
        .send(payload)
        .expect(400);

      expect(register.body.success).toBe(false);
      const dbCheck = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      expect(dbCheck).toBeNull();
    });

    test("UnHappyPath: duplicate email", async () => {

      const duplicateUser = {
        name: "kamlesh",
        email: "kamlesh@gmail.com",
        password: "securepassword123",
        age: 25,
        yearsOfExperience: 3,
        current_role: "backend developer",
        industry: "senior backend developer",
      };

      await prisma.user.create({ data: duplicateUser });

      const register = await testClient
        .post("/api/register")
        .send(duplicateUser)
        .expect(400);
      expect(register.body.success).toBe(false);
      const dbCheck = await prisma.user.findMany({
        where: { email: duplicateUser.email },
      });
      expect(dbCheck.length).toBe(1);
    });
  });

  describe("login", () => {

    test("HappyPath: successfull login", async () => {
      const password = await bcrypt.hash("securepassword123", 10);
      const registerUser = {
        name: "kamlesh",
        email: "kamlesh@gmail.com",
        password: password,
        age: 25,
        yearsOfExperience: 3,
        current_role: "backend developer",
        industry: "senior backend developer",
      };
      await prisma.user.create({ data: registerUser });

      const loginUser = {
        email: "kamlesh@gmail.com",
        password: "securepassword123",
      };
      const login = await testClient
        .post("/api/login")
        .send(loginUser)
        .expect(200);

      const accessToken = login.body.data.token;
      expect(typeof accessToken).toBe("string");
      expect(accessToken.split(".").length).toBe(3);

      const refreshToken = login.headers["set-cookie"];
      expect(refreshToken).toBeDefined();
      expect(refreshToken![0]).toContain("token=");
      expect(refreshToken![0]?.split(".").length).toBe(3);
    });

    test("UnHappyPath: login failed", async () => {
      const password = await bcrypt.hash("securepassword123", 10);
      const registerUser = {
        name: "kamlesh",
        email: "kamlesh@gmail.com",
        password: password,
        age: 25,
        yearsOfExperience: 3,
        current_role: "backend developer",
        industry: "senior backend developer",
      };
      await prisma.user.create({ data: registerUser });

      const loginUser = {
        email: "kamlesh@gmail.com",
        password: "wrong_password",
      };
      const login = await testClient
        .post("/api/login")
        .send(loginUser)
        .expect(401);

      expect(login.body.success).toBe(false);
      expect(login.body.message).toBe("Invalid Credentials");

      const authHeader = login.headers["set-cookie"];
      expect(authHeader).not.toBeDefined();
    });
  });

  describe("logout", () => {
    test("HappyPath: successfull logout", async () => {
      const user = {
        role: SystemRole.USER,
        name: "kamlesh",
        email: "kamlesh12345@gmail.com",
        password: "securepassword123",
        age: 25,
        yearsOfExperience: 3,
        current_role: "backend developer",
        industry: "senior backend developer",
      };
      const createUser = await prisma.user.create({ data: user });
      const userId = createUser.id;

      const refreshToken = refreshTokenGenerator(userId, SystemRole.USER);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      const createObj = { token: refreshToken, userId, expiresAt };
      await prisma.refreshTokens.create({ data: createObj });

      const logout = await testClient
        .post("/api/logout")
        .set("Cookie", `token=${refreshToken}`)
        .expect(200);

      const logoutHeader = logout.headers["set-cookie"];
      expect(logoutHeader![0]?.startsWith("token=;")).toBe(true);
    });
  });

  describe("Refresh", () => {
    test("HappyPath: refresh token exists in header", async () => {
      //put refresh token in db first
      const user = {
        role: SystemRole.USER,
        name: "kamlesh",
        email: "kamlesh12345@gmail.com",
        password: "securepassword123",
        age: 25,
        yearsOfExperience: 3,
        current_role: "backend developer",
        industry: "senior backend developer",
      };
      const createUser = await prisma.user.create({ data: user });
      const userId = createUser.id;

      const existingRefreshToken = refreshTokenGenerator(
        userId,
        SystemRole.USER,
      );
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      const createObj = { token: existingRefreshToken, userId, expiresAt };
      await prisma.refreshTokens.create({ data: createObj });

      //call refresh token with existing refresh token to generate new
      const refresh = await testClient
        .post("/api/refresh")
        .set("Cookie", `token=${existingRefreshToken}`)
        .expect(200);

      const newRefreshToken = refresh.headers["set-cookie"];
      expect(newRefreshToken).not.toBeUndefined();
      const token = newRefreshToken![0]?.match(/^token=([^;]+)/)?.[1];
      expect(typeof newRefreshToken).toBe("object");
      expect(token?.split(".").length).toBe(3);

      const accessToken = refresh.body.data.accesstoken;
      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe("string");
      expect(accessToken.split(".").length).toBe(3);
    });

    test("UnHappyPath: refreshtoken does not exists in request", async () => {
      const failedRefresh = await testClient.post("/api/refresh").expect(401);
      expect(failedRefresh.body.success).toBe(false);
      const message = "User is not logged in";
      expect(message).toBe(message);
    });
  });
});
