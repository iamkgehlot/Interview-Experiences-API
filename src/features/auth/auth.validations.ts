import z from "zod";

const userBodySchema = z.object({
  name: z
    .string("name field in input is missing")
    .nonempty("please enter your name")
    .toLowerCase(),
  password: z.string().min(8).nonempty("password cannot be empty"),
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

const loginSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().min(8).nonempty(),
});

const loginValidation = z.object({
  body: loginSchema,
});
const userBodyValidation = z.object({
  body: userBodySchema,
});

type userType = z.infer<typeof userBodySchema>;

type loginType = z.infer<typeof loginSchema>;

export { userBodyValidation, type userType, type loginType, loginValidation };
