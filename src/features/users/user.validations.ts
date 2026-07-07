import { z } from "zod";

const userIdSchema = z.object({
  id: z.coerce
    .number("id in url should be valid positive number")
    .int()
    .positive("id in should be valid positive number"),
});

const userBodySchema = z.object({
  name: z
    .string("name field in input is missing")
    .nonempty("please enter your name")
    .toLowerCase(),
  email: z
    .email("email field in input is missing")
    .nonempty("please enter email")
    .toLowerCase(),
  age: z
    .number("age field in input is missing or is not a number")
    .min(18, { message: "minimum age to sign up is 18" }),
  yearsOfExperience: z
    .number("yearsOfExperience field in input is missing")
    .min(0, { message: "experience cannot be negative" }),
  current_role: z
    .string("current_role field in input is missing")
    .nonempty(
      "please enter your current role - fresher/searching if not working",
    )
    .toLowerCase(),
  industry: z
    .string("industry field in input is missing")
    .nonempty("please enter your industry")
    .toLowerCase(),
});
const userIdValidation = z.object({
  params: userIdSchema,
});
const userBodyValidation = z.object({
  body: userBodySchema,
});

const updatedUserBodySchema = userBodySchema.partial();
const updateUserValidation = z.object({
  body: updatedUserBodySchema,
  params: userIdSchema,
});

type userType = z.infer<typeof userBodySchema>;



export {
  updateUserValidation,
  type userType,
  userBodyValidation,
  userIdValidation,
};
