// frontend/src/services/utilisateurService.js
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

export const getUtilisateurs = () => request(`${API_BASE}/api/utilisateurs`);
export const createUtilisateur = (payload) =>
  request(`${API_BASE}/api/utilisateurs`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateUtilisateur = (id, payload) =>
  request(`${API_BASE}/api/utilisateurs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deleteUtilisateur = (id) =>
  request(`${API_BASE}/api/utilisateurs/${id}`, { method: "DELETE" });
export const getUtilisateurById = (id) =>
  request(`${API_BASE}/api/utilisateurs/${id}`);
export const getUtilisateursByRole = async (role) => {
  const all = await getUtilisateurs();
  return all.filter((u) => u.role === role);
};
export const getEmployes = () => getUtilisateursByRole("employe");
export const getAdmins = () => getUtilisateursByRole("admin");
export const getManagers = () => getUtilisateursByRole("manager");

export default {
  getUtilisateurs,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
  getUtilisateurById,
  getUtilisateursByRole,
  getEmployes,
  getAdmins,
  getManagers,
};
