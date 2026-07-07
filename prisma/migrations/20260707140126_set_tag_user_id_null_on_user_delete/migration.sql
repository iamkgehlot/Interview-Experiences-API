-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_createdByUserid_fkey";

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "createdByUserid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_createdByUserid_fkey" FOREIGN KEY ("createdByUserid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
