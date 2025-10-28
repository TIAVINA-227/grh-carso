import * as utilisateurService from "../services/utilisateurService.js";

// Création utilisateur
export const createUtilisateur = async (req, res) => {
  try {
    const user = await utilisateurService.createUtilisateur(req.body);
    res.status(201).json(user);
  } catch (e) {
    console.error("Erreur création utilisateur:", e);
    res.status(500).json({ message: e.message });
  }
};

// Récupérer tous les utilisateurs
export const getAllUtilisateurs = async (req, res) => {
  try {
    const users = await utilisateurService.getAllUtilisateurs();
    res.json(users);
  } catch (e) {
    console.error("Erreur récupération utilisateurs:", e);
    res.status(500).json({ message: e.message });
  }
};

// Récupérer un utilisateur par ID
export const getUtilisateurById = async (req, res) => {
  try {
    const user = await utilisateurService.getUtilisateurById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (e) {
    console.error("Erreur récupération utilisateur:", e);
    res.status(500).json({ message: e.message });
  }
};

// Mise à jour utilisateur
export const updateUtilisateur = async (req, res) => {
  try {
    const updated = await utilisateurService.updateUtilisateur(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    console.error("Erreur mise à jour utilisateur:", e);
    res.status(500).json({ message: e.message });
  }
};

// Suppression utilisateur
export const deleteUtilisateur = async (req, res) => {
  try {
    await utilisateurService.deleteUtilisateur(req.params.id);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (e) {
    console.error("Erreur suppression utilisateur:", e);
    res.status(500).json({ message: e.message });
  }
};
