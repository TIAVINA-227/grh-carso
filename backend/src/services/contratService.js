// backend/src/services/contratService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createContrat = async (data) => {
  const employeId = Number(data.employeId);

  // Vérifier que l'ID employé est valide
  if (!employeId || isNaN(employeId)) {
    throw new Error("L'ID de l'employé est invalide ou manquant.");
  }

  // Vérifier si l'employé existe
  const employe = await prisma.employe.findUnique({ where: { id: employeId } });
  if (!employe) {
    throw new Error("L'employé spécifié n'existe pas.");
  }

  // Vérifier s’il a déjà un contrat (si employeId est unique)
  const existingContrat = await prisma.contrat.findUnique({ where: { employeId } });
  if (existingContrat) {
    throw new Error("Cet employé possède déjà un contrat.");
  }

  // Créer le contrat
  return await prisma.contrat.create({
    data: {
      type_contrat: data.type_contrat,
      date_debut: data.date_debut ? new Date(data.date_debut) : undefined,
      date_fin: data.date_fin ? new Date(data.date_fin) : undefined,
      salaire_base: data.salaire_base ? Number(data.salaire_base) : undefined,
      statut: data.statut || 'ACTIF',
      employeId,
    },
  });
};

export const getAllContrats = async () => {
  return await prisma.contrat.findMany({
    include: { employe: true }, // tu peux afficher aussi les infos de l'employé
    orderBy: { id: 'desc' },
  });
};

export const getContratById = async (id) => {
  return await prisma.contrat.findUnique({
    where: { id: Number(id) },
    include: { employe: true },
  });
};

export const updateContrat = async (id, data) => {
  return await prisma.contrat.update({
    where: { id: Number(id) },
    data: {
      type_contrat: data.type_contrat,
      date_debut: data.date_debut ? new Date(data.date_debut) : undefined,
      date_fin: data.date_fin ? new Date(data.date_fin) : undefined,
      salaire_base: data.salaire_base ? Number(data.salaire_base) : undefined,
      statut: data.statut || 'ACTIF',
    },
  });
};

export const deleteContrat = async (id) => {
  await prisma.contrat.delete({ where: { id: Number(id) } });
  return { success: true };
};
