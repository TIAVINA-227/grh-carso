-- Create notifications table
CREATE TABLE "public"."notifications" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "categorie" TEXT,
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_lue" TIMESTAMP(3),
    "metadata" JSONB,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- Indexes for faster lookups
CREATE INDEX "notifications_utilisateurId_idx" ON "public"."notifications"("utilisateurId");
CREATE INDEX "notifications_lue_idx" ON "public"."notifications"("lue");

-- Relation with utilisateurs
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

