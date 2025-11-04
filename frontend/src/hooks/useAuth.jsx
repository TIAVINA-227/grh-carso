// frontend/src/hooks/useAuth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// 🧠 Création du contexte d'authentification
const AuthContext = createContext();

// ✅ Fonction pour décoder un JWT (sans vérifier la signature)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Erreur décodage JWT:', error);
    return null;
  }
};

// ✅ Fournisseur global (wrapper dans App.jsx)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔁 Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      const decoded = decodeJWT(token);
      
      if (decoded) {
        console.log('✅ Utilisateur chargé depuis le token:', decoded);
        setUser({
          id: decoded.id || decoded.userId,
          email: decoded.email,
          role: decoded.role,
          nom_utilisateur: decoded.nom_utilisateur,
          prenom_utilisateur: decoded.prenom_utilisateur,
          token: token
        });
      } else {
        console.warn('⚠️ Token invalide, suppression');
        localStorage.removeItem("token");
      }
    } else {
      console.log('ℹ️ Aucun token trouvé');
    }
    
    setIsLoading(false);
  }, []);

  // 🔄 Fonction de login (à appeler après authentification réussie)
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    const decoded = decodeJWT(token);
    
    const fullUser = {
      ...userData,
      ...decoded,
      token: token
    };
    
    console.log('✅ Login réussi:', fullUser);
    setUser(fullUser);
  };

  // 🚪 Fonction de logout
  const logout = () => {
    console.log('🚪 Déconnexion');
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook d'accès au contexte
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}