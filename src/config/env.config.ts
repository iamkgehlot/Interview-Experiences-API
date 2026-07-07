import "dotenv/config";
import ms, { type StringValue } from "ms";

if (
  !process.env.JWT_EXPIRES_IN_SECONDS ||
  !process.env.JWT_SECRET ||
  !process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ||
  !process.env.REFRESH_JWT_SECRET
) {
  throw new Error("Missing critical JWT environment variables");
}

const jwtExpiresIn = Number(process.env.JWT_EXPIRES_IN_SECONDS);
const refreshJwtExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS;
export const envConfig = Object.freeze({
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: jwtExpiresIn,
  COOKIE_MAXAGE: jwtExpiresIn * 1000,
  NODE_ENV: process.env.NODE_ENV || "development",
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: refreshJwtExpiresIn,
  REFRESH_COOKIE_MAXAGE: ms(refreshJwtExpiresIn as StringValue),
});
