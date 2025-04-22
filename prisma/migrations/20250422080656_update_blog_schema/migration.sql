/*
  Warnings:

  - You are about to drop the column `name` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `content` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "name",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL;
