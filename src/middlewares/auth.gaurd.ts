import type { SystemRole } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/error.handler.js";
import { AUTH_MESSAGE, HTTP_STATUS } from "../constants/constants.js";

type fetchedUserid = (id: number) => Promise<{ userId: number } | null>;

export const roleAndAccessCheck = (
  allowedRoles: SystemRole[],
  resourceName?: string,
  fetchUserByResource?: fetchedUserid,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const reqUserId = req.userId;
    const reqRole = req.role;

    if (reqRole === undefined || reqUserId === undefined) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORISED,
        AUTH_MESSAGE.TOKEN_NOT_FOUND,
      );
    }

    if (allowedRoles.includes(reqRole!)) {
      return next();
    }

    if (!resourceName || !fetchUserByResource) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGE.NOT_PERMITTED);
    }
    const resourceId = Number(req.params[resourceName!]);
    if (isNaN(resourceId)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "resource name is incorrect");
    }

    const fetchedUserid = await fetchUserByResource!(resourceId);

    if (!fetchedUserid) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "no resource found");
    }

    if (fetchedUserid.userId !== reqUserId) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGE.NOT_PERMITTED);
    }

    next();
  };
};
