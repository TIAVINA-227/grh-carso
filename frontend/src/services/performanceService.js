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
export const getPerformances = () => request(`${API_BASE}/api/performances`);
export const getPerformanceById = (id) => request(`${API_BASE}/api/performances/${id}`);
export const createPerformance = (payload) =>
  request(`${API_BASE}/api/performances`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updatePerformance = (id, payload) =>
  request(`${API_BASE}/api/performances/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deletePerformance = (id) =>
  request(`${API_BASE}/api/performances/${id}`, { method: "DELETE" });
export default {
  getPerformances,
  getPerformanceById,
  createPerformance,
  updatePerformance,
  deletePerformance,
};
