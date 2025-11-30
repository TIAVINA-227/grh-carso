//frontend/src/hooks/useNotifications.js
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationService";

/**
 * Gestion centralisée des notifications (API + Socket)
 * @param {Object} options
 * @param {number|null} options.userId
 * @param {string|null} options.token
 * @param {import("socket.io-client").Socket} options.socket
 */
export function useNotifications({ userId, token, socket }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!token || !userId) {
      setNotifications([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotifications(token);
      setNotifications(data);
    } catch (err) {
      console.error("❌ Chargement notifications échoué:", err);
      setError(err.message || "Impossible de charger les notifications");
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!socket || !userId) return;

    const handleNew = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    const handleUpdated = (notification) => {
      setNotifications((prev) =>
        prev.map((item) => (item.id === notification.id ? notification : item))
      );
    };

    const handleDeleted = ({ id }) => {
      if (!id) return;
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    };

    const handleReadAll = ({ readAt }) => {
      setNotifications((prev) =>
        prev.map((item) =>
          item.lue ? item : { ...item, lue: true, date_lue: readAt || new Date().toISOString() }
        )
      );
    };

    socket.on("notification:new", handleNew);
    socket.on("notification:updated", handleUpdated);
    socket.on("notification:deleted", handleDeleted);
    socket.on("notification:read-all", handleReadAll);

    return () => {
      socket.off("notification:new", handleNew);
      socket.off("notification:updated", handleUpdated);
      socket.off("notification:deleted", handleDeleted);
      socket.off("notification:read-all", handleReadAll);
    };
  }, [socket, userId]);

  const markOneAsRead = useCallback(
    async (notificationId) => {
      if (!token || !notificationId) return null;
      try {
        const updated = await markNotificationAsRead(notificationId, token);
        setNotifications((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        return updated;
      } catch (err) {
        console.error("❌ Impossible de marquer la notification:", err);
        setError(err.message || "Action impossible");
        throw err;
      }
    },
    [token]
  );

  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    try {
      await markAllNotificationsAsRead(token);
      setNotifications((prev) =>
        prev.map((item) => (item.lue ? item : { ...item, lue: true, date_lue: new Date().toISOString() }))
      );
    } catch (err) {
      console.error("❌ Impossible de tout marquer comme lu:", err);
      setError(err.message || "Action impossible");
      throw err;
    }
  }, [token]);

  const deleteOne = useCallback(
    async (notificationId) => {
      if (!token || !notificationId) return;
      try {
        await deleteNotification(notificationId, token);
        setNotifications((prev) => prev.filter((item) => item.id !== Number(notificationId)));
      } catch (err) {
        console.error("❌ Impossible de supprimer la notification:", err);
        setError(err.message || "Action impossible");
        throw err;
      }
    },
    [token]
  );

  const unreadCount = useMemo(
    () => notifications.filter((notif) => !notif.lue).length,
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
    reload: loadNotifications,
    markOneAsRead,
    markAllAsRead,
    deleteOne,
  };
}

