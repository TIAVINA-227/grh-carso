//frontend/src/services/notificationService.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const buildHeaders = (token, extra = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erreur API notifications");
  }
  return response.status === 204 ? null : response.json();
};

export async function fetchNotifications(token) {
  const response = await fetch(`${API_BASE}/api/notifications`, {
    headers: buildHeaders(token),
  });
  return handleResponse(response);
}

export async function markNotificationAsRead(id, token) {
  const response = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: buildHeaders(token),
  });
  return handleResponse(response);
}

export async function markAllNotificationsAsRead(token) {
  const response = await fetch(`${API_BASE}/api/notifications/read-all`, {
    method: "PATCH",
    headers: buildHeaders(token),
  });
  return handleResponse(response);
}

export async function deleteNotification(id, token) {
  const response = await fetch(`${API_BASE}/api/notifications/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
  return handleResponse(response);
}

