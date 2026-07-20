import { SystemRole } from "@prisma/client";
import { accessTokenGenerator } from "../../../helpers/auth.helper.js";
import { testClient } from "../../../helpers/testClient.js";
import { prisma } from "../../../../config/prisma.js";

describe("user routes", () => {
  describe("get user with user id", () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
    });
    test("HappyPath:get user with user id", async () => {
      const accessToken = accessTokenGenerator(1, SystemRole.USER);
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
      const getUser = await testClient
        .get(`/api/users/${createUser.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(getUser.body.data.email).toBe(createUser.email);
    });
    test("UnHappyPath: throw error on unknown user id", async () => {
      const accessToken = accessTokenGenerator(1, SystemRole.USER);
      const unknownUserId = 92367492;
      const findUser = await testClient
        .get(`/api/users/${unknownUserId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404);
      expect(findUser.body.success).toBe(false);
    });
  });
  describe("only admin allowed route", () => {
    test("HappyPath: admin accessing route", async () => {
      const accessToken = accessTokenGenerator(1, SystemRole.ADMIN);
      const getAll = await testClient
        .get("/api/users/")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(getAll.body.success).toBe(true);
      expect(typeof getAll.body.data).toBe("object");
    });
    test("UnHappyPath: users accessing admin only route", async () => {
      const accessToken = accessTokenGenerator(1, SystemRole.USER);
      const getAll = await testClient
        .get("/api/users")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(403);

      expect(getAll.body.success).toBe(false);
      expect(getAll.body.data).toBeUndefined();
    });
  });
});
