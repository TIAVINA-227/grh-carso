const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

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

export default { getEmployes };
