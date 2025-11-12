// backend/scripts/verifyData.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
  try {
    console.log('🔍 Vérification des données...\n');
    
    // Vérifier les utilisateurs
    const users = await prisma.utilisateur.findMany({
      select: { id: true, email: true, nom_utilisateur: true, role: true }
    });
    
    console.log('👥 UTILISATEURS DISPONIBLES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(u => {
      console.log(`  ID: ${u.id} | Email: ${u.email} | Role: ${u.role}`);
    });
    console.log(`  ✅ Total: ${users.length} utilisateur(s)\n`);
    
    // Vérifier les employés
    const employes = await prisma.employe.findMany({
      select: { id: true, nom: true, prenom: true, matricule: true }
    });
    
    console.log('👔 EMPLOYÉS DISPONIBLES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    employes.forEach(e => {
      console.log(`  ID: ${e.id} | Nom: ${e.prenom} ${e.nom} | Matricule: ${e.matricule}`);
    });
    console.log(`  ✅ Total: ${employes.length} employé(s)\n`);
    
    // Vérifier les congés
    const conges = await prisma.conge.findMany({
      select: { id: true, type_conge: true, statut: true }
    });
    
    console.log('🏖️ CONGÉS EXISTANTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    conges.forEach(c => {
      console.log(`  ID: ${c.id} | Type: ${c.type_conge} | Statut: ${c.statut}`);
    });
    console.log(`  ✅ Total: ${conges.length} congé(s)\n`);
    
    console.log('✅ Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();