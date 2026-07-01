import z from "zod";

const commentSchema = z.object({
  userId: z.coerce.number().int().positive(),
  comment: z.string().nonempty(),
});

const commentIdSchema = z.object({
  commentId: z.coerce.number().int().positive(),
});

const commentIdValidation = z.object({
  params: commentIdSchema,
});

const userIdSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

const experienceIdSchema = z.object({
  experienceId: z.coerce.number().int().positive(),
});

const commentBodyValidation = z.object({
  body: commentSchema,
});

const commentBodyExperienceIDValidation = z.object({
  body: commentSchema,
  params: experienceIdSchema,
});

const userIdValidation = z.object({
  params: userIdSchema,
});

const experienceIdValidation = z.object({
  params: experienceIdSchema,
});

const updateCommentValidation=commentSchema.partial().omit({userId:true});

const commentIdCommentBodyValidation = z.object({
  body: updateCommentValidation,
  params: commentIdSchema,
});
type commentType = z.infer<typeof commentSchema>;

export {
  type commentType,
  commentBodyValidation,
  userIdValidation,
  experienceIdValidation,
  commentBodyExperienceIDValidation,
  commentIdCommentBodyValidation,
  commentIdValidation,
  updateCommentBody
};
