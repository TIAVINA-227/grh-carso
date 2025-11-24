
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

export const getAllPresences = async () => {
  return await prisma.presence.findMany({ 
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
