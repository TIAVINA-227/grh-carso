// Corrections pour backend/src/services/absenceService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createAbsence = async (data) => {
  console.log('🔍 Données reçues dans absenceService:', data);
  
  // ✅ CORRECTION: Construction propre sans undefined
  const payload = {
    date_debut: new Date(data.date_debut),
    date_fin: new Date(data.date_fin),
    type_absence: data.type_absence,
    justification: data.justification || null,
    employeId: Number(data.employeId) // ✅ Toujours défini
  };
  
  // Ajouter piece_jointe seulement si présente
  if (data.piece_jointe) {
    payload.piece_jointe = data.piece_jointe;
  }
  
  console.log('📤 Payload envoyé à Prisma:', payload);
  
  return await prisma.absence.create({ 
    data: payload,
    include: {
      employe: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true
        }
      }
    }
  });
};

export const getAllAbsences = async ({ period = 'active' } = {}) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const where = {};

  if (period === 'active') {
    where.date_fin = { gte: now };
  } else if (period === 'month') {
    where.AND = [
      { date_debut: { lte: endOfMonth } },
      { date_fin: { gte: startOfMonth } }
    ];
  }

  return await prisma.absence.findMany({ 
    where,
    orderBy: { id: 'desc' },
    include: {
      employe: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true
        }
      }
    }
  });
};

export const getAbsenceById = async (id) => {
  return await prisma.absence.findUnique({ 
    where: { id: Number(id) },
    include: {
      employe: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true
        }
      }
    }
  });
};

export const updateAbsence = async (id, data) => {
  const payload = {};
  
  if (data.date_debut) payload.date_debut = new Date(data.date_debut);
  if (data.date_fin) payload.date_fin = new Date(data.date_fin);
  if (data.type_absence) payload.type_absence = data.type_absence;
  if (data.justification !== undefined) payload.justification = data.justification;
  if (data.piece_jointe !== undefined) payload.piece_jointe = data.piece_jointe;
  if (data.employeId) payload.employeId = Number(data.employeId);
  if (data.statut) payload.statut = data.statut;
  
  return await prisma.absence.update({ 
    where: { id: Number(id) }, 
    data: payload,
    include: {
      employe: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true
        }
      }
    }
  });
};

export const deleteAbsence = async (id) => {
  await prisma.absence.delete({ 
    where: { id: Number(id) } 
  });
  return { success: true };
};