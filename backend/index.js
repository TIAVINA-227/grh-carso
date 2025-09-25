import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config(); // charge les variables d'environnement
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Route de base
app.get("/", (req, res) => {
  res.send("Hello Express + Prisma 🚀");
});

// Route de login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { nom_utilisateur, mot_de_passe } = req.body;

    if (!nom_utilisateur || !mot_de_passe) {
      return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
    }

    // Rechercher l'utilisateur
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { nom_utilisateur },
      include: { employe: true }
    });

    if (!utilisateur) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // Vérifier le statut (autoriser null/undefined comme actif)
    if (utilisateur.statut && utilisateur.statut !== "actif") {
      return res.status(401).json({ message: "Compte désactivé" });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: utilisateur.id_utilisateur, 
        nom_utilisateur: utilisateur.nom_utilisateur,
        role: utilisateur.role 
      },
      process.env.JWT_SECRET || "votre_secret_jwt",
      { expiresIn: "24h" }
    );

    // Mettre à jour la dernière connexion
    await prisma.utilisateur.update({
      where: { id_utilisateur: utilisateur.id_utilisateur },
      data: { derniere_connexion: new Date() }
    });

    res.json({
      token,
      user: {
        id: utilisateur.id_utilisateur,
        nom_utilisateur: utilisateur.nom_utilisateur,
        email: utilisateur.email,
        role: utilisateur.role,
        employe: utilisateur.employe
      }
    });

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

// Route pour vérifier le token
app.get("/api/auth/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");
    
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: decoded.id },
      include: { employe: true }
    });

    if (!utilisateur) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      user: {
        id: utilisateur.id_utilisateur,
        nom_utilisateur: utilisateur.nom_utilisateur,
        email: utilisateur.email,
        role: utilisateur.role,
        employe: utilisateur.employe
      }
    });

  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
