import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let ioInstance = null;

const userRoom = (userId) => `user:${userId}`;

export const registerNotificationSocket = (io) => {
  ioInstance = io;
};

const emitToUser = (userId, event, payload) => {
  if (!ioInstance || !userId) return;
  ioInstance.to(userRoom(userId)).emit(event, payload);
};

const sanitizeNotificationPayload = (data) => ({
  titre: data.titre,
  message: data.message,
  type: data.type || "info",
  categorie: data.categorie || null,
  metadata: data.metadata ?? undefined,
  utilisateurId: Number(data.utilisateurId),
});

export const createNotification = async (data) => {
  const notification = await prisma.notification.create({
    data: sanitizeNotificationPayload(data),
  });

  emitToUser(notification.utilisateurId, "notification:new", notification);
  return notification;
};

export const createNotificationsForRoles = async ({
  roles = [],
  titre,
  message,
  type = "info",
  categorie = null,
  metadata = null,
}) => {
  if (!roles.length) return [];

  const utilisateurs = await prisma.utilisateur.findMany({
    where: { role: { in: roles } },
    select: { id: true },
  });

  const notifications = [];
  for (const user of utilisateurs) {
    const notification = await createNotification({
      titre,
      message,
      type,
      categorie,
      metadata,
      utilisateurId: user.id,
    });
    notifications.push(notification);
  }

  return notifications;
};

export const getNotificationsForUser = async (utilisateurId) => {
  return prisma.notification.findMany({
    where: { utilisateurId: Number(utilisateurId) },
    orderBy: { date_creation: "desc" },
  });
};

export const markNotificationAsRead = async (notificationId, utilisateurId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: Number(notificationId),
      utilisateurId: Number(utilisateurId),
    },
  });

  if (!notification) {
    throw new Error("Notification introuvable");
  }

  if (notification.lue) {
    return notification;
  }

  const updated = await prisma.notification.update({
    where: { id: notification.id },
    data: { lue: true, date_lue: new Date() },
  });

  emitToUser(updated.utilisateurId, "notification:updated", updated);
  return updated;
};

export const markAllNotificationsAsRead = async (utilisateurId) => {
  const result = await prisma.notification.updateMany({
    where: { utilisateurId: Number(utilisateurId), lue: false },
    data: { lue: true, date_lue: new Date() },
  });

  emitToUser(utilisateurId, "notification:read-all", { readAt: new Date().toISOString() });
  return { count: result.count };
};

export const deleteNotificationForUser = async (notificationId, utilisateurId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: Number(notificationId),
      utilisateurId: Number(utilisateurId),
    },
  });

  if (!notification) {
    throw new Error("Notification introuvable");
  }

  await prisma.notification.delete({
    where: { id: notification.id },
  });

  emitToUser(utilisateurId, "notification:deleted", { id: notification.id });
  return { success: true };
};

export const notifyEmployeeCongeDecision = async ({ conge, statut }) => {
  if (!conge?.utilisateurId) return null;

  const decisionMessages = {
    APPROUVE: {
      titre: "Congé approuvé",
      message: `Votre demande de congé du ${new Date(conge.date_debut).toLocaleDateString("fr-FR")} au ${new Date(conge.date_fin).toLocaleDateString("fr-FR")} a été approuvée.`,
      type: "success",
    },
    REJETE: {
      titre: "Congé rejeté",
      message: `Votre demande de congé du ${new Date(conge.date_debut).toLocaleDateString("fr-FR")} au ${new Date(conge.date_fin).toLocaleDateString("fr-FR")} a été rejetée.`,
      type: "destructive",
    },
    SOUMIS: {
      titre: "Mise à jour congé",
      message: `Votre demande de congé a été mise à jour (statut: ${statut}).`,
      type: "info",
    },
  };


  const payload =
    decisionMessages[statut] ||
    {
      titre: "Mise à jour congé",
      message: `Votre demande de congé a été mise à jour (statut: ${statut}).`,
      type: "info",
    };

  return createNotification({
    utilisateurId: conge.utilisateurId,
    categorie: "conge",
    metadata: { entity: "conge", entityId: conge.id, statut },
    ...payload,
  });
};

