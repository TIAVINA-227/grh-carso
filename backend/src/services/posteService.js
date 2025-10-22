// src/services/posteService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPoste = async (data) => {
  const payload = {
    intitule: data.intitule,
    description: data.description || null,
    niveau: data.niveau || null,
  };
  return await prisma.poste.create({ data: payload });
};

export const getAllPostes = async () => {
  return await prisma.poste.findMany({ orderBy: { id: 'desc' } });
};

export const getPosteById = async (id) => {
  const intId = Number(id);
  return await prisma.poste.findUnique({ where: { id: intId } });
};

export const updatePoste = async (id, data) => {
  const intId = Number(id);
  return await prisma.poste.update({ where: { id: intId }, data });
};

export const deletePoste = async (id) => {
  const intId = Number(id);
  await prisma.poste.delete({ where: { id: intId } });
  return { success: true };
};

export default { getAllPostes };
