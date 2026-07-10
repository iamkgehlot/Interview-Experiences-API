import z from "zod";

export const experienceQuerySchema = z
  .object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().trim().optional(),
    sortBy: z.string().trim().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    filterBy: z.string().trim().optional(),
    userId: z.string().optional(),
    tagName: z.string().trim().optional(),
    tagId: z.string().optional(),
  })
  .strip();
export type ExperienceQueryValidation = z.infer<typeof experienceQuerySchema>;
