import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createPerformance = async (data) => {
  const payload = {
    date_eval: data.date_eval ? new Date(data.date_eval) : undefined,
    note: data.note ? Number(data.note) : undefined,
    resultat: data.resultat || null,
    commentaires: data.commentaires || null,
    objectifs: data.objectifs || null,
    realisation: data.realisation || null,
    employeId: data.employeId ? Number(data.employeId) : undefined,
  };
  return await prisma.suiviPerformance.create({ data: payload });
};

export const getAllPerformances = async () => await prisma.suiviPerformance.findMany({ orderBy: { id: 'desc' } });
export const getPerformanceById = async (id) => await prisma.suiviPerformance.findUnique({ where: { id: Number(id) } });
export const updatePerformance = async (id, data) => await prisma.suiviPerformance.update({ where: { id: Number(id) }, data });
export const deletePerformance = async (id) => { await prisma.suiviPerformance.delete({ where: { id: Number(id) } }); return { success: true }; };
