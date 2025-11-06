/*
  Warnings:

  - You are about to drop the `Utilisateur` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Conge" DROP CONSTRAINT "Conge_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Utilisateur" DROP CONSTRAINT "Utilisateur_employeId_fkey";

-- DropTable
DROP TABLE "public"."Utilisateur";

-- CreateTable
CREATE TABLE "public"."utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom_utilisateur" TEXT NOT NULL,
    "prenom_utilisateur" TEXT,
    "mot_de_passe" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."RoleUtilisateur" NOT NULL DEFAULT 'EMPLOYE',
    "statut" "public"."StatutUtilisateur" NOT NULL DEFAULT 'ACTIF',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "derniere_connexion" TIMESTAMP(3),
    "premiere_connexion" BOOLEAN NOT NULL DEFAULT true,
    "mot_de_passe_temporaire" TEXT,
    "token_reset_password" TEXT,
    "token_expiration" TIMESTAMP(3),
    "avatar" TEXT,
    "photo_couverture" TEXT DEFAULT '#3B82F6',
    "bio" TEXT,
    "telephone" TEXT,
    "date_naissance" TIMESTAMP(3),
    "adresse" TEXT,
    "ville" TEXT,
    "pays" TEXT DEFAULT 'Madagascar',
    "employeId" INTEGER,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_nom_utilisateur_key" ON "public"."utilisateurs"("nom_utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "public"."utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_token_reset_password_key" ON "public"."utilisateurs"("token_reset_password");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_employeId_key" ON "public"."utilisateurs"("employeId");

-- AddForeignKey
ALTER TABLE "public"."utilisateurs" ADD CONSTRAINT "utilisateurs_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "public"."Employe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conge" ADD CONSTRAINT "Conge_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
