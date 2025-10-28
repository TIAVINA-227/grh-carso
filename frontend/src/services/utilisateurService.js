const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function getUtilisateurs() {
  const url = `${API_BASE}/api/utilisateurs`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

async function createUtilisateur(payload) {
  const url = `${API_BASE}/api/utilisateurs`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

async function updateUtilisateur(id, payload) {
  const url = `${API_BASE}/api/utilisateurs/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

async function deleteUtilisateur(id) {
  const url = `${API_BASE}/api/utilisateurs/${id}`;
  const res = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

async function getUtilisateurById(id) {
  const url = `${API_BASE}/api/utilisateurs/${id}`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

async function getUtilisateursByRole(role) {
  const allUtilisateurs = await getUtilisateurs();
  return allUtilisateurs.filter(u => u.role === role);
}

async function getEmployes() { return getUtilisateursByRole('employe'); }
async function getAdmins() { return getUtilisateursByRole('admin'); }
async function getManagers() { return getUtilisateursByRole('manager'); }

const utilisateurService = {
  getUtilisateurs,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
  getUtilisateurById,
  getUtilisateursByRole,
  getEmployes,
  getAdmins,
  getManagers
};

export default utilisateurService;
