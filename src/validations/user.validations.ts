import { z } from "zod";

const userValidation = z.object({
  name: z.string("name field in input is missing").nonempty().toLowerCase(),
  email: z.email("email field in input is missing").nonempty().toLowerCase(),
  age: z.coerce
    .number("age field in input is missing")
    .min(18, { message: "minimum age to sign up is 18" }),
  yearsOfExperience: z.coerce
    .number("yearsOfExperience field in input is missing")
    .min(0, { message: "experience cannot be negative" }),
  current_role: z
    .string("current_role field in input is missing")
    .nonempty("fresher/searching if not working")
    .toLowerCase(),
  industry: z
    .string("industry field in input is missing")
    .nonempty()
    .toLowerCase(),
});
type userType = z.infer<typeof userValidation>;

export { userValidation, type userType };
