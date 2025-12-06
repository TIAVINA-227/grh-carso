// //backend/ src/middleware/auth.js
// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   try {
//     // Récupérer le token depuis le header Authorization
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         message: 'Token manquant ou invalide'
//       });
//     }

//     const token = authHeader.split(' ')[1];

//     // Vérifier et décoder le token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Ajouter les infos utilisateur à la requête
//     req.userId = decoded.userId;
//     req.userEmail = decoded.email;
//     req.userRole = decoded.role;
//     req.userMatricule = decoded.matricule;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: 'Token invalide ou expiré'
//     });
//   }
// };

// // Middleware pour vérifier les rôles
// const checkRole = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.userRole)) {
//       return res.status(403).json({
//         success: false,
//         message: 'Accès non autorisé'
//       });
//     }
//     next();
//   };
// };

// module.exports = authMiddleware;
// module.exports.checkRole = checkRole;

// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Token manquant. Veuillez vous connecter.' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
    
    // Ajouter les infos utilisateur à la requête
    req.user = {
      id: decoded.id || decoded.userId || decoded.id_utilisateur,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expiré. Veuillez vous reconnecter.' });
    }
    return res.status(403).json({ message: 'Token invalide.' });
  }
};

// Middleware optionnel pour vérifier les rôles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé. Permissions insuffisantes.' });
    }
    
    next();
  };
};