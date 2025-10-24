// services/contratService.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// 🔧 Fonction utilitaire : formater les dates avant envoi à l'API
function formatContratPayload(payload) {
  return {
    ...payload,
    date_debut: payload.date_debut
      ? new Date(payload.date_debut).toISOString()
      : null,
    date_fin: payload.date_fin ? new Date(payload.date_fin).toISOString() : null,
    salaire_base: payload.salaire_base
      ? Number(payload.salaire_base)
      : null,
    employeId: payload.employeId ? Number(payload.employeId) : null,
  };
}

export async function getEmployes() {
  const url = `${API_BASE}/api/employes`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data;
}

export async function getContrats() {
  const url = `${API_BASE}/api/contrats`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

export async function createContrat(payload) {
  const url = `${API_BASE}/api/contrats`;
  const body = formatContratPayload(payload);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

export async function updateContrat(id, payload) {
  const url = `${API_BASE}/api/contrats/${id}`;
  const body = formatContratPayload(payload);
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

export async function deleteContrat(id) {
  const url = `${API_BASE}/api/contrats/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

export default { getContrats, createContrat, updateContrat, deleteContrat };
