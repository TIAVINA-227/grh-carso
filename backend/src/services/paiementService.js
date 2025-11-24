import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createPaiement = async (data) => {
  const payload = {
    date_paiement: data.date_paiement ? new Date(data.date_paiement) : undefined,
    montant: data.montant ? Number(data.montant) : undefined,
    mode_paiement: data.mode_paiement,
    statut: data.statut || undefined,
    periode_debut: data.periode_debut ? new Date(data.periode_debut) : undefined,
    periode_fin: data.periode_fin ? new Date(data.periode_fin) : undefined,
    employeId: data.employeId ? Number(data.employeId) : undefined,
  };
  return await prisma.paiement.create({ data: payload });
};

export const getAllPaiements = async () =>
  await prisma.paiement.findMany({
    orderBy: { id: 'desc' },
    include: {
      employe: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          utilisateur: {
            select: {
              nom_utilisateur: true,
              prenom_utilisateur: true
            }
          }
        }
      }
    }
  });
export const getPaiementById = async (id) => await prisma.paiement.findUnique({ where: { id: Number(id) } });
export const updatePaiement = async (id, data) => await prisma.paiement.update({ where: { id: Number(id) }, data });
export const deletePaiement = async (id) => { await prisma.paiement.delete({ where: { id: Number(id) } }); return { success: true }; };
