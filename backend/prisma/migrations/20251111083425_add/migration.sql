-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_lue" TIMESTAMP(3),
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_utilisateurId_idx" ON "public"."notifications"("utilisateurId");

-- CreateIndex
CREATE INDEX "notifications_lue_idx" ON "public"."notifications"("lue");

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
