import { z } from "zod";
import { registry } from "../../docs/registry.js";

const userIdSchema = registry.register(
  "user id param",
  z
    .object({
      id: z.coerce
        .number("id in url should be valid positive number")
        .int()
        .positive("id in should be valid positive number"),
    })
    .openapi({
      param: {
        name: "id",
        in: "path",
        required: true,
      },
      example: 1,
    }),
);

const userBodySchema = registry.register(
  "create user",
  z.object({
    name: z
      .string("name field in input is missing")
      .nonempty("please enter your name")
      .toLowerCase().openapi({example:"kamlesh gehlot"}),
    email: z
      .email("email field in input is missing")
      .nonempty("please enter email")
      .toLowerCase().openapi({example:"kamlesh.gehlot.dev@gmail.com"}),
    age: z
      .number("age field in input is missing or is not a number")
      .min(18, { message: "minimum age to sign up is 18" }).openapi({example:29}),
    yearsOfExperience: z
      .number("yearsOfExperience field in input is missing")
      .min(0, { message: "experience cannot be negative" }).openapi({example:3}),
    current_role: z
      .string("current_role field in input is missing")
      .nonempty(
        "please enter your current role - fresher/searching if not working",
      )
      .toLowerCase().openapi({example:"backend dev"}),
    industry: z
      .string("industry field in input is missing")
      .nonempty("please enter your industry")
      .toLowerCase().openapi({example:"IT"}),
  }),
);
const userIdValidation = z.object({
  params: userIdSchema,
});
const userBodyValidation = z.object({
  body: userBodySchema,
});

const updatedUserBodySchema = registry.register(
  "update user",
  userBodySchema.partial(),
);

type updatedUserType = z.infer<typeof updatedUserBodySchema>;

const updateUserValidation = z.object({
  body: updatedUserBodySchema,
  params: userIdSchema,
});

type userType = z.infer<typeof userBodySchema>;

export {
  type updatedUserType,
  updateUserValidation,
  type userType,
  userBodyValidation,
  userIdValidation,
  userBodySchema,
  updatedUserBodySchema,
  userIdSchema,
};
