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
import { 
  calculerJoursOuvres, 
  calculerJoursCalendaires,
  getDebutAnneeCivile, 
  getFinAnneeCivile 
} from '../utils/dateUtils.js';

const prisma = new PrismaClient();
const formatDateRangeFr = (dateDebut, dateFin) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const debut = new Date(dateDebut).toLocaleDateString('fr-FR', options);
  const fin = new Date(dateFin).toLocaleDateString('fr-FR', options);
  return debut === fin ? debut : `${debut} ➝ ${fin}`;
};

/**
 * 🔄 Récupérer les jours non pris de l'année précédente (pour le report)
 * @param {number} employeId - ID de l'employé
 * @param {number} anneePrecedente - Année précédente
 * @returns {Promise<number>} Nombre de jours non pris (max 6 reportables)
 */
export const getJoursNonPrisAnneePrecedente = async (employeId, anneePrecedente) => {
  // Récupérer l'employé pour sa date d'embauche
  const employe = await prisma.employe.findUnique({
    where: { id: Number(employeId) }
  });
  
  if (!employe) {
    return 0;
  }
  
  const debutAnneePrec = getDebutAnneeCivile(anneePrecedente);
  const finAnneePrec = getFinAnneeCivile(anneePrecedente);
  
  // Si l'employé n'était pas encore embauché, pas de report
  if (new Date(employe.date_embauche) > finAnneePrec) {
    return 0;
  }
  
  // Calculer le solde de l'année précédente
  const soldeAnneePrec = calculateSoldeConges(employe.date_embauche, debutAnneePrec);
  
  // Récupérer les congés pris l'année précédente
  const congesPrisAnneePrec = await prisma.conge.findMany({
    where: {
      employeId: Number(employeId),
      statut: "APPROUVE",
      type_conge: "Congé annuel",
      date_debut: { gte: debutAnneePrec },
      date_fin: { lte: finAnneePrec }
    }
  });
  
  const joursUtilisesAnneePrec = congesPrisAnneePrec.reduce((total, c) => {
    return total + (c.duree_jours || calculerJoursCalendaires(c.date_debut, c.date_fin));
  }, 0);
  
  const joursNonPris = Math.max(0, soldeAnneePrec - joursUtilisesAnneePrec);
  
  // Limiter à 6 jours maximum reportables
  return Math.min(joursNonPris, CONGES_RULES["Congé annuel"].maxReport);
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
    
    // ✅ Utiliser jours calendaires (la plupart des entreprises comptent ainsi)
    // Pour un comptage en jours ouvrés uniquement, décommenter la ligne suivante
    const dureeJours = calculerJoursCalendaires(dateDebut, dateFin);
    // const dureeJours = calculerJoursOuvres(dateDebut, dateFin); // Alternative: jours ouvrés

    // 4️⃣ Récupérer tous les congés approuvés de l'année civile en cours
    const anneeActuelle = new Date().getFullYear();
    const debutAnnee = getDebutAnneeCivile(anneeActuelle);
    const finAnnee = getFinAnneeCivile(anneeActuelle);
    
    const congesPrisAnnee = await prisma.conge.findMany({
      where: {
        employeId: Number(data.employeId),
        statut: "APPROUVE",
        date_debut: { gte: debutAnnee },
        date_fin: { lte: finAnnee }
      }
    });

    // 5️⃣ Calculer le solde de congés annuels (année civile) avec report
    const soldeAnneeCourante = calculateSoldeConges(employe.date_embauche, debutAnnee);
    
    // ✅ Ajouter le report des jours non pris de l'année précédente (max 6 jours)
    const joursNonPrisAnneePrecedente = await getJoursNonPrisAnneePrecedente(data.employeId, anneeActuelle - 1);
    const soldeTotal = soldeAnneeCourante + joursNonPrisAnneePrecedente;
    
    const congesAnnuelsPris = congesPrisAnnee
      .filter(c => c.type_conge === "Congé annuel")
      .reduce((total, c) => {
        return total + (c.duree_jours || calculerJoursCalendaires(c.date_debut, c.date_fin));
      }, 0);
    
    const soldeRestant = soldeTotal - congesAnnuelsPris;

    // 6️⃣ Calculer les jours déjà pris pour ce type de congé (pour les limites annuelles)
    const joursPrisType = congesPrisAnnee
      .filter(c => c.type_conge === data.type_conge)
      .reduce((total, c) => {
        return total + (c.duree_jours || calculerJoursCalendaires(c.date_debut, c.date_fin));
      }, 0);

    // 7️⃣ Valider le congé selon les règles
    const validation = validateConge(
      data.type_conge, 
      dureeJours, 
      soldeRestant, 
      congesPrisAnnee,
      joursPrisType
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

    // ✅ Recalculer la durée si les dates changent (utiliser la fonction de calcul)
    if (updateData.date_debut && updateData.date_fin) {
      updateData.duree_jours = calculerJoursCalendaires(
        updateData.date_debut, 
        updateData.date_fin
      );
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
 * Période de référence : Année civile (1er janvier - 31 décembre)
 */
export const getSoldeConges = async (employeId) => {
  const employe = await prisma.employe.findUnique({
    where: { id: Number(employeId) }
  });
  
  if (!employe) {
    throw new Error("Employé introuvable");
  }
  
  const anneeActuelle = new Date().getFullYear();
  const debutAnnee = getDebutAnneeCivile(anneeActuelle);
  const finAnnee = getFinAnneeCivile(anneeActuelle);
  
  // ✅ Calculer le solde avec la méthode corrigée (année civile)
  const soldeTotal = calculateSoldeConges(employe.date_embauche, debutAnnee);
  
  // ✅ Ajouter le report des jours non pris de l'année précédente (max 6 jours)
  const anneePrecedente = anneeActuelle - 1;
  const joursNonPrisAnneePrecedente = await getJoursNonPrisAnneePrecedente(employeId, anneePrecedente);
  const soldeTotalAvecReport = soldeTotal + joursNonPrisAnneePrecedente;
  
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
    return total + (c.duree_jours || calculerJoursCalendaires(c.date_debut, c.date_fin));
  }, 0);
  
  const soldeRestant = soldeTotalAvecReport - joursUtilises;
  
  // ✅ Calculer les jours non pris qui peuvent être reportés l'année suivante (max 6)
  const joursNonPris = Math.max(0, soldeRestant);
  const joursReportables = Math.min(joursNonPris, CONGES_RULES["Congé annuel"].maxReport);
  
  return {
    soldeTotal: soldeTotalAvecReport,
    soldeAnneeCourante: soldeTotal,
    joursReportes: joursNonPrisAnneePrecedente,
    joursUtilises,
    soldeRestant: Math.max(0, soldeRestant),
    joursNonPris,
    joursReportables,
    congesPris
  };
};