// backend/src/services/congeService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Créer un congé
export const createConge = async (data) => {
  try {
    // Vérifier que l'utilisateur existe
    if (data.utilisateurId) {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: Number(data.utilisateurId) }
      });
      
      if (!utilisateur) {
        throw new Error(`Utilisateur avec l'ID ${data.utilisateurId} n'existe pas`);
      }
    }

    // Vérifier que l'employé existe (si fourni)
    if (data.employeId) {
      const employe = await prisma.employe.findUnique({
        where: { id: Number(data.employeId) }
      });
      
      if (!employe) {
        throw new Error(`Employé avec l'ID ${data.employeId} n'existe pas`);
      }
    }

    const conge = await prisma.conge.create({
      data: {
        type: data.type,
        date_debut: new Date(data.date_debut),
        date_fin: new Date(data.date_fin),
        motif: data.motif || null,
        statut: data.statut || 'EN_ATTENTE',
        utilisateurId: data.utilisateurId ? Number(data.utilisateurId) : null,
        employeId: data.employeId ? Number(data.employeId) : null,
      },
      include: {
        utilisateur: true,
        employe: true
      }
    });

    return conge;
  } catch (error) {
    console.error('❌ Erreur createConge:', error);
    throw error;
  }
};

// ✅ Mettre à jour un congé
export const updateConge = async (id, data) => {
  try {
    // Vérifier que le congé existe
    const congeExistant = await prisma.conge.findUnique({
      where: { id: Number(id) }
    });

    if (!congeExistant) {
      throw new Error(`Congé avec l'ID ${id} n'existe pas`);
    }

    // Préparer les données à mettre à jour
    const updateData = {};

    if (data.type !== undefined) updateData.type = data.type;
    if (data.date_debut !== undefined) updateData.date_debut = new Date(data.date_debut);
    if (data.date_fin !== undefined) updateData.date_fin = new Date(data.date_fin);
    if (data.motif !== undefined) updateData.motif = data.motif;
    if (data.statut !== undefined) updateData.statut = data.statut;

    // ✅ Vérifier les clés étrangères avant mise à jour
    if (data.utilisateurId !== undefined) {
      if (data.utilisateurId === null) {
        updateData.utilisateurId = null;
      } else {
        const utilisateur = await prisma.utilisateur.findUnique({
          where: { id: Number(data.utilisateurId) }
        });
        
        if (!utilisateur) {
          throw new Error(`Utilisateur avec l'ID ${data.utilisateurId} n'existe pas`);
        }
        updateData.utilisateurId = Number(data.utilisateurId);
      }
    }

    if (data.employeId !== undefined) {
      if (data.employeId === null) {
        updateData.employeId = null;
      } else {
        const employe = await prisma.employe.findUnique({
          where: { id: Number(data.employeId) }
        });
        
        if (!employe) {
          throw new Error(`Employé avec l'ID ${data.employeId} n'existe pas`);
        }
        updateData.employeId = Number(data.employeId);
      }
    }

    const conge = await prisma.conge.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        utilisateur: true,
        employe: true
      }
    });

    return conge;
  } catch (error) {
    console.error('❌ Erreur updateConge:', error);
    throw error;
  }
};

// ✅ Supprimer un congé
export const deleteConge = async (id) => {
  try {
    await prisma.conge.delete({
      where: { id: Number(id) }
    });
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur deleteConge:', error);
    throw error;
  }
};

// ✅ Récupérer tous les congés
export const getAllConges = async () => {
  try {
    return await prisma.conge.findMany({
      include: {
        utilisateur: true,
        employe: true
      },
      orderBy: { date_debut: 'desc' }
    });
  } catch (error) {
    console.error('❌ Erreur getAllConges:', error);
    throw error;
  }
};

// ✅ Récupérer un congé par ID
export const getCongeById = async (id) => {
  try {
    return await prisma.conge.findUnique({
      where: { id: Number(id) },
      include: {
        utilisateur: true,
        employe: true
      }
    });
  } catch (error) {
    console.error('❌ Erreur getCongeById:', error);
    throw error;
  }
};

// ✅ Récupérer les congés d'un utilisateur
export const getCongesByUtilisateur = async (utilisateurId) => {
  try {
    return await prisma.conge.findMany({
      where: { utilisateurId: Number(utilisateurId) },
      include: {
        utilisateur: true,
        employe: true
      },
      orderBy: { date_debut: 'desc' }
    });
  } catch (error) {
    console.error('❌ Erreur getCongesByUtilisateur:', error);
    throw error;
  }
};

// ✅ Approuver un congé
export const approuverConge = async (id, approbateurId) => {
  try {
    return await prisma.conge.update({
      where: { id: Number(id) },
      data: {
        statut: 'APPROUVE',
        // Si vous avez un champ approbateur dans votre schéma
        // approbateurId: Number(approbateurId)
      },
      include: {
        utilisateur: true,
        employe: true
      }
    });
  } catch (error) {
    console.error('❌ Erreur approuverConge:', error);
    throw error;
  }
};

// ✅ Rejeter un congé
export const rejeterConge = async (id, motifRejet) => {
  try {
    return await prisma.conge.update({
      where: { id: Number(id) },
      data: {
        statut: 'REFUSE',
        motif: motifRejet || null
      },
      include: {
        utilisateur: true,
        employe: true
      }
    });
  } catch (error) {
    console.error('❌ Erreur rejeterConge:', error);
    throw error;
  }
};