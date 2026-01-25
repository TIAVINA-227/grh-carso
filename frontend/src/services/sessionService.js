// frontend/src/services/sessionService.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  const defaultHeaders = { "Content-Type": "application/json" };
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const mergedOptions = { ...options };
  mergedOptions.headers = { ...defaultHeaders, ...(options.headers || {}) };

  const res = await fetch(url, mergedOptions);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

// Obtenir toutes les sessions d'un utilisateur
export const getSessionsByUser = (userId, options = {}) => {
  const { limit = 50, offset = 0 } = options;
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  return request(`${API_BASE}/api/sessions/user/${userId}?${params}`);
};

// Obtenir toutes les sessions (pour les admins)
export const getAllSessions = (options = {}) => {
  const { limit = 100, offset = 0, utilisateurId } = options;
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());
  if (utilisateurId) params.append('utilisateurId', utilisateurId.toString());
  
  return request(`${API_BASE}/api/sessions?${params}`);
};

// Obtenir la session active d'un utilisateur
export const getActiveSession = (userId) => {
  return request(`${API_BASE}/api/sessions/active/${userId}`);
};

export default {
  getSessionsByUser,
  getAllSessions,
  getActiveSession,
};
