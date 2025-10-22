import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createPresence = async (data) => {
  const payload = {
    date_jour: data.date_jour ? new Date(data.date_jour) : undefined,
    statut: data.statut || undefined,
    heures_travaillees: data.heures_travaillees ? Number(data.heures_travaillees) : undefined,
    justification: data.justification || null,
    employeId: data.employeId ? Number(data.employeId) : undefined,
  };
  return await prisma.presence.create({ data: payload });
};

export const getAllPresences = async () => await prisma.presence.findMany({ orderBy: { id: 'desc' } });
export const getPresenceById = async (id) => await prisma.presence.findUnique({ where: { id: Number(id) } });
export const updatePresence = async (id, data) => await prisma.presence.update({ where: { id: Number(id) }, data });
export const deletePresence = async (id) => { await prisma.presence.delete({ where: { id: Number(id) } }); return { success: true }; };
