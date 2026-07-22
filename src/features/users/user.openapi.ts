import { registry } from "../../docs/registry.js";
import { userIdSchema } from "./user.validations.js";

registry.registerPath({
  method: "get",
  path: "/api/users/{id}",
  tags: ["User"],
  request: {
    params: userIdSchema,
  },
  responses: {
    201: {
      description: "get user by id",
    },
  },
});
