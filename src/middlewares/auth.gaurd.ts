import type { SystemRole } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/error.handler.js";
import { AUTH_MESSAGE, HTTP_STATUS } from "../constants/constants.js";
import { getLogger } from "../context/logger.js";

type fetchedUserid = (id: number) => Promise<{ userId: number } | null>;
const logger =()=> getLogger().child({
  module: "middlware",
  service: "auth.guard.ts",
});

export const roleAndAccessCheck = (
  allowedRoles: SystemRole[],
  resourceName?: string,
  fetchUserByResource?: fetchedUserid,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const reqUserId = req.userId;
    const reqRole = req.role;

    if (reqRole === undefined || reqUserId === undefined) {
      logger().warn("Refresh token not found");
      throw new AppError(
        HTTP_STATUS.UNAUTHORISED,
        AUTH_MESSAGE.TOKEN_NOT_FOUND,
      );
    }

    if (allowedRoles.includes(reqRole!)) {
      logger().info(
        { role: reqRole, path: req.baseUrl },
        "special access granted",
      );
      return next();
    }

    if (!resourceName || !fetchUserByResource) {
      logger().warn("resource id or fetch user id by resource is not provided");
      throw new AppError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGE.NOT_PERMITTED);
    }
    const resourceId = Number(req.params[resourceName!]);

    if (isNaN(resourceId)) {
      logger().warn("resource id is incorrect");
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "resource name is incorrect");
    }

    const fetchedUserid = await fetchUserByResource!(resourceId);

    if (!fetchedUserid) {
      logger().warn("resource with given resource id not found ");
      throw new AppError(HTTP_STATUS.NOT_FOUND, "no resource found");
    }

    if (fetchedUserid.userId !== reqUserId) {
      logger().warn("resource does not belong to user");
      throw new AppError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGE.NOT_PERMITTED);
    }

    next();
  };
};
