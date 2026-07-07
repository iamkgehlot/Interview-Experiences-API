import type { SystemRole } from "@prisma/client";
import "express";
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      role?: SystemRole;
    }
  }
}
