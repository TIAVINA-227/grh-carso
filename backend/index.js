
// import { PrismaClient } from "@prisma/client";
// import express from "express";
// import dotenv from "dotenv";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import employeRoutes from "./src/routes/employeRoutes.js";
// import posteRoutes from "./src/routes/posteRoutes.js";
// import departementRoutes from "./src/routes/departementRoutes.js";
// import contratRoutes from "./src/routes/contratRoutes.js";
// import absenceRoutes from "./src/routes/absenceRoutes.js";
// import presenceRoutes from "./src/routes/presenceRoutes.js";
// import congeRoutes from "./src/routes/congeRoutes.js";
// import performanceRoutes from "./src/routes/performanceRoutes.js";
// import paiementRoutes from "./src/routes/paiementRoutes.js";
// import bulletinRoutes from "./src/routes/bulletinRoutes.js";
// import utilisateurRoutes from "./src/routes/utilisateurRoutes.js";
// // ✅ Importer les routes
// import utilisateurRoutes from "./routes/utilisateur.routes.js";
// import uploadRoutes from "./routes/upload.routes.js"; // ✅ Nouvelle route

// dotenv.config();
// const app = express();
// const prisma = new PrismaClient();

// // Prisma est utilisé pour l'accès à la base de données (Postgres)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur http://localhost:${PORT}`);
// });

// // Middleware
// app.use(express.json({limit: '10mb'}));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhoast:3000'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Méthodes autorisées
//   allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
//   credentials: true // Autorise les cookies
// }));

// // Route de base
// app.get("/", (req, res) => {
//   res.send("Hello Express + Prisma 🚀");
// });

// // Route d'inscription (register)
// app.post("/api/auth/register", async (req, res) => {
//   try {
//     const { nom_utilisateur, email, mot_de_passe, role } = req.body;

//     // 🔍 Validation basique
//     if (!nom_utilisateur || !email || !mot_de_passe) {
//       return res.status(400).json({ error: "Tous les champs sont requis." });
//     }

//     // Vérifier si l'utilisateur existe déjà
//     const existingUser = await prisma.utilisateur.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return res.status(400).json({ error: "Cet email est déjà utilisé !" });
//     }

//     // Hasher le mot de passe
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

//     // Vérifier le rôle envoyé
//     const roleValide = ["SUPER_ADMIN", "ADMIN", "EMPLOYE"].includes(role)
//       ? role
//       : "EMPLOYE"; // par défaut

//     // Créer le nouvel utilisateur
//     const nouvelUtilisateur = await prisma.utilisateur.create({
//       data: {
//         nom_utilisateur: nom_utilisateur.trim(),
//         email: email.trim().toLowerCase(),
//         mot_de_passe: hashedPassword,
//         role: roleValide,
//         statut: "ACTIF", // statut par défaut
//       },
//     });

//     // Réponse sans mot de passe
//     res.status(201).json({
//       message: "Compte créé avec succès.",
//       utilisateur: {
//         id: nouvelUtilisateur.id,
//         nom_utilisateur: nouvelUtilisateur.nom_utilisateur,
//         email: nouvelUtilisateur.email,
//         role: nouvelUtilisateur.role,
//         statut: nouvelUtilisateur.statut,
//       },
//     });
//   } catch (err) {
//     console.error("Erreur signup :", err);
//     res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
//   }
// });

// // Route de login
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, mot_de_passe } = req.body;

//     if (!email || !mot_de_passe) {
//       return res.status(400).json({ message: "Email et mot de passe requis" });
//     }

//     // Recherche de l’utilisateur par email
//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { email },
//       include: { employe: true, conges: true }
//     });

//     if (!utilisateur) {
//       return res.status(401).json({ message: "Email ou mot de passe incorrect" });
//     }

//     // Vérification du mot de passe
//     const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

//     if (!motDePasseValide) {
//       return res.status(401).json({ message: "Email ou mot de passe incorrect" });
//     }

//     // Vérification du statut
//     if (utilisateur.statut && utilisateur.statut !== "ACTIF") {
//       return res.status(401).json({ message: "Compte désactivé" });
//     }

//     // Génération du token
//     const token = jwt.sign(
//       {
//         id: utilisateur.id,
//         nom_utilisateur: utilisateur.nom_utilisateur,
//         role: utilisateur.role,
//       },
//       process.env.JWT_SECRET || "votre_secret_jwt",
//       { expiresIn: "24h" }
//     );

//     // Mise à jour dernière connexion
//     await prisma.utilisateur.update({
//       where: { id: utilisateur.id },
//       data: { derniere_connexion: new Date() }
//     });

//     res.json({
//       token,
//       user: {
//         id: utilisateur.id,
//         nom_utilisateur: utilisateur.nom_utilisateur,
//         email: utilisateur.email,
//         role: utilisateur.role,
//         employe: utilisateur.employe
//       }
//     });

//   } catch (error) {
//     console.error("Erreur lors de la connexion:", error);
//     res.status(500).json({ message: "Erreur interne du serveur" });
//   }
// });


// // Route pour vérifier le token
// app.get("/api/auth/verify", async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
    
//     if (!token) {
//       return res.status(401).json({ message: "Token manquant" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");
    
//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { id: decoded.id },
//       include: { employe: true }
//     });

//     if (!utilisateur) {
//       return res.status(401).json({ message: "Utilisateur non trouvé" });
//     }

//     res.json({
//       user: {
//         id: utilisateur.id,
//         nom_utilisateur: utilisateur.nom_utilisateur,
//         email: utilisateur.email,
//         role: utilisateur.role,
//         employe: utilisateur.employe
//       }
//     });

//   } catch (error) {
//     res.status(401).json({ message: "Token invalide" });
//   }
// });

// // Route protégée du dashboard
// app.get("/api/dashboard", async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization || "";
//     const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

//     if (!token) {
//       return res.status(401).json({ message: "Token manquant" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");

//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { id: decoded.id },
//       select: { id: true, nom_utilisateur: true, email: true, role: true }
//     });

//     if (!utilisateur) {
//       return res.status(401).json({ message: "Utilisateur non trouvé" });
//     }

//     return res.json({
//       success: true,
//       message: "Bienvenue sur le Dashboard 🚀",
//       user: utilisateur,
//     });

//   } catch (error) {
//     if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Token invalide" });
//     }
//     console.error("Erreur /api/dashboard:", error);
//     return res.status(500).json({ message: "Erreur interne du serveur" });
//   }
// });

// // Routes principales
// app.use("/api/utilisateurs", utilisateurRoutes);

// app.get("/", (req, res) => {
//   res.send("API Utilisateurs opérationnelle !");
// });

// // Routes des employés
// app.use("/api/employes", employeRoutes);
// // Routes des postes
// app.use("/api/postes", posteRoutes);
// // autres routes
// app.use("/api/departements", departementRoutes);
// app.use("/api/contrats", contratRoutes);
// app.use("/api/absences", absenceRoutes);
// app.use("/api/presences", presenceRoutes);
// app.use("/api/conges", congeRoutes);
// app.use("/api/performances", performanceRoutes);
// app.use("/api/paiements", paiementRoutes);
// app.use("/api/bulletins", bulletinRoutes);

// app.get ("/", (req, res) => {
//   res.send("API GRH_CARSO (Prisma + Express) fonctionne 🚀");
// });

// // Le serveur démarre directement ; Prisma gère la connexion à la base quand nécessaire
// backend/index.js
import { PrismaClient } from "@prisma/client";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

// ✅ Import des routes principales
import employeRoutes from "./src/routes/employeRoutes.js";
import posteRoutes from "./src/routes/posteRoutes.js";
import departementRoutes from "./src/routes/departementRoutes.js";
import contratRoutes from "./src/routes/contratRoutes.js";
import absenceRoutes from "./src/routes/absenceRoutes.js";
import presenceRoutes from "./src/routes/presenceRoutes.js";
import congeRoutes from "./src/routes/congeRoutes.js";
import performanceRoutes from "./src/routes/performanceRoutes.js";
import paiementRoutes from "./src/routes/paiementRoutes.js";
import bulletinRoutes from "./src/routes/bulletinRoutes.js";
import utilisateurRoutes from "./src/routes/utilisateurRoutes.js";

// ✅ Import des nouvelles routes
import uploadRoutes from "./src/routes/uploadRoutes.js";

// Configuration
dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ====================================
// MIDDLEWARE
// ====================================

// Body parser avec limite augmentée
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ CORS corrigé (localhost bien écrit)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ====================================
// ROUTE DE BASE
// ====================================

app.get("/", (req, res) => {
  res.send("✅ API GRH CARSO - Prisma + Express + Cloudinary");
});

// ====================================
// ROUTES D'AUTHENTIFICATION
// ====================================

// Route d'inscription
app.post("/api/auth/register", async (req, res) => {
  try {
    const { nom_utilisateur, email, mot_de_passe, role } = req.body;

    if (!nom_utilisateur || !email || !mot_de_passe) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé !" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    const roleValide = ["SUPER_ADMIN", "ADMIN", "EMPLOYE"].includes(role)
      ? role
      : "EMPLOYE";

    const nouvelUtilisateur = await prisma.utilisateur.create({
      data: {
        nom_utilisateur: nom_utilisateur.trim(),
        email: email.trim().toLowerCase(),
        mot_de_passe: hashedPassword,
        role: roleValide,
        statut: "ACTIF",
      },
    });

    res.status(201).json({
      message: "Compte créé avec succès.",
      utilisateur: {
        id: nouvelUtilisateur.id,
        nom_utilisateur: nouvelUtilisateur.nom_utilisateur,
        email: nouvelUtilisateur.email,
        role: nouvelUtilisateur.role,
        statut: nouvelUtilisateur.statut,
      },
    });
  } catch (err) {
    console.error("❌ Erreur signup :", err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
});

// Route de login
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, mot_de_passe } = req.body;

//     if (!email || !mot_de_passe) {
//       return res.status(400).json({ message: "Email et mot de passe requis" });
//     }

//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { email },
//       include: { employe: true, conges: true }
//     });

//     if (!utilisateur) {
//       return res.status(401).json({ message: "Email ou mot de passe incorrect" });
//     }

//     const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

//     if (!motDePasseValide) {
//       return res.status(401).json({ message: "Email ou mot de passe incorrect" });
//     }

//     if (utilisateur.statut && utilisateur.statut !== "ACTIF") {
//       return res.status(401).json({ message: "Compte désactivé" });
//     }

//     const token = jwt.sign(
//       {
//         id: utilisateur.id,
//         nom_utilisateur: utilisateur.nom_utilisateur,
//         role: utilisateur.role,
//       },
//       process.env.JWT_SECRET || "votre_secret_jwt",
//       { expiresIn: "24h" }
//     );

//     await prisma.utilisateur.update({
//       where: { id: utilisateur.id },
//       data: { derniere_connexion: new Date() }
//     });

//     res.json({
//       token,
//       user: {
//         id: utilisateur.id,
//         nom_utilisateur: utilisateur.nom_utilisateur,
//         email: utilisateur.email,
//         role: utilisateur.role,
//         employe: utilisateur.employe
//       }
//     });

//   } catch (error) {
//     console.error("❌ Erreur lors de la connexion:", error);
//     res.status(500).json({ message: "Erreur interne du serveur" });
//   }
// });
// backend/index.js - Route de login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
      include: { employe: true, conges: true }
    });

    if (!utilisateur) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!motDePasseValide) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    if (utilisateur.statut && utilisateur.statut !== "ACTIF") {
      return res.status(401).json({ message: "Compte désactivé" });
    }

    // ✅ CORRECTION : Inclure tous les champs dans le JWT
    const token = jwt.sign(
      {
        id: utilisateur.id,
        email: utilisateur.email, // ✅ Ajouté
        nom_utilisateur: utilisateur.nom_utilisateur,
        prenom_utilisateur: utilisateur.prenom_utilisateur, // ✅ Ajouté
        role: utilisateur.role,
      },
      process.env.JWT_SECRET || "votre_secret_jwt",
      { expiresIn: "24h" }
    );

    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { derniere_connexion: new Date() }
    });

    res.json({
      token,
      user: {
        id: utilisateur.id,
        nom_utilisateur: utilisateur.nom_utilisateur,
        prenom_utilisateur: utilisateur.prenom_utilisateur, // ✅ Ajouté
        email: utilisateur.email,
        role: utilisateur.role,
        employe: utilisateur.employe
      }
    });

  } catch (error) {
    console.error("❌ Erreur lors de la connexion:", error);
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
        email: utilisateur.email,
        role: utilisateur.role,
        employe: utilisateur.employe
      }
    });

  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
});

// Route protégée du dashboard
app.get("/api/dashboard", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: decoded.id },
      select: { id: true, nom_utilisateur: true, email: true, role: true }
    });

    if (!utilisateur) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({
      success: true,
      message: "Bienvenue sur le Dashboard 🚀",
      user: utilisateur,
    });

  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token invalide" });
    }
    console.error("❌ Erreur /api/dashboard:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

// ====================================
// ROUTES API
// ====================================

// ✅ Routes d'upload Cloudinary
app.use("/api/upload", uploadRoutes);

// Routes utilisateurs
app.use("/api/utilisateurs", utilisateurRoutes);

// Routes employés
app.use("/api/employes", employeRoutes);

// Routes postes
app.use("/api/postes", posteRoutes);

// Autres routes
app.use("/api/departements", departementRoutes);
app.use("/api/contrats", contratRoutes);
app.use("/api/absences", absenceRoutes);
app.use("/api/presences", presenceRoutes);
app.use("/api/conges", congeRoutes);
app.use("/api/performances", performanceRoutes);
app.use("/api/paiements", paiementRoutes);
app.use("/api/bulletins", bulletinRoutes);

// ====================================
// DÉMARRAGE DU SERVEUR
// ====================================

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📁 Routes disponibles:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/verify`);
  console.log(`   - GET  /api/dashboard`);
  console.log(`   - POST /api/upload/avatar (Cloudinary)`);
  console.log(`   - /api/utilisateurs`);
  console.log(`   - /api/employes`);
  console.log(`   - /api/postes`);
  console.log(`   - /api/departements`);
  console.log(`   - /api/contrats`);
  console.log(`   - /api/absences`);
  console.log(`   - /api/presences`);
  console.log(`   - /api/conges`);
  console.log(`   - /api/performances`);
  console.log(`   - /api/paiements`);
  console.log(`   - /api/bulletins`);
});