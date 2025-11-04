// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🔓 CONNEXION avec détection première connexion
 */
export const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // 1. Chercher l'utilisateur
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email: email.toLowerCase() },
      include: { employe: true, conges: true }
    });

    if (!utilisateur) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // 2. Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!motDePasseValide) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // 3. Vérifier le statut du compte
    if (utilisateur.statut !== "ACTIF") {
      return res.status(403).json({ 
        message: "Votre compte est bloqué. Contactez l'administrateur." 
      });
    }

    // 4. Générer le token JWT
    const token = jwt.sign(
    {
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,  // ✅ Important !
        nom_utilisateur: utilisateur.nom_utilisateur,
        prenom_utilisateur: utilisateur.prenom_utilisateur
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
    );

    // 5. Mettre à jour la dernière connexion
    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { derniere_connexion: new Date() }
    });

    console.log(`✅ Connexion réussie: ${utilisateur.email} - Rôle: ${utilisateur.role}`);

    // 6. Retourner la réponse avec indicateur première connexion
    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom_utilisateur: utilisateur.nom_utilisateur,
        prenom_utilisateur: utilisateur.prenom_utilisateur,
        role: utilisateur.role,
        statut: utilisateur.statut,
        employe: utilisateur.employe,
        // 🆕 IMPORTANT : Indiquer si c'est la première connexion
        premiereConnexion: utilisateur.premiere_connexion
      }
    });

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * 🔍 Vérifier le token
 */
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");
    
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: decoded.id },
      include: { employe: true }
    });

    if (!utilisateur) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      user: {
        id: utilisateur.id,
        nom_utilisateur: utilisateur.nom_utilisateur,
        prenom_utilisateur: utilisateur.prenom_utilisateur,
        email: utilisateur.email,
        role: utilisateur.role,
        employe: utilisateur.employe,
        premiereConnexion: utilisateur.premiere_connexion
      }
    });

  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

export default {
  login,
  verifyToken
};