/*
  Warnings:

  - You are about to drop the column `prenom_utlisateur` on the `Utilisateur` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prenom_utilisateur]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Utilisateur_prenom_utlisateur_key";

-- AlterTable
ALTER TABLE "public"."Utilisateur" DROP COLUMN "prenom_utlisateur",
ADD COLUMN     "prenom_utilisateur" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_prenom_utilisateur_key" ON "public"."Utilisateur"("prenom_utilisateur");
