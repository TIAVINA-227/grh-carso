// src/controllers/congeController.js
import * as congeService from "../services/congeService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ➕ Créer un nouveau congé
 */
export const createConge = async (req, res) => {
  try {
    const { employeId, date_debut, date_fin, motif, statut, utilisateurId, type_conge } = req.body;

    // ✅ Vérifier que utilisateurId est présent
    if (!utilisateurId) {
      return res
        .status(400)
        .json({ message: "L'identifiant de l'utilisateur (utilisateurId) est requis." });
    }

    // ✅ Vérifier que l'employé existe
    if (!employeId) {
      return res
        .status(400)
        .json({ message: "L'ID de l'employé est requis pour créer un congé." });
    }

    const employeExiste = await prisma.employe.findUnique({
      where: { id: parseInt(employeId) },
    });

    if (!employeExiste) {
      return res
        .status(400)
        .json({ message: `Aucun employé trouvé avec l'ID ${employeId}.` });
    }

    // ✅ Créer le congé via le service
    const nouveauConge = await congeService.createConge({
      employeId: parseInt(employeId),
      date_debut,
      date_fin,
      motif,
      statut,
      utilisateurId: parseInt(utilisateurId),
      type_conge,
    });

    res.status(201).json(nouveauConge);
  } catch (e) {
    console.error("Erreur création congé :", e);
    res.status(500).json({ message: e.message });
  }
};

/**
 * 📋 Récupérer tous les congés
 */
export const getAllConges = async (req, res) => {
  try {
    const liste = await congeService.getAllConges();
    res.json(liste);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

/**
 * 🔍 Récupérer un congé par ID
 */
export const getCongeById = async (req, res) => {
  try {
    const conge = await congeService.getCongeById(req.params.id);
    if (!conge)
      return res.status(404).json({ message: "Congé non trouvé." });
    res.json(conge);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

/**
 * ✏️ Mettre à jour un congé
 */
export const updateConge = async (req, res) => {
  try {
    const conge = await congeService.updateConge(req.params.id, req.body);
    if (!conge)
      return res.status(404).json({ message: "Congé non trouvé." });
    res.json(conge);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

/**
 * ❌ Supprimer un congé
 */
export const deleteConge = async (req, res) => {
  try {
    await congeService.deleteConge(req.params.id);
    res.json({ message: "Congé supprimé avec succès." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};