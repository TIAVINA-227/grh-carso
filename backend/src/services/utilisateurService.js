import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer un utilisateur
export const createUtilisateur = async (data) => {
  const payload = {
    prenom: data.prenom,
    nom: data.nom,
    email: data.email,
    role: data.role || "employe",
    avatar: data.avatar || null,
  };
  return await prisma.utilisateur.create({ data: payload });
};

// Mise à jour utilisateur
export const updateUtilisateur = async (id, data) => {
  return await prisma.utilisateur.update({
    where: { id: Number(id) },
    data,
  });
};

// Suppression utilisateur
export const deleteUtilisateur = async (id) => {
  await prisma.utilisateur.delete({ where: { id: Number(id) } });
  return { success: true };
};
// Récupérer tous les utilisateurs avec employé associé
export const getAllUtilisateurs = async () => {
  return await prisma.utilisateur.findMany({
    include: {
      employe: true, // ✅ pour récupérer nom et prénom
    },
    orderBy: { id: "asc" },
  });
};

// Récupérer un utilisateur par ID
export const getUtilisateurById = async (id) => {
  return await prisma.utilisateur.findUnique({
    where: { id: Number(id) },
    include: {
      employe: true, // ✅ inclure aussi ici
    },
  });
};
