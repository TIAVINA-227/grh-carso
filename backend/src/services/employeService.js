// // backend/src/services/employeService.js
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Ajouter un employé
// export const createEmploye = async (data) => {
//   const payload = {
//     matricule: data.matricule || `EMP${Date.now()}`,
//     nom: data.nom,
//     prenom: data.prenom,
//     date_naissance: data.date_naissance ? new Date(data.date_naissance) : undefined,
//     adresse: data.adresse || null,
//     email: data.email,
//     telephone: data.telephone,
//     date_embauche: data.date_embauche ? new Date(data.date_embauche) : undefined,
//     departementId: data.departementId || null,
//     posteId: data.posteId || null,
//   };

//   return await prisma.employe.create({
//     data: payload,
//     include: {
//       departement: true,
//       poste: true,
//       contrat: true
//     }
//   });
// };

// // Récupérer tous les employés
// export const getAllEmployes = async () => {
//   return await prisma.employe.findMany({
//     orderBy: { id: 'desc' },
//     include: {
//       departement: true,
//       poste: true,
//       contrat: true
//     }
//   });
// };

// // Récupérer un employé par ID
// export const getEmployeById = async (id) => {
//   const intId = Number(id);
//   return await prisma.employe.findUnique({
//     where: { id: intId },
//     include: {
//       departement: true,
//       poste: true,
//       contrat: true
//     }
//   });
// };

// // Mettre à jour un employé
// export const updateEmploye = async (id, data) => {
//   const intId = Number(id);

//   const updateData = {
//     nom: data.nom,
//     prenom: data.prenom,
//     email: data.email,
//     telephone: data.telephone,
//     adresse: data.adresse || null,
//     date_naissance: data.date_naissance ? new Date(data.date_naissance) : undefined,
//     date_embauche: data.date_embauche ? new Date(data.date_embauche) : undefined,
//     departementId: data.departementId || null,
//     posteId: data.posteId || null,
//   };

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] === undefined) {
//       delete updateData[key];
//     }
//   });

//   return await prisma.employe.update({
//     where: { id: intId },
//     data: updateData,
//     include: {
//       departement: true,
//       poste: true,
//       contrat: true
//     }
//   });
// };

// // ✅ Supprimer un employé proprement
// export const deleteEmploye = async (id) => {
//   const intId = Number(id);

//   try {
//     // Supprimer toutes les dépendances
//     await prisma.contrat.deleteMany({ where: { employeId: intId } });
//     // TODO: ajouter les autres dépendances si nécessaire
//     // await prisma.tache.deleteMany({ where: { employeId: intId } });

//     // Supprimer l'employé
//     await prisma.employe.delete({ where: { id: intId } });

//     return { success: true, message: "Employé supprimé avec succès" };
//   } catch (error) {
//     console.error("Erreur suppression employé :", error);
//     if (error.code === "P2003") {
//       throw new Error(
//         "Impossible de supprimer cet employé car il est utilisé dans d'autres tables."
//       );
//     }
//     throw new Error("Erreur lors de la suppression de l'employé : " + error.message);
//   }
// };

// // Récupérer tous les départements
// export const getAllDepartements = async () => {
//   return await prisma.departement.findMany({
//     orderBy: { nom_departement: 'asc' },
//   });
// };

// // Récupérer tous les postes
// export const getAllPostes = async () => {
//   return await prisma.poste.findMany({
//     orderBy: { intitule: 'asc' },
//   });
// };
// =====================================================
// backend/src/services/employeService.js - COMPLET
// =====================================================
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer un employé
export const createEmploye = async (data) => {
  const payload = {
    matricule: data.matricule || `EMP${Date.now()}`,
    nom: data.nom,
    prenom: data.prenom,
    date_naissance: data.date_naissance ? new Date(data.date_naissance) : undefined,
    adresse: data.adresse || null,
    email: data.email,
    telephone: data.telephone,
    date_embauche: data.date_embauche ? new Date(data.date_embauche) : undefined,
    departementId: data.departementId || null,
    posteId: data.posteId || null,
  };

  return await prisma.employe.create({
    data: payload,
    include: {
      departement: true,
      poste: true,
      contrat: true
    }
  });
};

// Récupérer tous les employés
export const getAllEmployes = async () => {
  return await prisma.employe.findMany({
    orderBy: { id: 'desc' },
    include: {
      departement: true,
      poste: true,
      contrat: true
    }
  });
};

// Récupérer un employé par ID
export const getEmployeById = async (id) => {
  const intId = Number(id);
  return await prisma.employe.findUnique({
    where: { id: intId },
    include: {
      departement: true,
      poste: true,
      contrat: true,
      utilisateur: true
    }
  });
};

// Mettre à jour un employé
export const updateEmploye = async (id, data) => {
  const intId = Number(id);

  const updateData = {
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    telephone: data.telephone,
    adresse: data.adresse || null,
    date_naissance: data.date_naissance ? new Date(data.date_naissance) : undefined,
    date_embauche: data.date_embauche ? new Date(data.date_embauche) : undefined,
    departementId: data.departementId || null,
    posteId: data.posteId || null,
  };

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  return await prisma.employe.update({
    where: { id: intId },
    data: updateData,
    include: {
      departement: true,
      poste: true,
      contrat: true
    }
  });
};

// ✅ Supprimer un employé avec toutes ses dépendances
export const deleteEmploye = async (id) => {
  const intId = Number(id);

  try {
    // Utiliser une transaction pour garantir l'intégrité
    const result = await prisma.$transaction(async (tx) => {
      // 1. Vérifier si l'employé existe
      const employe = await tx.employe.findUnique({
        where: { id: intId },
        include: {
          utilisateur: true,
          contrat: true,
        },
      });

      if (!employe) {
        throw new Error('Employé non trouvé');
      }

      // 2. Supprimer l'utilisateur associé si existant
      const utilisateur = await tx.utilisateur.findFirst({
        where: { employeId: intId }
      });

      if (utilisateur) {
        await tx.utilisateur.delete({
          where: { id: utilisateur.id }
        });
      }

      // 3. Supprimer les bulletins de salaire liés aux paiements
      const paiements = await tx.paiement.findMany({
        where: { employeId: intId },
        select: { id: true },
      });

      if (paiements.length > 0) {
        const paiementIds = paiements.map((p) => p.id);
        
        await tx.bulletinSalaire.deleteMany({
          where: { paiementId: { in: paiementIds } },
        });
      }

      // 4. Supprimer les paiements
      await tx.paiement.deleteMany({
        where: { employeId: intId },
      });

      // 5. Supprimer le contrat
      await tx.contrat.deleteMany({
        where: { employeId: intId },
      });

      // 6. Supprimer les absences
      await tx.absence.deleteMany({
        where: { employeId: intId },
      });

      // 7. Supprimer les présences
      await tx.presence.deleteMany({
        where: { employeId: intId },
      });

      // 8. Supprimer les congés
      await tx.conge.deleteMany({
        where: { employeId: intId },
      });

      // 9. Supprimer les suivis de performance
      await tx.suiviPerformance.deleteMany({
        where: { employeId: intId },
      });

      // 10. Finalement, supprimer l'employé
      const employeDeleted = await tx.employe.delete({
        where: { id: intId },
      });

      return employeDeleted;
    });

    return { 
      success: true, 
      message: "Employé et toutes ses données supprimés avec succès",
      data: result
    };

  } catch (error) {
    console.error("Erreur suppression employé :", error);
    
    if (error.message === 'Employé non trouvé') {
      throw new Error('Employé non trouvé');
    }
    
    if (error.code === "P2003") {
      throw new Error(
        "Impossible de supprimer cet employé. Vérifiez les relations dans la base de données."
      );
    }
    
    throw new Error("Erreur lors de la suppression de l'employé : " + error.message);
  }
};

// Alternative: Désactivation (soft delete)
export const softDeleteEmploye = async (id) => {
  const intId = Number(id);

  try {
    // Désactiver le contrat
    await prisma.contrat.updateMany({
      where: { employeId: intId },
      data: { statut: 'TERMINE' },
    });

    // Désactiver l'utilisateur associé
    const utilisateur = await prisma.utilisateur.findFirst({
      where: { employeId: intId }
    });

    if (utilisateur) {
      await prisma.utilisateur.update({
        where: { id: utilisateur.id },
        data: { statut: 'BLOQUE' },
      });
    }

    return { 
      success: true,
      message: 'Employé désactivé avec succès',
      employeId: intId
    };
  } catch (error) {
    console.error('Erreur désactivation employé :', error);
    throw new Error("Erreur lors de la désactivation : " + error.message);
  }
};

// Vérifier les dépendances avant suppression
export const checkEmployeDependencies = async (id) => {
  const intId = Number(id);

  try {
    const employe = await prisma.employe.findUnique({
      where: { id: intId },
      include: {
        _count: {
          select: {
            absences: true,
            presences: true,
            paiements: true,
            conges: true,
            performances: true,
          },
        },
        contrat: { select: { id: true } },
        utilisateur: { select: { id: true } },
      },
    });

    if (!employe) {
      throw new Error('Employé non trouvé');
    }

    const totalDependencies = 
      (employe._count.absences || 0) +
      (employe._count.presences || 0) +
      (employe._count.paiements || 0) +
      (employe._count.conges || 0) +
      (employe._count.performances || 0) +
      (employe.contrat ? 1 : 0) +
      (employe.utilisateur ? 1 : 0);

    return {
      canDelete: true,
      totalDependencies,
      details: {
        absences: employe._count.absences,
        presences: employe._count.presences,
        paiements: employe._count.paiements,
        conges: employe._count.conges,
        performances: employe._count.performances,
        contrat: employe.contrat ? 1 : 0,
        utilisateur: employe.utilisateur ? 1 : 0,
      },
      warning: totalDependencies > 0 
        ? `Cet employé a ${totalDependencies} enregistrement(s) lié(s) qui seront supprimés.`
        : null,
    };
  } catch (error) {
    console.error('Erreur vérification dépendances :', error);
    throw error;
  }
};

// Récupérer tous les départements
export const getAllDepartements = async () => {
  return await prisma.departement.findMany({
    orderBy: { nom_departement: 'asc' },
  });
};

// Récupérer tous les postes
export const getAllPostes = async () => {
  return await prisma.poste.findMany({
    orderBy: { intitule: 'asc' },
  });
};