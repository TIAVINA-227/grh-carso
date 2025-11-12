// backend/src/services/congeService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ➕ Créer un congé
 */
export const createConge = async (data) => {
  try {
    console.log('📝 Création congé avec données:', data);

    // Vérifier que l'utilisateur existe
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: Number(data.utilisateurId) }
    });
    
    if (!utilisateur) {
      throw new Error(`Utilisateur avec l'ID ${data.utilisateurId} n'existe pas`);
    }

    // Vérifier que l'employé existe
    const employe = await prisma.employe.findUnique({
      where: { id: Number(data.employeId) }
    });
    
    if (!employe) {
      throw new Error(`Employé avec l'ID ${data.employeId} n'existe pas`);
    }

    // Créer le congé
    const conge = await prisma.conge.create({
      data: {
        type_conge: data.type_conge || 'Congé annuel',
        date_debut: new Date(data.date_debut),
        date_fin: new Date(data.date_fin),
        motif: data.motif || null,
        statut: data.statut || 'SOUMIS',
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
            matricule: true
          }
        }
      }
    });

    console.log('✅ Congé créé:', conge.id);
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
            matricule: true
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
            matricule: true
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

    // Vérifier que le congé existe
    const congeExiste = await prisma.conge.findUnique({
      where: { id: Number(id) }
    });

    if (!congeExiste) {
      throw new Error(`Congé avec l'ID ${id} n'existe pas`);
    }

    // Préparer les données de mise à jour
    const updateData = {};
    
    if (data.type_conge !== undefined) updateData.type_conge = data.type_conge;
    if (data.date_debut !== undefined) updateData.date_debut = new Date(data.date_debut);
    if (data.date_fin !== undefined) updateData.date_fin = new Date(data.date_fin);
    if (data.motif !== undefined) updateData.motif = data.motif;
    if (data.statut !== undefined) updateData.statut = data.statut;
    if (data.employeId !== undefined) updateData.employeId = Number(data.employeId);

    // Mettre à jour
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
            matricule: true
          }
        }
      }
    });

    console.log('✅ Congé mis à jour:', conge.id);
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

    // Vérifier que le congé existe
    const congeExiste = await prisma.conge.findUnique({
      where: { id: Number(id) }
    });

    if (!congeExiste) {
      throw new Error(`Congé avec l'ID ${id} n'existe pas`);
    }

    // Supprimer
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