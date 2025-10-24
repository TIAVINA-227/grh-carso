// backend/src/services/employeService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ajouter un employé
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
      contrat: true
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

// ✅ Supprimer un employé proprement
export const deleteEmploye = async (id) => {
  const intId = Number(id);

  try {
    // Supprimer toutes les dépendances
    await prisma.contrat.deleteMany({ where: { employeId: intId } });
    // TODO: ajouter les autres dépendances si nécessaire
    // await prisma.tache.deleteMany({ where: { employeId: intId } });

    // Supprimer l'employé
    await prisma.employe.delete({ where: { id: intId } });

    return { success: true, message: "Employé supprimé avec succès" };
  } catch (error) {
    console.error("Erreur suppression employé :", error);
    if (error.code === "P2003") {
      throw new Error(
        "Impossible de supprimer cet employé car il est utilisé dans d'autres tables."
      );
    }
    throw new Error("Erreur lors de la suppression de l'employé : " + error.message);
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
