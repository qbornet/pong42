/*
  Warnings:

  - You are about to drop the column `oppId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `Match` table. All the data in the column will be lost.
  - Added the required column `idPlayerWin` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_usersId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "oppId",
DROP COLUMN "usersId",
ADD COLUMN     "idPlayerLoose" UUID,
ADD COLUMN     "idPlayerWin" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_idPlayerWin_fkey" FOREIGN KEY ("idPlayerWin") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_idPlayerLoose_fkey" FOREIGN KEY ("idPlayerLoose") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
