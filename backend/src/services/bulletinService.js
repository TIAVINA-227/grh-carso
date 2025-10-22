import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createBulletin = async (data) => {
  const payload = {
    mois: data.mois ? Number(data.mois) : undefined,
    annee: data.annee ? Number(data.annee) : undefined,
    salaire_brut: data.salaire_brut ? Number(data.salaire_brut) : undefined,
    salaire_net: data.salaire_net ? Number(data.salaire_net) : undefined,
    statut: data.statut || undefined,
    paiementId: data.paiementId ? Number(data.paiementId) : undefined,
  };
  return await prisma.bulletinSalaire.create({ data: payload });
};

export const getAllBulletins = async () => await prisma.bulletinSalaire.findMany({ orderBy: { id: 'desc' } });
export const getBulletinById = async (id) => await prisma.bulletinSalaire.findUnique({ where: { id: Number(id) } });
export const updateBulletin = async (id, data) => await prisma.bulletinSalaire.update({ where: { id: Number(id) }, data });
export const deleteBulletin = async (id) => { await prisma.bulletinSalaire.delete({ where: { id: Number(id) } }); return { success: true }; };
