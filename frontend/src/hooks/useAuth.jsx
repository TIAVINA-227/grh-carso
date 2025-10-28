// src/hooks/useAuth.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Utilisateur actuellement connecté (Super Admin)
  const [user, setUser] = useState({
    prenom: "Andry",
    nom: "Rasolo",
    role: "superadmin",
    avatar: "/avatars/shadcn.jpg",
  });

  // Simulation de tous les utilisateurs
  const [users, setUsers] = useState([
    { id: 1, prenom: "Jean", nom: "Dupont", role: "admin", email: "jean@example.com" },
    { id: 2, prenom: "Marie", nom: "Randria", role: "user", email: "marie@example.com" },
    { id: 3, prenom: "David", nom: "Rakoto", role: "user", email: "david@example.com" },
  ]);

  return (
    <AuthContext.Provider value={{ user, users, setUsers, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
