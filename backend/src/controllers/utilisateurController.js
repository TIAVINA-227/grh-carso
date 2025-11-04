// backend/src/controllers/utilisateurController.js
import * as utilisateurService from "../services/utilisateurService.js";
import { validerMotDePasse } from "../utils/passwordUtils.js";

/**
 * Créer un utilisateur (SUPER_ADMIN uniquement)
 */
export const createUtilisateur = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const user = await utilisateurService.createUtilisateur(req.body);
    
    res.status(201).json({
      success: true,
      message: `Utilisateur créé et email envoyé à ${user.email}`,
      utilisateur: user
    });
    
  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: "Cet email est déjà utilisé" 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupérer tous les utilisateurs
 */
export const getAllUtilisateurs = async (req, res) => {
  try {
    const users = await utilisateurService.getAllUtilisateurs();
    res.json(users);
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupérer un utilisateur par ID
 */
export const getUtilisateurById = async (req, res) => {
  try {
    const user = await utilisateurService.getUtilisateurById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    console.error("Erreur récupération utilisateur:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mettre à jour un utilisateur
 */
export const updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await utilisateurService.updateUtilisateur(id, req.body);
    res.json({
      success: true,
      message: "Utilisateur mis à jour",
      utilisateur
    });
  } catch (error) {
    console.error("Erreur updateUtilisateur:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Changer le mot de passe
 */
export const changerMotDePasse = async (req, res) => {
  try {
    const { userId, ancienMotDePasse, nouveauMotDePasse } = req.body;
    
    if (!userId || !ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({ 
        message: "Tous les champs sont requis" 
      });
    }
    
    // Valider le nouveau mot de passe
    const validation = validerMotDePasse(nouveauMotDePasse);
    if (!validation.valid) {
      return res.status(400).json({ 
        message: "Mot de passe invalide",
        errors: validation.errors 
      });
    }
    
    const result = await utilisateurService.changerMotDePasse(
      userId,
      ancienMotDePasse,
      nouveauMotDePasse
    );
    
    res.json(result);
    
  } catch (error) {
    console.error("Erreur changement mot de passe:", error);
    
    if (error.message === 'Ancien mot de passe incorrect') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Erreur lors du changement de mot de passe" });
  }
};

/**
 * Demander une réinitialisation de mot de passe
 */
export const demanderResetMotDePasse = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }
    
    const result = await utilisateurService.demanderResetMotDePasse(email);
    res.json(result);
    
  } catch (error) {
    console.error("Erreur demande reset:", error);
    res.status(500).json({ message: "Erreur lors de la demande" });
  }
};

/**
 * Réinitialiser le mot de passe avec token
 */
export const resetMotDePasseAvecToken = async (req, res) => {
  try {
    const { token, nouveauMotDePasse } = req.body;
    
    if (!token || !nouveauMotDePasse) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }
    
    // Valider le nouveau mot de passe
    const validation = validerMotDePasse(nouveauMotDePasse);
    if (!validation.valid) {
      return res.status(400).json({ 
        message: "Mot de passe invalide",
        errors: validation.errors 
      });
    }
    
    const result = await utilisateurService.resetMotDePasseAvecToken(token, nouveauMotDePasse);
    res.json(result);
    
  } catch (error) {
    console.error("Erreur reset mot de passe:", error);
    
    if (error.message === 'Token invalide ou expiré') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Erreur lors de la réinitialisation" });
  }
};

/**
 * Supprimer un utilisateur
 */
export const deleteUtilisateur = async (req, res) => {
  try {
    await utilisateurService.deleteUtilisateur(req.params.id);
    res.json({ 
      success: true,
      message: "Utilisateur supprimé avec succès" 
    });
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  createUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById,
  updateUtilisateur,
  changerMotDePasse,
  demanderResetMotDePasse,
  resetMotDePasseAvecToken,
  deleteUtilisateur
};