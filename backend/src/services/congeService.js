import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createConge = async (data) => {
  const payload = {
    type_conge: data.type_conge || null,
    date_debut: data.date_debut ? new Date(data.date_debut) : undefined,
    date_fin: data.date_fin ? new Date(data.date_fin) : undefined,
    statut: data.statut || undefined,
    utilisateurId: data.utilisateurId ? Number(data.utilisateurId) : undefined,
    employeId: data.employeId ? Number(data.employeId) : undefined,
  };
  return await prisma.conge.create({ data: payload });
};

export const getAllConges = async () => await prisma.conge.findMany({ orderBy: { id: 'desc' } });
export const getCongeById = async (id) => await prisma.conge.findUnique({ where: { id: Number(id) } });
export const updateConge = async (id, data) => await prisma.conge.update({ where: { id: Number(id) }, data });
export const deleteConge = async (id) => { await prisma.conge.delete({ where: { id: Number(id) } }); return { success: true }; };
