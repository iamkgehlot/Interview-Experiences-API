import { configDotenv } from "dotenv";
import "dotenv/config";
// function envCheck(keyName: string, defValue: string) {
//   const value = process.env[keyName] || defValue;
//   if (!value) {
//     throw new Error(`Critical:value in env is missing at ${keyName}`);
//   }
//   return value;
// }
configDotenv();
export const envConfig = Object.freeze({
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET:process.env.JWT_SECRET,
  JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN
});
