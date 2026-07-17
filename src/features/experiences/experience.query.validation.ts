import z from "zod";

export const experienceQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    search: z.string().trim().optional(),
    sortBy: z.string().trim().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    filterBy: z.string().trim().optional(),
    userId: z.coerce.number().optional(),
    tagName: z.string().trim().optional(),
    tagId: z.coerce.number().optional(),
  })
  .strip();
export type ExperienceQueryValidation = z.infer<typeof experienceQuerySchema>;
