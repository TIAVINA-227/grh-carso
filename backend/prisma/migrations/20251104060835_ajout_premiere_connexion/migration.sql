/*
  Warnings:

  - A unique constraint covering the columns `[token_reset_password]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Utilisateur" ADD COLUMN     "mot_de_passe_temporaire" TEXT,
ADD COLUMN     "premiere_connexion" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "token_expiration" TIMESTAMP(3),
ADD COLUMN     "token_reset_password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_token_reset_password_key" ON "public"."Utilisateur"("token_reset_password");
