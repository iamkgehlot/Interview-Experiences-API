// tests/helpers/jest-prisma.d.ts
import type { JestPrisma } from "@quramy/jest-prisma-core";
import type { PrismaClient } from "@prisma/client"; 
// Note: If you export a customized prisma instance from your app, 
// import typeof that instance instead of the base PrismaClient!

declare global {
  var jestPrisma: JestPrisma<PrismaClient>;
}