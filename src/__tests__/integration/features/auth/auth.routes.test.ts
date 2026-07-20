import { SystemRole } from "@prisma/client";
import { refreshTokenGenerator } from "../../../helpers/auth.helper.js";
import { testClient } from "../../../helpers/testClient.js";

describe("Auth routes", () => {
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
      const beforeCall = await jestPrisma.client.user.findUnique({
        where: { email: payload.email },
      });
      expect(beforeCall).not.toBeDefined();
      const register = await testClient
        .post("/api/v1/register")
        .send(payload)
        .expect(201);

      expect(register.body.success).toBe(true);
      const dbCheck = await jestPrisma.client.user.findUnique({
        where: { email: payload.email },
      });
      expect(dbCheck).not.toBeDefined();
    });
    test("UnHappyPath : data validation errror", async () => {
      const payload = { name: "kamlesh", email: "invalid_email_entry" };

      const register = await testClient
        .post("/api/v1/register")
        .send(payload)
        .expect(400);

      expect(register.body.success).toBe(false);
      const dbCheck = await jestPrisma.client.user.findUnique({
        where: { email: payload.email },
      });
      expect(dbCheck).not.toBeDefined();
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

      await jestPrisma.client.user.create({ data: duplicateUser });

      const register = await testClient
        .post("/api/v1/register")
        .send(duplicateUser)
        .expect(400);
      expect(register.body.success).toBe(false);
      const dbCheck = await jestPrisma.client.user.findMany({
        where: { email: duplicateUser.email },
      });
      expect(dbCheck.length).toBe(1);
    });
  });
  describe("login", () => {
    test("HappyPath: successfull login", async () => {
      const registerUser = {
        name: "kamlesh",
        email: "kamlesh@gmail.com",
        password: "securepassword123",
        age: 25,
        yearsOfExperience: 3,
        current_role: "backend developer",
        industry: "senior backend developer",
      };
      await jestPrisma.client.user.create({ data: registerUser });

      const loginUser = {
        email: "kamlesh@gmail.com",
        password: "securepassword123",
      };
      const login = await testClient
        .post("/api/v1/login")
        .send(loginUser)
        .expect(200);

      const accessToken = login.body.data.token;
      expect(typeof accessToken).toBe("string");
      expect(accessToken.split(".").length).toBe(3);

      const refreshToken = login.headers["set-cookie"];
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe("string");
      expect(refreshToken?.split(".").length).toBe(3);
    });
    test("UnHappyPath: login failed", async () => {
      const registerUser = {
        name: "kamlesh",
        email: "kamlesh@gmail.com",
        password: "securepassword123",
        age: 25,
        yearsOfExperience: 3,
        current_role: "backend developer",
        industry: "senior backend developer",
      };
      await jestPrisma.client.user.create({ data: registerUser });

      const loginUser = {
        email: "kamlesh@gmail.com",
        password: "wrong_password",
      };
      const login = await testClient
        .post("/api/v1/login")
        .send(loginUser)
        .expect(400);

      expect(login.body.success).toBe(false);
      expect(login.body.message).toBe("Invalid Credentials");

      const authHeader = login.headers["set-cookie"];
      expect(authHeader).not.toBeDefined();
    });
  });
  describe("logout", () => {
    test("HappyPath: successfull logout", async () => {
      const refreshToken = refreshTokenGenerator(1, SystemRole.USER);
      const logout = await testClient
        .get("/api/v1/logout")
        .set("Cookie", refreshToken)
        .expect(200);

      const logoutHeader = logout.headers["authorization"];
      expect(logoutHeader).not.toBeDefined();
    });
  });
  describe("Refresh", () => {
    test("HappyPath: refresh token exists in header", async () => {
      //put refresh token in db first
      const existingRefreshToken = refreshTokenGenerator(1, SystemRole.USER);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      const userId = 1;
      const createObj = { token: existingRefreshToken, userId, expiresAt };
      await jestPrisma.client.refreshTokens.create({ data: createObj });

      //call refresh token with existing refresh token to generate new
      const refresh = await testClient
        .post("/api/v1/refresh")
        .set("Cookie", existingRefreshToken)
        .expect(200);

      const newRefreshToken = refresh.headers["set-cookie"];
      expect(newRefreshToken).not.toBeUndefined();
      expect(typeof newRefreshToken).toBe("string");
      expect(newRefreshToken?.split(".").length).toBe(3);

      const accessToken = refresh.body.data.accesstoken;
      expect(accessToken).not.toBeDefined();
      expect(typeof accessToken).toBe("string");
      expect(accessToken.split(".").length).toBe(3);
    });
  });
});
