import pino from "pino";
import { envConfig } from "./env.config.js";

const isDevelopment = envConfig.NODE_ENV !== "production";

const transport = {
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:standard",
    ignore: "pid, hostname",
  },
};

const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isDevelopment && { transport }),
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers.token",

      //password fields
      "password",
      "req.body.data.password",
      "reqbody.password",
      "data.password",
      "body.password"
    ],
    censor: "[Reducted-Security Compliance]",

    remove: false, //do not remove above fields simply cenesor them so we know the data was present but simply censored
  },
});

export {baseLogger};
