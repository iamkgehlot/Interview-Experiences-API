// model Experience{
//   id Int @id @default(autoincrement())
//   userId Int
//   company String
//   role String
//   roundsCount Int
//   difficulty Int
//   outcome interviewOutcome
//   content String
//   interviewDate DateTime
//   comments Comment[]
//   tags ExperienceTag[]
import z from "zod";
import { interviewOutcome } from "../../generated/prisma/enums.js";

const experienceSchema = z.object({
  company: z
    .string()
    .nonempty("interviewing company name is required")
    .toLowerCase(),
  role: z.string().nonempty("application role is required").toLowerCase(),
  roundsCount: z.number().min(1).max(5),
  difficulty: z.number().min(1).max(5),
  outcome: z.enum(interviewOutcome),
  content: z
    .string()
    .min(20)
    .nonempty("please write full content of atlease 20 words"),
  interviewDate: z.date(),
});
const userId = z.object({
  userId: z.coerce.number().int().positive(),
});
const experienceId = z.object({
  id: z.coerce.number().int().positive(),
});

const experienceBodyValidation = z.object({
  body: experienceSchema,
});
const experienceIdValidation = z.object({
  params: experienceId,
});
const updateExperienceValidation = z.object({
  body: experienceSchema,
  id: experienceId,
});

type experienceType = z.infer<typeof experienceSchema>;

export {
  type experienceType,
  experienceBodyValidation,
  experienceIdValidation,
  updateExperienceValidation,
};
