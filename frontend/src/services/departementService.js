// export default { getDepartements };

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Erreur API');
  }
  return res.json();
}

// Export nommé pour tous les services
export async function getDepartements() {
  const res = await fetch(`${API_BASE}/api/departements`);
  return handleResponse(res);
}

export async function createDepartement(payload) {
  const res = await fetch(`${API_BASE}/api/departements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function updateDepartement(id, payload) {
  const res = await fetch(`${API_BASE}/api/departements/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function deleteDepartement(id) {
  const res = await fetch(`${API_BASE}/api/departements/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
