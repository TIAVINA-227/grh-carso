// src/services/employeService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ajouter un employé (Prisma)
export const createEmploye = async (data) => {
  // Map input fields to prisma schema fields
  const payload = {
    matricule: data.matricule || `EMP${Date.now()}`,
    nom: data.nom,
    prenom: data.prenom,
    date_naissance: data.date_naissance ? new Date(data.date_naissance) : undefined,
    adresse: data.adresse,
    email: data.email,
    telephone: data.telephone,
    date_embauche: data.date_embauche ? new Date(data.date_embauche) : undefined,
  };

  return await prisma.employe.create({ data: payload });
};

// Récupérer tous les employés
export const getAllEmployes = async () => {
  return await prisma.employe.findMany({ orderBy: { id: 'desc' } });
};

// Récupérer un employé par ID
export const getEmployeById = async (id) => {
  const intId = Number(id);
  return await prisma.employe.findUnique({ where: { id: intId } });
};

// Mettre à jour un employé
export const updateEmploye = async (id, data) => {
  const intId = Number(id);
  return await prisma.employe.update({ where: { id: intId }, data });
};

// Supprimer un employé
export const deleteEmploye = async (id) => {
  const intId = Number(id);
  await prisma.employe.delete({ where: { id: intId } });
  return { success: true };
};
