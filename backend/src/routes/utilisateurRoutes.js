// // backend/src/routes/utilisateurRoutes.js
// import express from "express";
// import {
//   createUtilisateur,
//   getAllUtilisateurs,
//   getUtilisateurById,
//   updateUtilisateur,
//   deleteUtilisateur,
//   changerMotDePasse,
//   demanderResetMotDePasse,
//   resetMotDePasseAvecToken
// } from "../controllers/utilisateurController.js";

// const router = express.Router();

// // Routes CRUD de base
// router.post("/", createUtilisateur);
// router.get("/", getAllUtilisateurs);
// router.get("/:id", getUtilisateurById);
// router.put("/:id", updateUtilisateur);
// router.delete("/:id", deleteUtilisateur);

// // 🆕 Routes pour gestion des mots de passe
// router.post("/change-password", changerMotDePasse);
// router.post("/forgot-password", demanderResetMotDePasse);
// router.post("/reset-password", resetMotDePasseAvecToken);

// export default router;

// backend/src/routes/utilisateurRoutes.js
import express from "express";
import {
  createUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById,
  updateUtilisateur,
  deleteUtilisateur,
  changerMotDePasse,
  changePasswordProfile, // 🆕 Nouvelle fonction pour le profil
  demanderResetMotDePasse,
  resetMotDePasseAvecToken
} from "../controllers/utilisateurController.js";

const router = express.Router();

// Routes CRUD de base
router.post("/", createUtilisateur);
router.get("/", getAllUtilisateurs);
router.get("/:id", getUtilisateurById);
router.put("/:id", updateUtilisateur);
router.delete("/:id", deleteUtilisateur);

// 🆕 Route pour changer le mot de passe depuis le profil
// TEMPORAIRE : Sans middleware d'authentification
router.put("/:id/change-password", changePasswordProfile);

// Routes pour gestion des mots de passe (déjà existantes)
router.post("/change-password", changerMotDePasse);
router.post("/forgot-password", demanderResetMotDePasse);
router.post("/reset-password", resetMotDePasseAvecToken);

export default router;