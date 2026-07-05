import { prisma } from "../../config/prisma.js";
import type { Prisma, RefreshTokens, SystemRole, User } from "@prisma/client";
import type { cleanData } from "../../interface/user.cleaned.js";
import type { AuthRepository } from "./auth.repo.js";
import type { loginType } from "./auth.validations.js";

export default class PrismaAuthRepository implements AuthRepository {
  async create(data: cleanData, hashedPassowrd: string): Promise<User> {
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassowrd,
      },
    });
  }
  async login(
    data: loginType,
  ): Promise<{ id: number,role:SystemRole, password: string } | null> {
    return await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        role:true,
        password: true,
      },
    });
  }

  async refreshToken(token: string): Promise<{ token: string } | null> {
    return await prisma.refreshTokens.findFirst({
      where: { token: token },
      select: {
        token: true,
      },
    });
  }

  async deleteRefreshToken(userId: number): Promise<Prisma.BatchPayload> {
    return await prisma.refreshTokens.deleteMany({ where: { userId } });
  }

  async replaceRefreshToken(
    oldToken: string,
    newToken: string,
    expiresAt: Date,
  ): Promise<RefreshTokens> {
    return await prisma.refreshTokens.update({
      where: { token: oldToken },
      data: { token: newToken, expiresAt, createdAt: new Date() },
    });
  }

  async createRefreshToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshTokens> {
    return await prisma.refreshTokens.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }
  async logOut(token: string): Promise<RefreshTokens> {
    return prisma.refreshTokens.delete({ where: { token } });
  }
}
