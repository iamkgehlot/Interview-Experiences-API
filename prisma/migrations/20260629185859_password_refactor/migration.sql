/*
  Warnings:

  - You are about to drop the `ExperienceTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tagName]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `outcome` on the `Experience` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "interviewOutcome" AS ENUM ('OFFER', 'REJECTED', 'NO_RESPONSE', 'WITHDRAWN');

-- DropForeignKey
ALTER TABLE "ExperienceTag" DROP CONSTRAINT "ExperienceTag_experienceId_fkey";

-- DropForeignKey
ALTER TABLE "ExperienceTag" DROP CONSTRAINT "ExperienceTag_tagId_fkey";

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "outcome",
ADD COLUMN     "outcome" "interviewOutcome" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "ExperienceTag";

-- CreateTable
CREATE TABLE "_ExperienceToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ExperienceToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ExperienceToTag_B_index" ON "_ExperienceToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tagName_key" ON "Tag"("tagName");

-- AddForeignKey
ALTER TABLE "_ExperienceToTag" ADD CONSTRAINT "_ExperienceToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExperienceToTag" ADD CONSTRAINT "_ExperienceToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
