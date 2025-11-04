/*
  Warnings:

  - A unique constraint covering the columns `[prenom_utlisateur]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Utilisateur" ADD COLUMN     "prenom_utlisateur" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_prenom_utlisateur_key" ON "public"."Utilisateur"("prenom_utlisateur");
