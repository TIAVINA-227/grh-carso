const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

export const getPaiements = () => request(`${API_BASE}/api/paiements`);
export const getPaiementById = (id) => request(`${API_BASE}/api/paiements/${id}`);
export const createPaiement = (payload) =>
  request(`${API_BASE}/api/paiements`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updatePaiement = (id, payload) =>
  request(`${API_BASE}/api/paiements/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deletePaiement = (id) =>
  request(`${API_BASE}/api/paiements/${id}`, { method: "DELETE" });

export default {
  getPaiements,
  getPaiementById,
  createPaiement,
  updatePaiement,
  deletePaiement
};
