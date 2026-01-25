// ========================================
// backend/src/routes/sessionRoutes.js
// Routes pour gérer les sessions de connexion/déconnexion
// ========================================
import express from 'express';
import {
  createSession,
  updateSessionLogout,
  getSessionsByUser,
  getAllSessions,
  getActiveSession,
} from '../controllers/sessionController.js';
import { authenticateToken, requireRole } from '../midleware/auth.js';

const router = express.Router();

// Route pour créer une session (lors de la connexion)
// Note: Cette route peut être appelée sans authentification car elle est appelée lors du login
router.post('/', createSession);

// Route pour mettre à jour une session (lors de la déconnexion)
// Nécessite une authentification
router.post('/logout', authenticateToken, updateSessionLogout);

// Route pour obtenir toutes les sessions d'un utilisateur
// Nécessite une authentification
router.get('/user/:id', authenticateToken, getSessionsByUser);

// Route pour obtenir la session active d'un utilisateur
router.get('/active/:id', authenticateToken, getActiveSession);

// Route pour obtenir toutes les sessions (pour les admins uniquement)
router.get('/', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), getAllSessions);

export default router;
