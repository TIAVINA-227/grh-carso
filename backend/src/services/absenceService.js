// Corrections pour backend/src/services/absenceService.js
import { PrismaClient } from '@prisma/client';
import { createNotificationsForRoles } from './notificationService.js';

const prisma = new PrismaClient();

const formatDateRangeFr = (dateDebut, dateFin) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const debut = new Date(dateDebut).toLocaleDateString('fr-FR', options);
  const fin = new Date(dateFin).toLocaleDateString('fr-FR', options);
  return debut === fin ? debut : `${debut} ➝ ${fin}`;
};

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
  
  const absence = await prisma.absence.create({ 
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

  try {
    const employe = absence.employe;
    const nomEmploye = `${employe?.prenom || ""} ${employe?.nom || ""}`.trim() || "Un employé";
    await createNotificationsForRoles({
      roles: ["ADMIN", "SUPER_ADMIN"],
      titre: "Nouvelle absence déclarée",
      message: `${nomEmploye} a déclaré une absence (${absence.type_absence}) pour ${formatDateRangeFr(absence.date_debut, absence.date_fin)}.`,
      type: "warning",
      categorie: "absence",
      metadata: { entity: "absence", entityId: absence.id, employeId: absence.employeId },
    });
  } catch (notificationError) {
    console.error("⚠️ Notification absence échouée:", notificationError);
  }

  return absence;
};

export const getAllAbsences = async ({ period = 'active' } = {}) => {
  const now = new Date();
  
  // ✅ SOLUTION : Utiliser setHours pour remettre à minuit en heure locale
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  
  console.log('🔍 getAllAbsences appelé avec period:', period);
  console.log('📅 Date actuelle (now):', now);
  console.log('📅 Début du jour (todayStart):', todayStart);
  console.log('📅 Fin du jour (todayEnd):', todayEnd);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const where = {};

  if (period === 'active') {
    // ✅ Une absence est "en cours" si elle chevauche aujourd'hui
    where.AND = [
      { date_debut: { lte: todayEnd } },    // Début avant ou aujourd'hui
      { date_fin: { gte: todayStart } }      // Fin aujourd'hui ou après
    ];
    
    console.log('✅ Filtre ACTIVE appliqué:', JSON.stringify({
      date_debut_lte: todayEnd,
      date_fin_gte: todayStart
    }, null, 2));
  } else if (period === 'month') {
    where.AND = [
      { date_debut: { lte: endOfMonth } },
      { date_fin: { gte: startOfMonth } }
    ];
    console.log('✅ Filtre MONTH appliqué');
  }

  const results = await prisma.absence.findMany({ 
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

  console.log(`📊 Nombre d'absences trouvées: ${results.length}`);
  
  results.forEach(abs => {
    console.log(`   - Absence #${abs.id}: ${abs.date_debut} → ${abs.date_fin} (${abs.type_absence})`);
  });

  return results;
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