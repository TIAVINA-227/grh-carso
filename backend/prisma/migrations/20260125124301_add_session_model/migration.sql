-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_utilisateurId_fkey";

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" SERIAL NOT NULL,
    "heure_connexion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "heure_deconnexion" TIMESTAMP(3),
    "duree_minutes" INTEGER,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sessions_utilisateurId_idx" ON "public"."sessions"("utilisateurId");

-- CreateIndex
CREATE INDEX "sessions_heure_connexion_idx" ON "public"."sessions"("heure_connexion");

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
