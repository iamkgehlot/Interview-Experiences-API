import jwt from "jsonwebtoken";
import { envConfig } from "../../config/env.config.js";
import type { StringValue } from "ms";

export function accessTokenGenerator(userid: number, role: string) {
  const accessSecret = envConfig.JWT_SECRET;
  const exp = envConfig.JWT_EXPIRES_IN;
  const token = jwt.sign({ sub: userid, role: role }, accessSecret, {
    expiresIn: exp,
  });
  return token;
}

export function refreshTokenGenerator(userId: number, role: string) {
  const refreshSecret = envConfig.REFRESH_JWT_SECRET;
  const exp = envConfig.REFRESH_TOKEN_EXPIRES_IN;
  const token = jwt.sign({ sub: userId, role: role }, refreshSecret, {
    expiresIn: exp as StringValue,
  });

  return token;
}
