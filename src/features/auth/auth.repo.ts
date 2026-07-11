import type { Prisma, RefreshTokens, SystemRole } from "@prisma/client";

import type { loginType, userType } from "./auth.validations.js";
import type { UserDTOType } from "../../types/user.DTO.js";

export interface AuthRepository {
  create(data: userType): Promise<UserDTOType>;
  login(
    data: loginType,
  ): Promise<{ id: number; role: SystemRole; password: string } | null>;
  refreshToken(token: string): Promise<{ token: string } | null>;
  deleteRefreshToken(userId: number): Promise<Prisma.BatchPayload>;
  replaceRefreshToken(
    oldToken: string,
    newToken: string,
    expiresAt: Date,
  ): Promise<RefreshTokens>;
  createRefreshToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshTokens>;
  logOut(token: string): Promise<RefreshTokens>;
}
