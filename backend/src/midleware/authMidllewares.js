// backend/src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return next();

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded doit contenir { id, email, ... } selon ton payload
    req.user = decoded;
  } catch (err) {
    console.warn("Token invalide ou expiré (optionalAuth) :", err.message);
    // Ne bloque pas : on laisse le contrôleur utiliser req.body.utilisateurId
  }
  return next();
};

// middleware strict (si tu veux protéger une route à l'avenir)
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Token invalide" });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide" });
  }
};
