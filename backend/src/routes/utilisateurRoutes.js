// backend/src/routes/utilisateurRoutes.js
import express from "express";
import {
  createUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById,
  updateUtilisateur,
  deleteUtilisateur,
  changerMotDePasse,
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

// 🆕 Routes pour gestion des mots de passe
router.post("/change-password", changerMotDePasse);
router.post("/forgot-password", demanderResetMotDePasse);
router.post("/reset-password", resetMotDePasseAvecToken);

export default router;
// backend/src/routes/utilisateurRoutes.js
// import express from 'express';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';
// import { envoyerEmailBienvenue } from '../services/emailService.js';

// const router = express.Router();
// const prisma = new PrismaClient();

// // 📌 CRÉER UN UTILISATEUR (avec envoi email)
// router.post('/', async (req, res) => {
//   try {
//     const { nom_utilisateur, prenom_utilisateur, email, mot_de_passe, role, statut } = req.body;

//     // Vérifier si l'email existe déjà
//     const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ error: "Cet email est déjà utilisé" });
//     }

//     // Générer un mot de passe temporaire aléatoire
//     const motDePasseTemporaire = `Temp${Math.random().toString(36).slice(-8)}!`;
    
//     // Hasher le mot de passe
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(motDePasseTemporaire, salt);

//     // Créer l'utilisateur
//     const nouvelUtilisateur = await prisma.utilisateur.create({
//       data: {
//         nom_utilisateur: nom_utilisateur || email.split('@')[0],
//         prenom_utilisateur,
//         email,
//         mot_de_passe: hashedPassword,
//         role: role || 'EMPLOYE',
//         statut: statut || 'ACTIF',
//         premiere_connexion: true,
//         mot_de_passe_temporaire: motDePasseTemporaire
//       }
//     });

//     // 📧 ENVOYER L'EMAIL DE BIENVENUE
//     const emailResult = await envoyerEmailBienvenue(nouvelUtilisateur, motDePasseTemporaire);
    
//     if (!emailResult.success) {
//       console.warn('⚠️ Email non envoyé:', emailResult.error);
//       // On continue quand même (l'utilisateur est créé)
//     }

//     res.status(201).json({
//       message: "Utilisateur créé avec succès",
//       utilisateur: {
//         id: nouvelUtilisateur.id,
//         nom_utilisateur: nouvelUtilisateur.nom_utilisateur,
//         prenom_utilisateur: nouvelUtilisateur.prenom_utilisateur,
//         email: nouvelUtilisateur.email,
//         role: nouvelUtilisateur.role
//       },
//       emailSent: emailResult.success
//     });

//   } catch (error) {
//     console.error('❌ Erreur création utilisateur:', error);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// // 📌 LIRE TOUS LES UTILISATEURS
// router.get('/', async (req, res) => {
//   try {
//     const utilisateurs = await prisma.utilisateur.findMany({
//       include: { employe: true }
//     });
//     res.json({ utilisateurs });
//   } catch (error) {
//     console.error('❌ Erreur lecture utilisateurs:', error);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// // 📌 LIRE UN UTILISATEUR PAR ID
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { id: parseInt(id) },
//       include: { employe: true }
//     });
    
//     if (!utilisateur) {
//       return res.status(404).json({ error: 'Utilisateur non trouvé' });
//     }
    
//     res.json(utilisateur);
//   } catch (error) {
//     console.error('❌ Erreur lecture utilisateur:', error);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// // 📌 METTRE À JOUR UN UTILISATEUR
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { nom_utilisateur, prenom_utilisateur, email, role, statut } = req.body;

//     const updated = await prisma.utilisateur.update({
//       where: { id: parseInt(id) },
//       data: {
//         nom_utilisateur,
//         prenom_utilisateur,
//         email,
//         role,
//         statut
//       }
//     });

//     res.json(updated);
//   } catch (error) {
//     console.error('❌ Erreur mise à jour utilisateur:', error);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// // 📌 SUPPRIMER UN UTILISATEUR
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await prisma.utilisateur.delete({
//       where: { id: parseInt(id) }
//     });
//     res.json({ message: 'Utilisateur supprimé' });
//   } catch (error) {
//     console.error('❌ Erreur suppression utilisateur:', error);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// export default router;