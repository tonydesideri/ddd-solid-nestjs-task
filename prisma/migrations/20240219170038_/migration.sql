/*
  Warnings:

  - You are about to drop the column `url` on the `attachments` table. All the data in the column will be lost.
  - Added the required column `path` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "url",
ADD COLUMN     "path" TEXT NOT NULL;
