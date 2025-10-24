import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Créer un département
export const createDepartement = async (data) => {
  const payload = {
    nom_departement: data.nom_departement,
    responsable: data.responsable || null,
  };
  return await prisma.departement.create({ data: payload });
};

// Récupérer tous les départements avec le nombre d'employés
export const getAllDepartements = async () => {
  return await prisma.departement.findMany({
    orderBy: { id: 'desc' },
    include: { employes: true }, // pour compter les employés
  });
};

// Récupérer un département par ID
export const getDepartementById = async (id) => {
  const intId = Number(id);
  return await prisma.departement.findUnique({
    where: { id: intId },
    include: { employes: true },
  });
};

// Mettre à jour un département
export const updateDepartement = async (id, data) => {
  const intId = Number(id);
  return await prisma.departement.update({
    where: { id: intId },
    data,
  });
};

// Supprimer un département
export const deleteDepartement = async (id) => {
  const intId = Number(id);
  await prisma.departement.delete({ where: { id: intId } });
  return { success: true };
};
