// //frontend/src/services/employeService.js
// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// export async function getEmployes() {
//   const url = `${API_BASE}/api/employes`;
//   const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Erreur API: ${res.status} ${text}`);
//   }
//   const data = await res.json();
//   return data;
// }

// export async function createEmploye(payload) {
//   const url = `${API_BASE}/api/employes`;
//   const res = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Erreur API: ${res.status} ${text}`);
//   }
//   return await res.json();
// }
// export async function updateEmploye(id, payload) {
//   const url = `${API_BASE}/api/employes/${id}`;
//   const res = await fetch(url, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Erreur API: ${res.status} ${text}`);
//   }
//   return await res.json();
// }
// export async function deleteEmploye(id) {
//   const url = `${API_BASE}/api/employes/${id}`;
//   const res = await fetch(url, {
//     method: 'DELETE',
//     headers: { 'Content-Type': 'application/json' },
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Erreur API: ${res.status} ${text}`);
//   }
//   return await res.json();
// }

// export async function getDepartements() {
//   const url = `${API_BASE}/api/employes/departements`;
//   const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Erreur API: ${res.status} ${text}`);
//   }
//   const data = await res.json();
//   return data;
// }

// export async function getPostes() {
//   const url = `${API_BASE}/api/employes/postes`;
//   const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Erreur API: ${res.status} ${text}`);
//   }
//   const data = await res.json();
//   return data;
// }

// export default { getEmployes };
// =====================================================
// frontend/src/services/employeService.js
// =====================================================
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function getEmployes() {
  const url = `${API_BASE}/api/employes`;
  const res = await fetch(url, { 
    headers: { "Content-Type": "application/json" } 
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  
  const data = await res.json();
  return data.success ? data.data : data;
}

export async function createEmploye(payload) {
  const url = `${API_BASE}/api/employes`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(errorData.message || `Erreur API: ${res.status}`);
  }
  
  const data = await res.json();
  return data.success ? data.data : data;
}

export async function updateEmploye(id, payload) {
  const url = `${API_BASE}/api/employes/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(errorData.message || `Erreur API: ${res.status}`);
  }
  
  const data = await res.json();
  return data.success ? data.data : data;
}

export async function deleteEmploye(id) {
  const url = `${API_BASE}/api/employes/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(errorData.message || `Erreur lors de la suppression`);
  }
  
  const data = await res.json();
  return data;
}

export async function softDeleteEmploye(id) {
  const url = `${API_BASE}/api/employes/${id}/desactiver`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(errorData.message || `Erreur lors de la désactivation`);
  }
  
  const data = await res.json();
  return data;
}

export async function getDepartements() {
  const url = `${API_BASE}/api/employes/departements`;
  const res = await fetch(url, { 
    headers: { "Content-Type": "application/json" } 
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  
  const data = await res.json();
  return data.success ? data.data : data;
}

export async function getPostes() {
  const url = `${API_BASE}/api/employes/postes`;
  const res = await fetch(url, { 
    headers: { "Content-Type": "application/json" } 
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${res.status} ${text}`);
  }
  
  const data = await res.json();
  return data.success ? data.data : data;
}

export default { 
  getEmployes,
  createEmploye,
  updateEmploye,
  deleteEmploye,
  softDeleteEmploye,
  getDepartements,
  getPostes
};