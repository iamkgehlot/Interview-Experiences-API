import { SystemRole } from "@prisma/client";
import z from "zod";

export const userDTO = z.object({
  id: z.number(),
    role: z.enum(SystemRole),
  name: z.string(),
  age: z.number(),
  email: z.email(),
  yearsOfExperience: z.number(),
  current_role: z.string(),
  industry: z.string("industry field in input is missing"),
});

 export type UserDTOType=z.infer<typeof userDTO>;


