import dotenv from "dotenv";
import type { JestConfigWithTsJest } from "ts-jest";


dotenv.config({ path: "./.env.test" });

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "@quramy/jest-prisma/environment",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
        },
      },
    ],
  },
};

export default config;