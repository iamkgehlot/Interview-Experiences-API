import z from "zod";

const tagSchema = z.object({
  tagName: z.string().nonempty(),
  // createdByUserid: z.coerce.number().int().positive(),
});

const tagsIdSchema=z.object({
  tagId:z.coerce.number().int().positive()
})
const tagIdBodyValidation=z.object({
  body:tagSchema,
  params:tagsIdSchema
})
const tagBodyValidation = z.object({
  body: tagSchema,
});

const tagIdValidation=z.object({
  params:tagsIdSchema
});

type tagsType = z.infer<typeof tagSchema>;
export {  type tagsType ,tagIdBodyValidation,tagBodyValidation,tagIdValidation};
