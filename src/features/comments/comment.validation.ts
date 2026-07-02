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



const userIdValidation = z.object({
  params: userIdSchema,
});

const experienceIdValidation = z.object({
  params: experienceIdSchema,
});
 
const updateCreateCommentSchema=commentSchema.omit({userId:true});
type updateCommentType=z.infer<typeof updateCreateCommentSchema>
const commentIdCommentBodyValidation = z.object({
  body: updateCreateCommentSchema,
  params: commentIdSchema,
});

const commentBodyExperienceIDValidation = z.object({
  body: updateCreateCommentSchema,
  params: experienceIdSchema,
});


type commentType = z.infer<typeof commentSchema>;

export {
  type commentType,
  type updateCommentType,
  commentBodyValidation,
  userIdValidation,
  experienceIdValidation,
  commentBodyExperienceIDValidation,
  commentIdCommentBodyValidation,
  commentIdValidation,
  
};
