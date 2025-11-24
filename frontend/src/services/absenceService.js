// frontend/src/services/absenceService.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function getAbsences(options = {}) {
  const url = new URL(`${API_BASE}/api/absences`);
  if (options.period) {
    url.searchParams.set('period', options.period);
  }
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  return await res.json();
}

export async function createAbsence(payload) {
  const url = `${API_BASE}/api/absences`;
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

export async function updateAbsence(id, payload) {
  const url = `${API_BASE}/api/absences/${id}`;
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

export async function deleteAbsence(id) {
  const url = `${API_BASE}/api/absences/${id}`;
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

export default { getAbsences };
