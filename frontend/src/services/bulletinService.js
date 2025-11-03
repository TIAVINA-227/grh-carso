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
export const getBulletins = () => request(`${API_BASE}/api/bulletins`);
export const getBulletinById = (id) => request(`${API_BASE}/api/bulletins/${id}`);
export const createBulletin = (payload) =>
  request(`${API_BASE}/api/bulletins`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateBulletin = (id, payload) =>
  request(`${API_BASE}/api/bulletins/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deleteBulletin = (id) =>
  request(`${API_BASE}/api/bulletins/${id}`, { method: "DELETE" });
export default {
  getBulletins,
  getBulletinById,
  createBulletin,
  updateBulletin,
  deleteBulletin,
};
