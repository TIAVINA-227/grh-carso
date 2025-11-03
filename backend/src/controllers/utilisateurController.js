// backend/src/controllers/utilisateurController.js
import * as utilisateurService from "../services/utilisateurService.js";

// Créer un utilisateur
export const createUtilisateur = async (req, res) => {
  try {
    if (!req.body.prenom || !req.body.nom || !req.body.email) {
      return res.status(400).json({ message: "Prénom, nom et email requis" });
    }

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
    const { id } = req.params;

    // On ne modifie que les champs valides
    const data = {};
    ["nom", "prenom", "email", "role", "avatar"].forEach((field) => {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    });

    const utilisateur = await utilisateurService.updateUtilisateur(id, data);
    res.json(utilisateur);
  } catch (error) {
    console.error("Erreur updateUtilisateur :", error);
    res.status(500).json({ message: error.message });
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
