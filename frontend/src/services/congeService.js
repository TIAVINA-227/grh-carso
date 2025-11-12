// frontend/src/services/congeService.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/**
 * Gestion d'erreur améliorée
 */
const handleResponse = async (res) => {
  if (!res.ok) {
    let errorMessage = `Erreur ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      const text = await res.text();
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await res.json();
};

/**
 * 📋 Récupérer tous les congés
 */
export async function getConges() {
  const url = `${API_BASE}/api/conges`;
  const res = await fetch(url, { 
    headers: { "Content-Type": "application/json" } 
  });
  return handleResponse(res);
}

/**
 * ➕ Créer un congé
 */
export async function createConge(payload) {
  const url = `${API_BASE}/api/conges`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * ✏️ Mettre à jour un congé
 */
export async function updateConge(id, payload) {
  const url = `${API_BASE}/api/conges/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * ❌ Supprimer un congé
 */
export async function deleteConge(id) {
  const url = `${API_BASE}/api/conges/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(res);
}

/**
 * 🔍 Récupérer un congé par ID
 */
export async function getCongeById(id) {
  const url = `${API_BASE}/api/conges/${id}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }
  });
  return handleResponse(res);
}

export default { 
  getConges, 
  createConge, 
  updateConge, 
  deleteConge,
  getCongeById 
};