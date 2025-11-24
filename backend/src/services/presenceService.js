
// ========================================
// backend/src/services/presenceService.js
// ========================================
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createPresence = async (data) => {
  console.log('🔍 Données avant traitement:', data);
  
  // ✅ CORRECTION: Ne pas utiliser undefined, construire l'objet proprement
  const payload = {
    date_jour: new Date(data.date_jour),
    statut: data.statut,
    heures_travaillees: data.heures_travaillees ? Number(data.heures_travaillees) : 0,
    employeId: Number(data.employeId) // ✅ Toujours défini, pas de condition ternaire avec undefined
  };
  
  // Ajouter justification seulement si présente
  if (data.justification) {
    payload.justification = data.justification;
  }
  
  console.log('📤 Payload envoyé à Prisma:', payload);
  
  return await prisma.presence.create({ 
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

const cleanupOldPresences = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  await prisma.presence.deleteMany({
    where: {
      date_jour: { lt: startOfMonth }
    }
  });
};  

export const getAllPresences = async ({ period = 'today' } = {}) => {
  await cleanupOldPresences();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const where = {};

  if (period === 'today') {
    where.date_jour = { gte: startOfToday, lte: endOfToday };
  } else if (period === 'month') {
    where.date_jour = { gte: startOfMonth, lte: endOfMonth };
  }

  return await prisma.presence.findMany({ 
    where,
    orderBy: { date_jour: 'desc' },
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

export const getPresenceById = async (id) => {
  return await prisma.presence.findUnique({ 
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

export const updatePresence = async (id, data) => {
  const payload = {};
  
  if (data.date_jour) payload.date_jour = new Date(data.date_jour);
  if (data.statut) payload.statut = data.statut;
  if (data.heures_travaillees !== undefined) payload.heures_travaillees = Number(data.heures_travaillees);
  if (data.justification !== undefined) payload.justification = data.justification;
  if (data.employeId) payload.employeId = Number(data.employeId);
  
  return await prisma.presence.update({ 
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

export const deletePresence = async (id) => {
  await prisma.presence.delete({ 
    where: { id: Number(id) } 
  });
  return { success: true };
};
