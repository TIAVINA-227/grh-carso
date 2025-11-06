// backend/src/scripts/cleanOrphanConges.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanOrphanConges() {
  try {
    console.log('🔍 Recherche des congés orphelins...');

    // Trouver tous les congés avec des utilisateurs inexistants
    const conges = await prisma.$queryRaw`
      SELECT c.id, c."utilisateurId"
      FROM "Conge" c
      LEFT JOIN "utilisateurs" u ON c."utilisateurId" = u.id
      WHERE c."utilisateurId" IS NOT NULL 
      AND u.id IS NULL
    `;

    console.log(`📋 ${conges.length} congé(s) orphelin(s) trouvé(s)`);

    if (conges.length > 0) {
      console.log('Congés concernés:', conges);

      // Supprimer les congés orphelins
      for (const conge of conges) {
        await prisma.conge.delete({
          where: { id: conge.id }
        });
        console.log(`✅ Congé ${conge.id} supprimé (utilisateurId: ${conge.utilisateurId})`);
      }

      console.log(`✅ ${conges.length} congé(s) orphelin(s) supprimé(s)`);
    } else {
      console.log('✅ Aucun congé orphelin trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanOrphanConges();