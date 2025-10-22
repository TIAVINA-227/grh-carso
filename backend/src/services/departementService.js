import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createDepartement = async (data) => {
  const payload = { nom_departement: data.nom_departement, responsable: data.responsable || null };
  return await prisma.departement.create({ data: payload });
};

export const getAllDepartements = async () => {
  return await prisma.departement.findMany({ orderBy: { id: 'desc' } });
};

export const getDepartementById = async (id) => {
  const intId = Number(id);
  return await prisma.departement.findUnique({ where: { id: intId } });
};

export const updateDepartement = async (id, data) => {
  const intId = Number(id);
  return await prisma.departement.update({ where: { id: intId }, data });
};

export const deleteDepartement = async (id) => {
  const intId = Number(id);
  await prisma.departement.delete({ where: { id: intId } });
  return { success: true };
};
