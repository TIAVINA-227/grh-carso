// ========================================
// backend/src/services/sessionService.js
// Service pour gérer les sessions de connexion/déconnexion
// ========================================
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Créer une nouvelle session de connexion
 * @param {Object} data - Données de la session
 * @param {number} data.utilisateurId - ID de l'utilisateur
 * @param {string} [data.ip_address] - Adresse IP (optionnel)
 * @param {string} [data.user_agent] - User agent (optionnel)
 * @returns {Promise<Object>} Session créée
 */
export const createSession = async (data) => {
  try {
    const session = await prisma.session.create({
      data: {
        utilisateurId: Number(data.utilisateurId),
        ip_address: data.ip_address || null,
        user_agent: data.user_agent || null,
        heure_connexion: new Date(),
      },
      include: {
        utilisateur: {
          select: {
            id: true,
            email: true,
            nom_utilisateur: true,
            prenom_utilisateur: true,
            role: true,
          },
        },
      },
    });

    console.log(`✅ Session créée pour l'utilisateur ${data.utilisateurId}`);
    return session;
  } catch (error) {
    console.error('❌ Erreur création session:', error);
    throw error;
  }
};

/**
 * Mettre à jour une session avec l'heure de déconnexion
 * @param {number} utilisateurId - ID de l'utilisateur
 * @returns {Promise<Object>} Session mise à jour
 */
export const updateSessionLogout = async (utilisateurId) => {
  try {
    // Trouver la dernière session active (sans heure_deconnexion)
    const lastActiveSession = await prisma.session.findFirst({
      where: {
        utilisateurId: Number(utilisateurId),
        heure_deconnexion: null,
      },
      orderBy: {
        heure_connexion: 'desc',
      },
    });

    if (!lastActiveSession) {
      console.warn(`⚠️ Aucune session active trouvée pour l'utilisateur ${utilisateurId}`);
      return null;
    }

    // Calculer la durée en minutes
    const heureDeconnexion = new Date();
    const dureeMinutes = Math.floor(
      (heureDeconnexion - lastActiveSession.heure_connexion) / (1000 * 60)
    );

    // Mettre à jour la session
    const sessionUpdated = await prisma.session.update({
      where: { id: lastActiveSession.id },
      data: {
        heure_deconnexion: heureDeconnexion,
        duree_minutes: dureeMinutes,
      },
      include: {
        utilisateur: {
          select: {
            id: true,
            email: true,
            nom_utilisateur: true,
            prenom_utilisateur: true,
          },
        },
      },
    });

    console.log(
      `✅ Session fermée pour l'utilisateur ${utilisateurId} - Durée: ${dureeMinutes} minutes`
    );
    return sessionUpdated;
  } catch (error) {
    console.error('❌ Erreur mise à jour session:', error);
    throw error;
  }
};

/**
 * Obtenir toutes les sessions d'un utilisateur
 * @param {number} utilisateurId - ID de l'utilisateur
 * @param {Object} options - Options de pagination
 * @returns {Promise<Array>} Liste des sessions
 */
export const getSessionsByUser = async (utilisateurId, options = {}) => {
  try {
    const { limit = 50, offset = 0 } = options;

    const sessions = await prisma.session.findMany({
      where: {
        utilisateurId: Number(utilisateurId),
      },
      orderBy: {
        heure_connexion: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        utilisateur: {
          select: {
            id: true,
            email: true,
            nom_utilisateur: true,
            prenom_utilisateur: true,
          },
        },
      },
    });

    return sessions;
  } catch (error) {
    console.error('❌ Erreur récupération sessions:', error);
    throw error;
  }
};

/**
 * Obtenir toutes les sessions (pour les admins)
 * @param {Object} options - Options de pagination et filtres
 * @returns {Promise<Object>} Liste des sessions avec pagination
 */
export const getAllSessions = async (options = {}) => {
  try {
    const { limit = 100, offset = 0, utilisateurId } = options;

    const where = utilisateurId ? { utilisateurId: Number(utilisateurId) } : {};

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        orderBy: {
          heure_connexion: 'desc',
        },
        take: limit,
        skip: offset,
        include: {
          utilisateur: {
            select: {
              id: true,
              email: true,
              nom_utilisateur: true,
              prenom_utilisateur: true,
              role: true,
            },
          },
        },
      }),
      prisma.session.count({ where }),
    ]);

    return {
      sessions,
      total,
      limit,
      offset,
    };
  } catch (error) {
    console.error('❌ Erreur récupération toutes sessions:', error);
    throw error;
  }
};

/**
 * Obtenir la session active d'un utilisateur (s'il est connecté)
 * @param {number} utilisateurId - ID de l'utilisateur
 * @returns {Promise<Object|null>} Session active ou null
 */
export const getActiveSession = async (utilisateurId) => {
  try {
    const session = await prisma.session.findFirst({
      where: {
        utilisateurId: Number(utilisateurId),
        heure_deconnexion: null,
      },
      orderBy: {
        heure_connexion: 'desc',
      },
      include: {
        utilisateur: {
          select: {
            id: true,
            email: true,
            nom_utilisateur: true,
            prenom_utilisateur: true,
          },
        },
      },
    });

    return session;
  } catch (error) {
    console.error('❌ Erreur récupération session active:', error);
    throw error;
  }
};
