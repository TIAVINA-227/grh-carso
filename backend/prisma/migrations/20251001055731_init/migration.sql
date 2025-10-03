-- CreateEnum
CREATE TYPE "public"."StatutUtilisateur" AS ENUM ('ACTIF', 'BLOQUE');

-- CreateEnum
CREATE TYPE "public"."RoleUtilisateur" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EMPLOYE');

-- CreateEnum
CREATE TYPE "public"."StatutContrat" AS ENUM ('ACTIF', 'TERMINE');

-- CreateEnum
CREATE TYPE "public"."StatutPresence" AS ENUM ('PRESENT', 'ABSENT', 'RETARD');

-- CreateEnum
CREATE TYPE "public"."StatutConge" AS ENUM ('SOUMIS', 'APPROUVE', 'REJETE');

-- CreateEnum
CREATE TYPE "public"."StatutPaiement" AS ENUM ('EFFECTUE', 'EN_ATTENTE', 'ANNULE');

-- CreateTable
CREATE TABLE "public"."Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom_utilisateur" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."RoleUtilisateur" NOT NULL DEFAULT 'EMPLOYE',
    "statut" "public"."StatutUtilisateur" NOT NULL DEFAULT 'ACTIF',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "derniere_connexion" TIMESTAMP(3),
    "employeId" INTEGER,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employe" (
    "id" SERIAL NOT NULL,
    "matricule" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3) NOT NULL,
    "adresse" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "date_embauche" TIMESTAMP(3) NOT NULL,
    "departementId" INTEGER,
    "posteId" INTEGER,

    CONSTRAINT "Employe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Departement" (
    "id" SERIAL NOT NULL,
    "nom_departement" TEXT NOT NULL,
    "responsable" TEXT,

    CONSTRAINT "Departement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Poste" (
    "id" SERIAL NOT NULL,
    "intitule" TEXT NOT NULL,
    "description" TEXT,
    "niveau" TEXT,

    CONSTRAINT "Poste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contrat" (
    "id" SERIAL NOT NULL,
    "type_contrat" TEXT NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3),
    "salaire_base" DOUBLE PRECISION NOT NULL,
    "statut" "public"."StatutContrat" NOT NULL DEFAULT 'ACTIF',
    "employeId" INTEGER NOT NULL,

    CONSTRAINT "Contrat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Absence" (
    "id" SERIAL NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "type_absence" TEXT NOT NULL,
    "justification" TEXT,
    "piece_jointe" TEXT,
    "employeId" INTEGER NOT NULL,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Presence" (
    "id" SERIAL NOT NULL,
    "date_jour" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "public"."StatutPresence" NOT NULL DEFAULT 'PRESENT',
    "heures_travaillees" INTEGER,
    "justification" TEXT,
    "employeId" INTEGER NOT NULL,

    CONSTRAINT "Presence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conge" (
    "id" SERIAL NOT NULL,
    "type_conge" TEXT,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "statut" "public"."StatutConge" NOT NULL DEFAULT 'SOUMIS',
    "utilisateurId" INTEGER NOT NULL,
    "employeId" INTEGER NOT NULL,

    CONSTRAINT "Conge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SuiviPerformance" (
    "id" SERIAL NOT NULL,
    "date_eval" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" INTEGER NOT NULL,
    "resultat" TEXT,
    "commentaires" TEXT,
    "objectifs" TEXT,
    "realisation" TEXT,
    "employeId" INTEGER NOT NULL,

    CONSTRAINT "SuiviPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Paiement" (
    "id" SERIAL NOT NULL,
    "date_paiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant" DOUBLE PRECISION NOT NULL,
    "mode_paiement" TEXT NOT NULL,
    "statut" "public"."StatutPaiement" NOT NULL DEFAULT 'EFFECTUE',
    "periode_debut" TIMESTAMP(3) NOT NULL,
    "periode_fin" TIMESTAMP(3) NOT NULL,
    "employeId" INTEGER NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BulletinSalaire" (
    "id" SERIAL NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "salaire_brut" DOUBLE PRECISION NOT NULL,
    "salaire_net" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'valide',
    "paiementId" INTEGER NOT NULL,

    CONSTRAINT "BulletinSalaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_nom_utilisateur_key" ON "public"."Utilisateur"("nom_utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "public"."Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_employeId_key" ON "public"."Utilisateur"("employeId");

-- CreateIndex
CREATE UNIQUE INDEX "Employe_matricule_key" ON "public"."Employe"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "Employe_email_key" ON "public"."Employe"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Departement_nom_departement_key" ON "public"."Departement"("nom_departement");

-- CreateIndex
CREATE UNIQUE INDEX "Contrat_employeId_key" ON "public"."Contrat"("employeId");

-- CreateIndex
CREATE UNIQUE INDEX "BulletinSalaire_paiementId_key" ON "public"."BulletinSalaire"("paiementId");

-- AddForeignKey
ALTER TABLE "public"."Utilisateur" ADD CONSTRAINT "Utilisateur_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "public"."Employe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Employe" ADD CONSTRAINT "Employe_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "public"."Departement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Employe" ADD CONSTRAINT "Employe_posteId_fkey" FOREIGN KEY ("posteId") REFERENCES "public"."Poste"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contrat" ADD CONSTRAINT "Contrat_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "public"."Employe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Absence" ADD CONSTRAINT "Absence_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "public"."Employe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Presence" ADD CONSTRAINT "Presence_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "public"."Employe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conge" ADD CONSTRAINT "Conge_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conge" ADD CONSTRAINT "Conge_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "public"."Employe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SuiviPerformance" ADD CONSTRAINT "SuiviPerformance_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "public"."Employe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Paiement" ADD CONSTRAINT "Paiement_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "public"."Employe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BulletinSalaire" ADD CONSTRAINT "BulletinSalaire_paiementId_fkey" FOREIGN KEY ("paiementId") REFERENCES "public"."Paiement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
