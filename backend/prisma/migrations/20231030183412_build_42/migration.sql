/*
  Warnings:

  - The `timestamp` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `oppId` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usersId` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_usersId_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "oppId" SET NOT NULL,
ALTER COLUMN "usersId" SET NOT NULL,
DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
