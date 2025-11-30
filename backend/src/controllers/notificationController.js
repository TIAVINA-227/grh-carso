import {
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationForUser,
} from "../services/notificationService.js";

const getUserIdFromRequest = (req) => {
  const idFromToken = req.user?.id || req.user?.userId;
  if (!idFromToken) {
    throw new Error("Utilisateur non authentifié");
  }
  return Number(idFromToken);
};

export const listMyNotifications = async (req, res) => {
  try {
    const utilisateurId = getUserIdFromRequest(req);
    const notifications = await getNotificationsForUser(utilisateurId);
    res.json(notifications);
  } catch (error) {
    console.error("❌ Erreur récupération notifications:", error);
    res.status(500).json({ message: error.message || "Erreur serveur" });
  }
};

export const markOneAsRead = async (req, res) => {
  try {
    const utilisateurId = getUserIdFromRequest(req);
    const { id } = req.params;
    const notification = await markNotificationAsRead(id, utilisateurId);
    res.json(notification);
  } catch (error) {
    console.error("❌ Erreur lecture notification:", error);
    const status = error.message === "Notification introuvable" ? 404 : 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

export const markAllAsReadController = async (req, res) => {
  try {
    const utilisateurId = getUserIdFromRequest(req);
    const result = await markAllNotificationsAsRead(utilisateurId);
    res.json(result);
  } catch (error) {
    console.error("❌ Erreur lecture notifications:", error);
    res.status(500).json({ message: error.message || "Erreur serveur" });
  }
};

export const deleteNotificationController = async (req, res) => {
  try {
    const utilisateurId = getUserIdFromRequest(req);
    const { id } = req.params;
    const result = await deleteNotificationForUser(id, utilisateurId);
    res.json(result);
  } catch (error) {
    console.error("❌ Erreur suppression notification:", error);
    const status = error.message === "Notification introuvable" ? 404 : 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

