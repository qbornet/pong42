/*
  Warnings:

  - Made the column `idPlayerLoose` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_idPlayerLoose_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "idPlayerLoose" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_idPlayerLoose_fkey" FOREIGN KEY ("idPlayerLoose") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
