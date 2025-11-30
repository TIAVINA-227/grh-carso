// // backend/src/services/congeService.js
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// /**
//  * ➕ Créer un congé
//  */
// export const createConge = async (data) => {
//   try {
//     console.log('📝 Création congé avec données:', data);

//     // Vérifier que l'utilisateur existe
//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { id: Number(data.utilisateurId) }
//     });
    
//     if (!utilisateur) {
//       throw new Error(`Utilisateur avec l'ID ${data.utilisateurId} n'existe pas`);
//     }

//     // Vérifier que l'employé existe
//     const employe = await prisma.employe.findUnique({
//       where: { id: Number(data.employeId) }
//     });
    
//     if (!employe) {
//       throw new Error(`Employé avec l'ID ${data.employeId} n'existe pas`);
//     }

//     // Créer le congé
//     const conge = await prisma.conge.create({
//       data: {
//         type_conge: data.type_conge || 'Congé annuel',
//         date_debut: new Date(data.date_debut),
//         date_fin: new Date(data.date_fin),
//         motif: data.motif || null,
//         statut: data.statut || 'SOUMIS',
//         utilisateurId: Number(data.utilisateurId),
//         employeId: Number(data.employeId)
//       },
//       include: {
//         utilisateur: {
//           select: {
//             id: true,
//             email: true,
//             nom_utilisateur: true,
//             prenom_utilisateur: true
//           }
//         },
//         employe: {
//           select: {
//             id: true,
//             nom: true,
//             prenom: true,
//             matricule: true
//           }
//         }
//       }
//     });

//     console.log('✅ Congé créé:', conge.id);
//     return conge;

//   } catch (error) {
//     console.error('❌ Erreur createConge:', error.message);
//     throw error;
//   }
// };

// /**
//  * 📋 Récupérer tous les congés
//  */
// export const getAllConges = async () => {
//   try {
//     const conges = await prisma.conge.findMany({
//       include: {
//         utilisateur: {
//           select: {
//             id: true,
//             email: true,
//             nom_utilisateur: true,
//             prenom_utilisateur: true
//           }
//         },
//         employe: {
//           select: {
//             id: true,
//             nom: true,
//             prenom: true,
//             matricule: true
//           }
//         }
//       },
//       orderBy: {
//         date_debut: 'desc'
//       }
//     });

//     return conges;
//   } catch (error) {
//     console.error('❌ Erreur getAllConges:', error.message);
//     throw error;
//   }
// };

// /**
//  * 🔍 Récupérer un congé par ID
//  */
// export const getCongeById = async (id) => {
//   try {
//     const conge = await prisma.conge.findUnique({
//       where: { id: Number(id) },
//       include: {
//         utilisateur: {
//           select: {
//             id: true,
//             email: true,
//             nom_utilisateur: true,
//             prenom_utilisateur: true
//           }
//         },
//         employe: {
//           select: {
//             id: true,
//             nom: true,
//             prenom: true,
//             matricule: true
//           }
//         }
//       }
//     });

//     return conge;
//   } catch (error) {
//     console.error('❌ Erreur getCongeById:', error.message);
//     throw error;
//   }
// };

// /**
//  * ✏️ Mettre à jour un congé
//  */
// export const updateConge = async (id, data) => {
//   try {
//     console.log('📝 Mise à jour congé ID:', id, 'avec:', data);

//     // Vérifier que le congé existe
//     const congeExiste = await prisma.conge.findUnique({
//       where: { id: Number(id) }
//     });

//     if (!congeExiste) {
//       throw new Error(`Congé avec l'ID ${id} n'existe pas`);
//     }

//     // Préparer les données de mise à jour
//     const updateData = {};
    
//     if (data.type_conge !== undefined) updateData.type_conge = data.type_conge;
//     if (data.date_debut !== undefined) updateData.date_debut = new Date(data.date_debut);
//     if (data.date_fin !== undefined) updateData.date_fin = new Date(data.date_fin);
//     if (data.motif !== undefined) updateData.motif = data.motif;
//     if (data.statut !== undefined) updateData.statut = data.statut;
//     if (data.employeId !== undefined) updateData.employeId = Number(data.employeId);

//     // Mettre à jour
//     const conge = await prisma.conge.update({
//       where: { id: Number(id) },
//       data: updateData,
//       include: {
//         utilisateur: {
//           select: {
//             id: true,
//             email: true,
//             nom_utilisateur: true,
//             prenom_utilisateur: true
//           }
//         },
//         employe: {
//           select: {
//             id: true,
//             nom: true,
//             prenom: true,
//             matricule: true
//           }
//         }
//       }
//     });

//     console.log('✅ Congé mis à jour:', conge.id);
//     return conge;

//   } catch (error) {
//     console.error('❌ Erreur updateConge:', error.message);
//     throw error;
//   }
// };

// /**
//  * ❌ Supprimer un congé
//  */
// export const deleteConge = async (id) => {
//   try {
//     console.log('🗑️ Suppression congé ID:', id);

//     // Vérifier que le congé existe
//     const congeExiste = await prisma.conge.findUnique({
//       where: { id: Number(id) }
//     });

//     if (!congeExiste) {
//       throw new Error(`Congé avec l'ID ${id} n'existe pas`);
//     }

//     // Supprimer
//     await prisma.conge.delete({
//       where: { id: Number(id) }
//     });

//     console.log('✅ Congé supprimé');
//     return { success: true, message: 'Congé supprimé avec succès' };

//   } catch (error) {
//     console.error('❌ Erreur deleteConge:', error.message);
//     throw error;
//   }
// };
// backend/src/services/congeService.js
import { PrismaClient } from "@prisma/client";
import { CONGES_RULES, calculateSoldeConges, validateConge } from '../config/congesRules.js';
import { createNotificationsForRoles, notifyEmployeeCongeDecision } from "./notificationService.js";

const prisma = new PrismaClient();
const formatDateRangeFr = (dateDebut, dateFin) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const debut = new Date(dateDebut).toLocaleDateString('fr-FR', options);
  const fin = new Date(dateFin).toLocaleDateString('fr-FR', options);
  return debut === fin ? debut : `${debut} ➝ ${fin}`;
};

/**
 * ➕ Créer un congé avec validation des règles
 */
export const createConge = async (data) => {
  try {
    console.log('📝 Création congé avec données:', data);

    // 1️⃣ Vérifier que l'utilisateur existe
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: Number(data.utilisateurId) }
    });
    
    if (!utilisateur) {
      throw new Error(`Utilisateur avec l'ID ${data.utilisateurId} n'existe pas`);
    }

    // 2️⃣ Vérifier que l'employé existe et récupérer sa date d'embauche
    const employe = await prisma.employe.findUnique({
      where: { id: Number(data.employeId) }
    });
    
    if (!employe) {
      throw new Error(`Employé avec l'ID ${data.employeId} n'existe pas`);
    }

    // 3️⃣ Calculer la durée du congé demandé
    const dateDebut = new Date(data.date_debut);
    const dateFin = new Date(data.date_fin);
    const dureeJours = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;

    // 4️⃣ Récupérer tous les congés approuvés de l'année en cours
    const anneeActuelle = new Date().getFullYear();
    const debutAnnee = new Date(anneeActuelle, 0, 1);
    const finAnnee = new Date(anneeActuelle, 11, 31, 23, 59, 59);
    
    const congesPrisAnnee = await prisma.conge.findMany({
      where: {
        employeId: Number(data.employeId),
        statut: "APPROUVE",
        date_debut: { gte: debutAnnee },
        date_fin: { lte: finAnnee }
      }
    });

    // 5️⃣ Calculer le solde de congés annuels
    const soldeTotal = calculateSoldeConges(employe.date_embauche);
    const congesAnnuelsPris = congesPrisAnnee
      .filter(c => c.type_conge === "Congé annuel")
      .reduce((total, c) => {
        const debut = new Date(c.date_debut);
        const fin = new Date(c.date_fin);
        return total + Math.ceil((fin - debut) / (1000 * 60 * 60 * 24)) + 1;
      }, 0);
    
    const soldeRestant = soldeTotal - congesAnnuelsPris;

    // 6️⃣ Valider le congé selon les règles
    const validation = validateConge(
      data.type_conge, 
      dureeJours, 
      soldeRestant, 
      congesPrisAnnee
    );
    
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // 7️⃣ Vérifier les chevauchements de dates
    const chevauchement = await prisma.conge.findFirst({
      where: {
        employeId: Number(data.employeId),
        statut: { in: ["SOUMIS", "APPROUVE"] },
        OR: [
          {
            AND: [
              { date_debut: { lte: dateFin } },
              { date_fin: { gte: dateDebut } }
            ]
          }
        ]
      }
    });
    
    if (chevauchement) {
      throw new Error("Vous avez déjà un congé prévu sur cette période");
    }

    // 8️⃣ Créer le congé
    const conge = await prisma.conge.create({
      data: {
        type_conge: data.type_conge || 'Congé annuel',
        date_debut: dateDebut,
        date_fin: dateFin,
        motif: data.motif || null,
        statut: data.statut || 'SOUMIS',
        duree_jours: dureeJours,
        utilisateurId: Number(data.utilisateurId),
        employeId: Number(data.employeId)
      },
      include: {
        utilisateur: {
          select: {
            id: true,
            email: true,
            nom_utilisateur: true,
            prenom_utilisateur: true
          }
        },
        employe: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            matricule: true,
            date_embauche: true
          }
        }
      }
    });

    console.log(`✅ Congé créé | Solde restant: ${soldeRestant - dureeJours}/${soldeTotal} jours`);

    try {
      const employe = conge.employe;
      const nomEmploye = `${employe?.prenom || ""} ${employe?.nom || ""}`.trim() || "Un collaborateur";
      await createNotificationsForRoles({
        roles: ["ADMIN", "SUPER_ADMIN"],
        titre: "Nouvelle demande de congé",
        message: `${nomEmploye} a soumis un congé (${conge.type_conge}) pour ${formatDateRangeFr(conge.date_debut, conge.date_fin)}.`,
        type: "warning",
        categorie: "conge",
        metadata: { entity: "conge", entityId: conge.id, statut: conge.statut },
      });
    } catch (notificationError) {
      console.error("⚠️ Notification création congé échouée:", notificationError);
    }

    return conge;

  } catch (error) {
    console.error('❌ Erreur createConge:', error.message);
    throw error;
  }
};

/**
 * 📋 Récupérer tous les congés
 */
export const getAllConges = async () => {
  try {
    const conges = await prisma.conge.findMany({
      include: {
        utilisateur: {
          select: {
            id: true,
            email: true,
            nom_utilisateur: true,
            prenom_utilisateur: true
          }
        },
        employe: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            matricule: true,
            date_embauche: true
          }
        }
      },
      orderBy: {
        date_debut: 'desc'
      }
    });

    return conges;
  } catch (error) {
    console.error('❌ Erreur getAllConges:', error.message);
    throw error;
  }
};

/**
 * 🔍 Récupérer un congé par ID
 */
export const getCongeById = async (id) => {
  try {
    const conge = await prisma.conge.findUnique({
      where: { id: Number(id) },
      include: {
        utilisateur: {
          select: {
            id: true,
            email: true,
            nom_utilisateur: true,
            prenom_utilisateur: true
          }
        },
        employe: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            matricule: true,
            date_embauche: true
          }
        }
      }
    });

    return conge;
  } catch (error) {
    console.error('❌ Erreur getCongeById:', error.message);
    throw error;
  }
};

/**
 * ✏️ Mettre à jour un congé
 */
export const updateConge = async (id, data) => {
  try {
    console.log('📝 Mise à jour congé ID:', id, 'avec:', data);

    const congeExiste = await prisma.conge.findUnique({
      where: { id: Number(id) },
      include: { employe: true }
    });

    if (!congeExiste) {
      throw new Error(`Congé avec l'ID ${id} n'existe pas`);
    }

    const updateData = {};
    
    if (data.type_conge !== undefined) updateData.type_conge = data.type_conge;
    if (data.date_debut !== undefined) updateData.date_debut = new Date(data.date_debut);
    if (data.date_fin !== undefined) updateData.date_fin = new Date(data.date_fin);
    if (data.motif !== undefined) updateData.motif = data.motif;
    if (data.statut !== undefined) updateData.statut = data.statut;
    if (data.employeId !== undefined) updateData.employeId = Number(data.employeId);

    // Recalculer la durée si les dates changent
    if (updateData.date_debut && updateData.date_fin) {
      updateData.duree_jours = Math.ceil(
        (updateData.date_fin - updateData.date_debut) / (1000 * 60 * 60 * 24)
      ) + 1;
    }

    const conge = await prisma.conge.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        utilisateur: {
          select: {
            id: true,
            email: true,
            nom_utilisateur: true,
            prenom_utilisateur: true
          }
        },
        employe: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            matricule: true,
            date_embauche: true
          }
        }
      }
    });

    console.log('✅ Congé mis à jour:', conge.id);

    if (data.statut && data.statut !== congeExiste.statut) {
      try {
        await notifyEmployeeCongeDecision({ conge, statut: data.statut });
      } catch (notificationError) {
        console.error("⚠️ Notification décision congé échouée:", notificationError);
      }
    }

    return conge;

  } catch (error) {
    console.error('❌ Erreur updateConge:', error.message);
    throw error;
  }
};

/**
 * ❌ Supprimer un congé
 */
export const deleteConge = async (id) => {
  try {
    console.log('🗑️ Suppression congé ID:', id);

    const congeExiste = await prisma.conge.findUnique({
      where: { id: Number(id) }
    });

    if (!congeExiste) {
      throw new Error(`Congé avec l'ID ${id} n'existe pas`);
    }

    await prisma.conge.delete({
      where: { id: Number(id) }
    });

    console.log('✅ Congé supprimé');
    return { success: true, message: 'Congé supprimé avec succès' };

  } catch (error) {
    console.error('❌ Erreur deleteConge:', error.message);
    throw error;
  }
};

/**
 * 🗑️ Supprimer automatiquement les congés expirés
 */
export const deleteExpiredConges = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);
  
  const deleted = await prisma.conge.deleteMany({
    where: {
      date_fin: { lt: yesterday },
      statut: "APPROUVE"
    }
  });
  
  console.log(`🗑️ ${deleted.count} congé(s) expiré(s) supprimé(s)`);
  return deleted;
};

/**
 * 📊 Récupérer le solde de congés d'un employé
 */
export const getSoldeConges = async (employeId) => {
  const employe = await prisma.employe.findUnique({
    where: { id: Number(employeId) }
  });
  
  if (!employe) {
    throw new Error("Employé introuvable");
  }
  
  const soldeTotal = calculateSoldeConges(employe.date_embauche);
  
  const anneeActuelle = new Date().getFullYear();
  const debutAnnee = new Date(anneeActuelle, 0, 1);
  const finAnnee = new Date(anneeActuelle, 11, 31, 23, 59, 59);
  
  const congesPris = await prisma.conge.findMany({
    where: {
      employeId: Number(employeId),
      statut: "APPROUVE",
      type_conge: "Congé annuel",
      date_debut: { gte: debutAnnee },
      date_fin: { lte: finAnnee }
    }
  });
  
  const joursUtilises = congesPris.reduce((total, c) => {
    return total + (c.duree_jours || 0);
  }, 0);
  
  return {
    soldeTotal,
    joursUtilises,
    soldeRestant: soldeTotal - joursUtilises,
    congesPris
  };
};