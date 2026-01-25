// // frontend/src/hooks/useAuth.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// // Fonction pour décoder un JWT
// const decodeJWT = (token) => {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error('❌ Erreur décodage JWT:', error);
//     return null;
//   }
// };

// // Vérifier si le token est expiré
// const isTokenExpired = (decoded) => {
//   if (!decoded || !decoded.exp) return true;
//   const currentTime = Math.floor(Date.now() / 1000); // Timestamp en secondes
//   const isExpired = decoded.exp < currentTime;
  
//   if (isExpired) {
//     console.warn('⚠️ Token expiré:', {
//       exp: new Date(decoded.exp * 1000).toLocaleString(),
//       now: new Date(currentTime * 1000).toLocaleString()
//     });
//   }
  
//   return isExpired;
// };

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Charger l'utilisateur au démarrage
//   useEffect(() => {
//     console.log('🔄 useAuth - Initialisation...');
    
//     const token = localStorage.getItem("token");
    
//     if (token) {
//       const decoded = decodeJWT(token);
      
//       if (decoded && !isTokenExpired(decoded)) {
//         console.log('✅ Token valide, utilisateur restauré:', decoded.email);
//         setUser({
//           id: decoded.id || decoded.userId,
//           email: decoded.email,
//           role: decoded.role,
//           nom_utilisateur: decoded.nom_utilisateur,
//           prenom_utilisateur: decoded.prenom_utilisateur,
//           token: token
//         });
//       } else {
//         console.warn('⚠️ Token expiré ou invalide, suppression');
//         localStorage.removeItem("token");
//         setUser(null);
//       }
//     } else {
//       console.log('ℹ️ Aucun token trouvé');
//     }
    
//     setIsLoading(false);
//   }, []);

//   // Fonction de login
//   const login = (token, userData) => {
//     console.log('🔐 Login appelé');
    
//     localStorage.setItem("token", token);
//     const decoded = decodeJWT(token);
    
//     const fullUser = {
//       ...userData,
//       ...decoded,
//       token: token
//     };
    
//     console.log('Utilisateur connecté:', fullUser.email);
//     setUser(fullUser);
//   };

// // Fonction de logout
// const logout = () => {
//   console.log('🚪 Déconnexion - Suppression du token et du user');
  
//   // 1. Supprimer le token du localStorage
//   localStorage.removeItem("token");
//   console.log('Token supprimé du localStorage');
  
//   // 2. Mettre user à null dans le state
//   setUser(null);
//   console.log('User mis à null dans le state');
  
//   // Note: La navigation est gérée par le composant qui appelle logout()
// };

//   // Fonction pour mettre à jour l'utilisateur
//   const updateUser = (updates) => {
//     setUser(prev => prev ? { ...prev, ...updates } : null);
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       setUser, 
//       login, 
//       logout, 
//       updateUser,
//       isLoading 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
  
//   if (!context) {
//     throw new Error('useAuth doit être utilisé dans un AuthProvider');
//   }
  
//   return context;
// }

// ========================================
// 3. frontend/src/hooks/useAuth.jsx (CORRIGÉ)
// ========================================
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

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

const isTokenExpired = (decoded) => {
  if (!decoded || !decoded.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = decoded.exp < currentTime;
  
  if (isExpired) {
    console.warn('⚠️ Token expiré');
  }
  
  return isExpired;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 useAuth - Initialisation...');
    
    const token = localStorage.getItem("token");
    
    if (token) {
      const decoded = decodeJWT(token);
      
      if (decoded && !isTokenExpired(decoded)) {
        console.log('✅ Token valide, utilisateur restauré:', decoded.email);
        console.log('🔐 Première connexion depuis token?', decoded.premiere_connexion);
        
        setUser({
          id: decoded.id || decoded.userId,
          email: decoded.email,
          role: decoded.role,
          nom_utilisateur: decoded.nom_utilisateur,
          prenom_utilisateur: decoded.prenom_utilisateur,
          premiere_connexion: decoded.premiere_connexion,      // ✅ snake_case
          premiereConnexion: decoded.premiere_connexion,       // ✅ camelCase
          token: token
        });
      } else {
        console.warn('⚠️ Token expiré ou invalide, suppression');
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      console.log('ℹ️ Aucun token trouvé');
    }
    
    setIsLoading(false);
  }, []);

  const login = (token, userData) => {
    console.log('🔐 Login appelé avec userData:', userData);
    
    localStorage.setItem("token", token);
    const decoded = decodeJWT(token);
    
    const fullUser = {
      ...userData,
      ...decoded,
      token: token,
      // ✅ S'assurer que premiere_connexion est bien présent
      premiere_connexion: userData.premiere_connexion ?? decoded.premiere_connexion,
      premiereConnexion: userData.premiereConnexion ?? userData.premiere_connexion ?? decoded.premiere_connexion
    };
    
    console.log('✅ User complet après merge:', fullUser);
    console.log('🔐 Première connexion finale?', fullUser.premiere_connexion, fullUser.premiereConnexion);
    
    setUser(fullUser);
  };

  const logout = async () => {
    console.log('🚪 Déconnexion en cours...');
    
    // 🆕 Appeler l'API pour enregistrer l'heure de déconnexion
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        console.log('✅ Heure de déconnexion enregistrée');
      } catch (error) {
        console.error('⚠️ Erreur lors de l\'enregistrement de la déconnexion (non bloquant):', error);
        // Ne pas bloquer la déconnexion si l'API échoue
      }
    }
    
    // Supprimer le token et mettre user à null
    localStorage.removeItem("token");
    setUser(null);
    console.log('✅ Déconnexion terminée');
  };

  const updateUser = (updates) => {
    console.log('🔄 Mise à jour user:', updates);
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      logout, 
      updateUser,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}
