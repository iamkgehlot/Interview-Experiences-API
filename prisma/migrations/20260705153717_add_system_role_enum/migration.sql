/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('ADMIN', 'USER', 'MODERATOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "SystemRole" NOT NULL;
