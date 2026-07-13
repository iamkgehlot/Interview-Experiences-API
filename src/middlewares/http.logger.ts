import { pinoHttp } from "pino-http";
import { baseLogger } from "../config/base.logger.js";
import type { Request, Response } from "express";
import { asyncLocalStorage } from "../context/logger.js";
import type { NextFunction } from "express-serve-static-core";

const pinoMiddleaware = pinoHttp({
  logger: baseLogger,

  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      useragent: req.headers["user-agent"],
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
  //generate reqId
  genReqId: (req: Request, res: Response) => {
    //check if incoming req has req id;
    const reqId =
      req.headers["x-request-id"] || req.headers["x-correlation-id"];

    if (reqId) return reqId;

    //if no incoming req id, generate and add it to each req header
    const customReqId = crypto.randomUUID();

    res.setHeader("x-request-id", customReqId);
    return customReqId;
  },

  //this is custom event listener which activates on request completion or err
  customLogLevel: (req: Request, res: Response, err?: Error) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: (req: Request, res: Response) =>
    `Http Method ${req.method} at ${req.url} completed ${res.statusCode}`,
  customErrorMessage: (req: Request, res: Response, err: Error) =>
    `Http Method ${req.method} at ${req.url} failed: ${err.message}`,
});

const httpLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  pinoMiddleaware(req, res, () => {
    asyncLocalStorage.run({ logger: req.log }, () => {
      next();
    });
  });
};

export { httpLoggerMiddleware };
