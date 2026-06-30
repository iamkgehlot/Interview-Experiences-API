import "dotenv/config";
export const envConfig = Object.freeze({
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET:process.env.JWT_SECRET,
  JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN
});
