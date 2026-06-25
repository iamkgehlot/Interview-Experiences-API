import "dotenv/config";
// function envCheck(keyName: string, defValue: string) {
//   const value = process.env[keyName] || defValue;
//   if (!value) {
//     throw new Error(`Critical:value in env is missing at ${keyName}`);
//   }
//   return value;
// }
export const envConfig = Object.freeze({
  PORT: Number(process.env.PORT) || 3000,
});
