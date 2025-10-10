// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // format: Bearer <token>
  if (!token) {
    return res.status(401).json({ error: "Token manquant, accès refusé" });
  }
  try {
    const secret = process.env.JWT_SECRET || "secret123";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("verifyToken error:", err && err.message);
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

/**
 * authorizeRoles(...roles)
 * middleware factory to restrict access by role
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Utilisateur non authentifié" });

    const role = user.role;
    if (!role) return res.status(403).json({ error: "Rôle utilisateur introuvable" });

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Accès refusé - rôle insuffisant" });
    }

    next();
  };
}

module.exports = { verifyToken, authorizeRoles };
