import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createAbsence = async (data) => {
  const payload = {
    date_debut: data.date_debut ? new Date(data.date_debut) : undefined,
    date_fin: data.date_fin ? new Date(data.date_fin) : undefined,
    type_absence: data.type_absence,
    justification: data.justification || null,
    piece_jointe: data.piece_jointe || null,
    employeId: data.employeId ? Number(data.employeId) : undefined,
  };
  return await prisma.absence.create({ data: payload });
};

export const getAllAbsences = async () => await prisma.absence.findMany({ orderBy: { id: 'desc' } });
export const getAbsenceById = async (id) => await prisma.absence.findUnique({ where: { id: Number(id) } });
export const updateAbsence = async (id, data) => await prisma.absence.update({ where: { id: Number(id) }, data });
export const deleteAbsence = async (id) => { await prisma.absence.delete({ where: { id: Number(id) } }); return { success: true }; };
