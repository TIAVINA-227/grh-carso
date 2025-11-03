// backend/src/services/congeService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Créer un congé
export const createConge = async (data) => {
  const { utilisateurId, employeId } = data;

  if (!utilisateurId) {
    throw new Error("⚠️ L'identifiant de l'utilisateur est manquant !");
  }

  if (!employeId) {
    throw new Error("⚠️ L'identifiant de l'employé est manquant !");
  }

  const utilisateurExiste = await prisma.utilisateur.findUnique({
    where: { id: Number(utilisateurId) },
  });

  const employeExiste = await prisma.employe.findUnique({
    where: { id: Number(employeId) },
  });

  if (!utilisateurExiste)
    throw new Error(`❌ Aucun utilisateur avec id=${utilisateurId}`);
  if (!employeExiste)
    throw new Error(`❌ Aucun employé avec id=${employeId}`);

  return await prisma.conge.create({
    data: {
      type_conge: data.type_conge || null,
      date_debut: new Date(data.date_debut),
      date_fin: new Date(data.date_fin),
      statut: data.statut || "SOUMIS",
      utilisateurId: Number(utilisateurId),
      employeId: Number(employeId),
    },
  });
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