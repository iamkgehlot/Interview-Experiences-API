import z from "zod";
// model Tag{
//   id Int @id @default(autoincrement())
//   tagName String @unique
//   createdByUserid Int
//   addedOn DateTime @default(now())
//   experience ExperienceTag[]
//   user User @relation(fields:[createdByUserid],references:[id])
// }
const tagSchema = z.object({
  tagName: z.string().nonempty(),
  userId: z.coerce.number().int().positive(),
});
const tagValidation = z.object({
  body: tagSchema,
});
export { tagValidation };
