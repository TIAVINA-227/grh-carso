// backend/src/services/utilisateurService.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { genererMotDePasseTemporaire, genererTokenReset } from "../utils/passwordUtils.js";
import { envoyerEmailBienvenue, envoyerEmailResetPassword } from "./emailService.js";

const prisma = new PrismaClient();

/**
 * Créer un utilisateur avec envoi d'email
 */
export const createUtilisateur = async (data) => {
  try {
    // 1. Générer un mot de passe temporaire
    const motDePasseTemporaire = genererMotDePasseTemporaire();
    
    // 2. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasseTemporaire, 10);
    
    // 3. Préparer les données
    const payload = {
      nom_utilisateur: data.nom_utilisateur || data.email.split('@')[0],
      prenom_utilisateur: data.prenom || data.prenom_utilisateur,
      email: data.email.toLowerCase(),
      mot_de_passe: hashedPassword,
      role: data.role || "EMPLOYE",
      statut: "ACTIF",
      premiere_connexion: true,
      mot_de_passe_temporaire: motDePasseTemporaire // Stocké en clair pour l'email uniquement
    };
    
    // 4. Créer l'utilisateur
    const nouvelUtilisateur = await prisma.utilisateur.create({ 
      data: payload,
      include: { employe: true }
    });
    
    // 5. Envoyer l'email de bienvenue
    try {
      await envoyerEmailBienvenue(nouvelUtilisateur, motDePasseTemporaire);
      console.log(`✅ Email envoyé à ${nouvelUtilisateur.email}`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email:', emailError.message);
      // On continue même si l'email échoue
    }
    
    // 6. Retourner l'utilisateur SANS le mot de passe temporaire
    const { mot_de_passe, mot_de_passe_temporaire, ...utilisateurSansPassword } = nouvelUtilisateur;
    
    return {
      ...utilisateurSansPassword,
      emailEnvoye: true
    };
    
  } catch (error) {
    console.error('❌ Erreur création utilisateur:', error);
    throw error;
  }
};

/**
 * Mettre à jour un utilisateur
 */
export const updateUtilisateur = async (id, data) => {
  const payload = {};
  
  // Champs de base
  if (data.nom_utilisateur !== undefined) payload.nom_utilisateur = data.nom_utilisateur;
  if (data.prenom_utilisateur !== undefined || data.prenom !== undefined) {
    payload.prenom_utilisateur = data.prenom_utilisateur || data.prenom;
  }
  if (data.email !== undefined) payload.email = data.email.toLowerCase();
  if (data.role !== undefined) payload.role = data.role;
  if (data.statut !== undefined) payload.statut = data.statut;
  
  // Champs du profil
  if (data.telephone !== undefined) payload.telephone = data.telephone;
  if (data.date_naissance !== undefined) payload.date_naissance = new Date(data.date_naissance);
  if (data.bio !== undefined) payload.bio = data.bio;
  
  // Champs avatar
  if (data.avatar !== undefined) payload.avatar = data.avatar;
  
  // Ne jamais mettre à jour le mot de passe via cette route
  // Utilisez la route dédiée au changement de mot de passe
  
  const utilisateur = await prisma.utilisateur.update({
    where: { id: Number(id) },
    data: payload,
    include: { employe: true }
  });
  
  const { mot_de_passe, mot_de_passe_temporaire, ...utilisateurSansPassword } = utilisateur;
  return utilisateurSansPassword;
};

/**
 * Changer le mot de passe (première connexion ou changement normal)
 */
export const changerMotDePasse = async (userId, ancienMotDePasse, nouveauMotDePasse) => {
  // 1. Récupérer l'utilisateur
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: Number(userId) }
  });
  
  if (!utilisateur) {
    throw new Error('Utilisateur non trouvé');
  }
  
  // 2. Vérifier l'ancien mot de passe
  const motDePasseValide = await bcrypt.compare(ancienMotDePasse, utilisateur.mot_de_passe);
  
  if (!motDePasseValide) {
    throw new Error('Ancien mot de passe incorrect');
  }
  
  // 3. Hasher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);
  
  // 4. Mettre à jour
  const utilisateurMisAJour = await prisma.utilisateur.update({
    where: { id: Number(userId) },
    data: {
      mot_de_passe: hashedPassword,
      premiere_connexion: false,
      mot_de_passe_temporaire: null // Supprimer le mot de passe temporaire
    }
  });
  
  console.log(`✅ Mot de passe changé pour ${utilisateurMisAJour.email}`);
  
  return { success: true, message: 'Mot de passe modifié avec succès' };
};

/**
 * Demander une réinitialisation de mot de passe
 */
export const demanderResetMotDePasse = async (email) => {
  // 1. Trouver l'utilisateur
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  if (!utilisateur) {
    // Ne pas révéler si l'email existe ou non (sécurité)
    return { success: true, message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
  }
  
  // 2. Générer un token
  const token = genererTokenReset();
  const expiration = new Date(Date.now() + 3600000); // 1 heure
  
  // 3. Sauvegarder le token
  await prisma.utilisateur.update({
    where: { id: utilisateur.id },
    data: {
      token_reset_password: token,
      token_expiration: expiration
    }
  });
  
  // 4. Envoyer l'email
  try {
    await envoyerEmailResetPassword(utilisateur, token);
    console.log(`✅ Email de reset envoyé à ${utilisateur.email}`);
  } catch (error) {
    console.error('⚠️ Erreur envoi email reset:', error);
  }
  
  return { success: true, message: 'Un email de réinitialisation a été envoyé' };
};

/**
 * Réinitialiser le mot de passe avec le token
 */
export const resetMotDePasseAvecToken = async (token, nouveauMotDePasse) => {
  // 1. Trouver l'utilisateur avec ce token
  const utilisateur = await prisma.utilisateur.findFirst({
    where: {
      token_reset_password: token,
      token_expiration: {
        gte: new Date() // Token non expiré
      }
    }
  });
  
  if (!utilisateur) {
    throw new Error('Token invalide ou expiré');
  }
  
  // 2. Hasher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);
  
  // 3. Mettre à jour
  await prisma.utilisateur.update({
    where: { id: utilisateur.id },
    data: {
      mot_de_passe: hashedPassword,
      token_reset_password: null,
      token_expiration: null,
      premiere_connexion: false
    }
  });
  
  console.log(`✅ Mot de passe réinitialisé pour ${utilisateur.email}`);
  
  return { success: true, message: 'Mot de passe réinitialisé avec succès' };
};

/**
 * Supprimer un utilisateur
 */
export const deleteUtilisateur = async (id) => {
  await prisma.utilisateur.delete({ 
    where: { id: Number(id) } 
  });
  return { success: true };
};

/**
 * Récupérer tous les utilisateurs
 */
export const getAllUtilisateurs = async () => {
  const utilisateurs = await prisma.utilisateur.findMany({
    include: { employe: true },
    orderBy: { id: "asc" },
  });
  
  // Retirer les mots de passe
  return utilisateurs.map(u => {
    const { mot_de_passe, mot_de_passe_temporaire, token_reset_password, ...safe } = u;
    return safe;
  });
};

/**
 * Récupérer un utilisateur par ID
 */
export const getUtilisateurById = async (id) => {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: Number(id) },
    include: { employe: true },
  });
  
  if (!utilisateur) return null;
  
  const { mot_de_passe, mot_de_passe_temporaire, token_reset_password, ...safe } = utilisateur;
  return safe;
};

export default {
  createUtilisateur,
  updateUtilisateur,
  changerMotDePasse,
  demanderResetMotDePasse,
  resetMotDePasseAvecToken,
  deleteUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById
};