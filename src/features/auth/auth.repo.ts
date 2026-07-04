import type { Prisma, RefreshTokens, User } from "@prisma/client";
import type { cleanData } from "../../interface/user.cleaned.js";
import type { loginType } from "./auth.validations.js";

export interface AuthRepository {
  create(data: cleanData, hashedPassowrd: string): Promise<User>;
  login(data: loginType): Promise<{ id: number; password: string } | null>;
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
