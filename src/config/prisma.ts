// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();
import { PrismaClient } from "@prisma/client";

// 1. Create a single base instance for normal app use and fallback
const basePrisma = new PrismaClient();

// 2. Explicitly type as PrismaClient so zero imports break in TypeScript
export const prisma: PrismaClient = process.env.NODE_ENV === "test"
  ? new Proxy(basePrisma, {
      get: (target, prop, receiver) => {
        // If a Jest test block is actively running, route to its transaction client!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof globalThis !== "undefined" && (globalThis as any).jestPrisma?.client) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const testClient = (globalThis as any).jestPrisma.client;
          return Reflect.get(testClient, prop, receiver);
        }
        
        // Otherwise (during import time, setup, or teardown), safely use the base client
        return Reflect.get(target, prop, receiver);
      },
    })
  : basePrisma;