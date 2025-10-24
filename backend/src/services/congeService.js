// // backend/src/services/congeService.js
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export const createConge = async (data) => {
//   const payload = {
//     type_conge: data.type_conge || null,
//     date_debut: data.date_debut ? new Date(data.date_debut) : undefined,
//     date_fin: data.date_fin ? new Date(data.date_fin) : undefined,
//     statut: data.statut || undefined,
//     utilisateurId: data.utilisateurId ? Number(data.utilisateurId) : undefined,
//     employeId: data.employeId ? Number(data.employeId) : undefined,
//   };
//   return await prisma.conge.create({ data: payload });
// };

// export const getAllConges = async () => await prisma.conge.findMany({ orderBy: { id: 'desc' } });
// export const getCongeById = async (id) => await prisma.conge.findUnique({ where: { id: Number(id) } });
// export const updateConge = async (id, data) => await prisma.conge.update({ where: { id: Number(id) }, data });
// export const deleteConge = async (id) => { await prisma.conge.delete({ where: { id: Number(id) } }); return { success: true }; };
// backend/src/services/congeService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Créer un congé
export const createConge = async (data) => {
  // Vérification obligatoire des champs requis
  if (!data.utilisateurId) {
    throw new Error("L'identifiant de l'utilisateur (utilisateurId) est requis.");
  }
  if (!data.employeId) {
    throw new Error("L'identifiant de l'employé (employeId) est requis.");
  }
  if (!data.date_debut || !data.date_fin) {
    throw new Error("Les dates de début et de fin sont requises.");
  }

  const payload = {
    type_conge: data.type_conge || null,
    date_debut: new Date(data.date_debut),
    date_fin: new Date(data.date_fin),
    statut: data.statut || 'SOUMIS', // Valeur par défaut si non fournie
    utilisateurId: Number(data.utilisateurId),
    employeId: Number(data.employeId),
  };

  return await prisma.conge.create({ data: payload });
};

// Récupérer tous les congés
export const getAllConges = async () => {
  return await prisma.conge.findMany({
    orderBy: { id: 'desc' },
    include: {
      employe: true,
      utilisateur: true,
    },
  });
};

// Récupérer un congé par ID
export const getCongeById = async (id) => {
  return await prisma.conge.findUnique({
    where: { id: Number(id) },
    include: {
      employe: true,
      utilisateur: true,
    },
  });
};

// Mettre à jour un congé
export const updateConge = async (id, data) => {
  const updateData = { ...data };

  // Convertir les IDs et les dates si présentes
  if (updateData.utilisateurId) updateData.utilisateurId = Number(updateData.utilisateurId);
  if (updateData.employeId) updateData.employeId = Number(updateData.employeId);
  if (updateData.date_debut) updateData.date_debut = new Date(updateData.date_debut);
  if (updateData.date_fin) updateData.date_fin = new Date(updateData.date_fin);

  return await prisma.conge.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

// Supprimer un congé
export const deleteConge = async (id) => {
  await prisma.conge.delete({ where: { id: Number(id) } });
  return { success: true };
};
