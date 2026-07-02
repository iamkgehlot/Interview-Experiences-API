import "dotenv/config";

if(!process.env.JWT_EXPIRES_IN_MS||!process.env.JWT_SECRET){
  throw new Error("Missing critical JWT environment variables");
}

const jwtExpiresIn=Number(process.env.JWT_EXPIRES_IN_MS);
export const envConfig = Object.freeze({
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET:process.env.JWT_SECRET,
  JWT_EXPIRES_IN:jwtExpiresIn,
  COOKIE_EXPIRES_IN:jwtExpiresIn * 1000,
  NODE_ENV:process.env.NODE_ENV || "development"
});
