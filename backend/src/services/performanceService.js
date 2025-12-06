// backend/src/services/performanceService.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
export const createPerformance = async (data) => {
    const payload = {
        date_eval: data.date_eval ? new Date(data.date_eval + "T00:00:00.000Z") : undefined,
        note: data.note ? Number(data.note) : undefined,
        resultat: data.resultat || null,
        commentaires: data.commentaires || null,
        objectifs: data.objectifs || null,
        realisation: data.realisation || null,
        employeId: data.employeId ? Number(data.employeId) : undefined,
    };

    return await prisma.suiviPerformance.create({
        data: payload,
    });
};

// Read All
export const getAllPerformances = async () => {
    return await prisma.suiviPerformance.findMany({
        orderBy: { id: 'desc' },
    });
};

// Read One
export const getPerformanceById = async (id) => {
    return await prisma.suiviPerformance.findUnique({
        where: { id: Number(id) },
    });
};

// Update
export const updatePerformance = async (id, data) => {
    // ✅ Préparer les données avec conversion de date
    const payload = {
        date_eval: data.date_eval ? new Date(data.date_eval + "T00:00:00.000Z") : undefined,
        note: data.note ? Number(data.note) : undefined,
        resultat: data.resultat !== undefined ? data.resultat : undefined,
        commentaires: data.commentaires !== undefined ? data.commentaires : undefined,
        objectifs: data.objectifs !== undefined ? data.objectifs : undefined,
        realisation: data.realisation !== undefined ? data.realisation : undefined,
        employeId: data.employeId ? Number(data.employeId) : undefined,
    };

    // ✅ Supprimer les champs undefined pour éviter d'écraser les valeurs existantes
    Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
            delete payload[key];
        }
    });

    return await prisma.suiviPerformance.update({
        where: { id: Number(id) },
        data: payload,
    });
};

// Delete
export const deletePerformance = async (id) => {
    await prisma.suiviPerformance.delete({
        where: { id: Number(id) },
    });

    return { success: true };
};