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
import { interviewOutcome } from "../../generated/prisma/index.js";


const baseExperienceSchema = z.object({
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
  interviewDate: z.coerce.date(),
  tagName:z.array(z.string())
});
const paramsUserId = z.object({
  userId: z.coerce.number().int().positive(),
});
const paramsExperienceId = z.object({
  experienceId: z.coerce.number().int().positive(),
});


const experienceBodyValidation = z.object({
  body: baseExperienceSchema,
});
const experienceIdValidation = z.object({
  params: paramsExperienceId,
});

const userIdValidation=z.object({
    params:paramsUserId
});

const userIdExperienceBodyValidation=z.object({
    body:baseExperienceSchema,
    params:paramsUserId
})

const updatedBaseExperienceSchema=baseExperienceSchema.partial();
const updateExperienceValidation = z.object({
  body: updatedBaseExperienceSchema,
  params: paramsExperienceId,
});

type experienceType = z.infer<typeof baseExperienceSchema>;

export {
  type experienceType,
  experienceBodyValidation,
  experienceIdValidation,
  updateExperienceValidation,
  userIdExperienceBodyValidation,
  userIdValidation
  
};
