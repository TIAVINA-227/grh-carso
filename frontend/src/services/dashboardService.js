// frontend/src/services/dashboardService.js
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

// Récupérer les statistiques du dashboard
export const getDashboardStats = async () => {
  try {
    const data = await request(`${API_BASE}/api/dashboard/stats`);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    throw error;
  }
};

// Récupérer les informations de l'utilisateur connecté
export const getDashboardUser = async () => {
  try {
    const data = await request(`${API_BASE}/api/dashboard`);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getDashboardUser
};

