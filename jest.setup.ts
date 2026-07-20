import { TextDecoder, TextEncoder } from "util";
import { afterAll } from "@jest/globals";
import { prisma } from "./src/config/prisma.js"; // 👈 Ensure this path points to your actual Prisma singleton file

// ✅ Use globalThis instead of global to satisfy TypeScript
Object.assign(globalThis, { TextDecoder, TextEncoder });

// ✅ Disconnects the database pool after all tests finish
afterAll(async () => {
  await prisma.$disconnect();
});