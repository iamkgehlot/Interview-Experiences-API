
import type { JestPrisma } from "@quramy/jest-prisma-core";
import type { PrismaClient } from "@prisma/client"; 


declare global {
  var jestPrisma: JestPrisma<PrismaClient>;
}