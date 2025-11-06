// backend/src/scripts/seedSuperAdmin.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('🚀 Création du compte Super Admin...\n');

    // Vérifier si un super admin existe déjà
    const existingSuperAdmin = await prisma.utilisateur.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingSuperAdmin) {
      console.log('⚠️  Un Super Admin existe déjà :');
      console.log(`   Email: ${existingSuperAdmin.email}`);
      console.log(`   Nom: ${existingSuperAdmin.prenom_utilisateur} ${existingSuperAdmin.nom_utilisateur}`);
      console.log('\n❓ Voulez-vous en créer un autre ? (Modifiez le script)\n');
      return;
    }

    // Hasher le mot de passe
    const motDePasseHash = await bcrypt.hash('SuperAdmin2024!', 10);

    // Créer le Super Admin
    const superAdmin = await prisma.utilisateur.create({
      data: {
        nom_utilisateur: 'Super Admin',
        prenom_utilisateur: 'Admin',
        email: 'superadmin@carso.com',
        mot_de_passe: motDePasseHash,
        role: 'SUPER_ADMIN',
        statut: 'ACTIF' 
      }
    });

    console.log('✅ Super Admin créé avec succès !\n');
    console.log('📧 Identifiants de connexion :');
    console.log('   ┌─────────────────────────────────────┐');
    console.log('   │ Email    : superadmin@carso.com     │');
    console.log('   │ Password : SuperAdmin2024!          │');
    console.log('   │ Rôle     : SUPER_ADMIN              │');
    console.log('   └─────────────────────────────────────┘');
    console.log('\n🌐 Connectez-vous sur : http://localhost:5173\n');

  } catch (error) {
    console.error('❌ Erreur lors de la création du Super Admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Créer aussi un Admin et un Employé de test
async function createTestUsers() {
  try {
    console.log('🧪 Création des comptes de test...\n');

    // Admin de test
    const adminExists = await prisma.utilisateur.findUnique({
      where: { email: 'admin@carso.com' }
    });

    if (!adminExists) {
      const adminPassword = await bcrypt.hash('Admin2024!', 10);
      await prisma.utilisateur.create({
        data: {
          nom_utilisateur: 'Admin',
          prenom_utilisateur: 'Jean',
          email: 'admin@carso.com',
          mot_de_passe: adminPassword,
          role: 'ADMIN',
          statut: 'ACTIF'
        }
      });
      console.log('✅ Admin créé : admin@carso.com / Admin2024!');
    }

    // Employé de test
    const employeExists = await prisma.utilisateur.findUnique({
      where: { email: 'employe@carso.com' }
    });

    if (!employeExists) {
      const employePassword = await bcrypt.hash('Employe2024!', 10);
      await prisma.utilisateur.create({
        data: {
          nom_utilisateur: 'Dupont',
          prenom_utilisateur: 'Marie',
          email: 'employe@carso.com',
          mot_de_passe: employePassword,
          role: 'EMPLOYE',
          statut: 'ACTIF'
        }
      });
      console.log('✅ Employé créé : employe@carso.com / Employe2024!');
    }

    console.log('\n✅ Comptes de test créés !\n');

  } catch (error) {
    console.error('❌ Erreur lors de la création des comptes de test:', error);
  }
}

// Exécution
async function main() {
  await createSuperAdmin();
  await createTestUsers();
}

main();