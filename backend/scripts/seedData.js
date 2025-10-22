import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Seeding data...');

    // Vérifier si les départements existent déjà
    const existingDepartements = await prisma.departement.count();
    if (existingDepartements === 0) {
      // Créer des départements
      const departements = [
        { nom_departement: 'Direction', responsable: 'Directeur Général' },
        { nom_departement: 'Développement', responsable: 'Chef de Projet' },
        { nom_departement: 'Marketing', responsable: 'Responsable Marketing' },
        { nom_departement: 'Ventes', responsable: 'Directeur Commercial' },
        { nom_departement: 'Ressources Humaines', responsable: 'Directeur RH' },
      ];

      for (const dept of departements) {
        await prisma.departement.create({
          data: dept,
        });
      }

      console.log('✅ Départements créés');
    } else {
      console.log('✅ Départements déjà existants');
    }

    // Vérifier si les postes existent déjà
    const existingPostes = await prisma.poste.count();
    if (existingPostes === 0) {
      // Créer des postes
      const postes = [
        { intitule: 'Directeur Général', description: 'Direction générale de l\'entreprise', niveau: 'Cadre' },
        { intitule: 'Directeur RH', description: 'Gestion des ressources humaines', niveau: 'Cadre' },
        { intitule: 'Chef de Projet', description: 'Gestion des projets de développement', niveau: 'Cadre' },
        { intitule: 'Développeur Frontend', description: 'Développement d\'interfaces utilisateur', niveau: 'Technicien' },
        { intitule: 'Développeur Backend', description: 'Développement de services backend', niveau: 'Technicien' },
        { intitule: 'Responsable Marketing', description: 'Stratégie et communication marketing', niveau: 'Cadre' },
        { intitule: 'Commercial', description: 'Vente et prospection client', niveau: 'Technicien' },
        { intitule: 'Assistant RH', description: 'Support aux activités RH', niveau: 'Technicien' },
      ];

      for (const poste of postes) {
        await prisma.poste.create({
          data: poste,
        });
      }

      console.log('✅ Postes créés');
    } else {
      console.log('✅ Postes déjà existants');
    }

    // Créer quelques employés de test
    const existingEmployes = await prisma.employe.count();
    if (existingEmployes === 0) {
      const departementDev = await prisma.departement.findFirst({ where: { nom_departement: 'Développement' } });
      const posteDev = await prisma.poste.findFirst({ where: { intitule: 'Développeur Frontend' } });

      if (departementDev && posteDev) {
        const employeTest = await prisma.employe.create({
          data: {
            matricule: 'EMP001',
            nom: 'Dupont',
            prenom: 'Jean',
            email: 'jean.dupont@carso.com',
            telephone: '+261 34 12 34 56',
            date_naissance: new Date('1990-05-15'),
            date_embauche: new Date('2023-01-15'),
            adresse: 'Antananarivo, Madagascar',
            departementId: departementDev.id,
            posteId: posteDev.id,
          },
        });

        console.log('✅ Employé de test créé:', employeTest.matricule);
      }
    } else {
      console.log('✅ Employés déjà existants');
    }

    console.log('🎉 Seeding terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
