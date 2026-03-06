// backend/src/controllers/sessionController.js
// Contrôleur pour gérer les sessions de connexion/déconnexion

import * as sessionService from '../services/sessionService.js';

/**
 * Créer une nouvelle session (appelé lors de la connexion)
 */
export const createSession = async (req, res) => {
  try {
    const { utilisateurId } = req.body;
    
    if (!utilisateurId) {
      return res.status(400).json({ 
        message: 'utilisateurId est requis' 
      });
    }

    // Récupérer l'IP et le user agent depuis la requête
    const ip_address = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    const session = await sessionService.createSession({
      utilisateurId,
      ip_address,
      user_agent,
    });

    res.status(201).json({
      success: true,
      message: 'Session créée avec succès',
      session,
    });
  } catch (error) {
    console.error('❌ Erreur création session:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors de la création de la session' 
    });
  }
};

/**
 * Mettre à jour une session avec l'heure de déconnexion
 */
export const updateSessionLogout = async (req, res) => {
  try {
    const utilisateurId = req.user?.id || req.body?.utilisateurId;

    if (!utilisateurId) {
      return res.status(400).json({ 
        message: 'utilisateurId est requis' 
      });
    }

    const session = await sessionService.updateSessionLogout(utilisateurId);

    if (!session) {
      return res.status(404).json({ 
        message: 'Aucune session active trouvée' 
      });
    }

    res.json({
      success: true,
      message: 'Session fermée avec succès',
      session,
    });
  } catch (error) {
    console.error('❌ Erreur mise à jour session:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors de la mise à jour de la session' 
    });
  }
};

/**
 * Obtenir toutes les sessions d'un utilisateur
 */
export const getSessionsByUser = async (req, res) => {
  try {
    const utilisateurId = req.params.id || req.user?.id;
    const { limit = 50, offset = 0 } = req.query;

    if (!utilisateurId) {
      return res.status(400).json({ 
        message: 'utilisateurId est requis' 
      });
    }

    const sessions = await sessionService.getSessionsByUser(utilisateurId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      sessions,
      count: sessions.length,
    });
  } catch (error) {
    console.error('❌ Erreur récupération sessions:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors de la récupération des sessions' 
    });
  }
};

/**
 * Obtenir toutes les sessions (pour les admins)
 */
export const getAllSessions = async (req, res) => {
  try {
    const { limit = 100, offset = 0, utilisateurId } = req.query;

    const result = await sessionService.getAllSessions({
      limit: parseInt(limit),
      offset: parseInt(offset),
      utilisateurId: utilisateurId ? parseInt(utilisateurId) : undefined,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('❌ Erreur récupération toutes sessions:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors de la récupération des sessions' 
    });
  }
};

/**
 * Obtenir la session active d'un utilisateur
 */
export const getActiveSession = async (req, res) => {
  try {
    const utilisateurId = req.params.id || req.user?.id;

    if (!utilisateurId) {
      return res.status(400).json({ 
        message: 'utilisateurId est requis' 
      });
    }

    const session = await sessionService.getActiveSession(utilisateurId);

    if (!session) {
      return res.status(404).json({ 
        message: 'Aucune session active trouvée' 
      });
    }

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('❌ Erreur récupération session active:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors de la récupération de la session active' 
    });
  }
};
