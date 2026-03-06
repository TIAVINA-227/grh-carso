import { PrismaClient } from "@prisma/client";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { startCongesCronJob } from './src/jobs/congesCronJob.js';
import notificationRoutes from "./src/routes/notificationRoutes.js";
import { registerNotificationSocket } from "./src/services/notificationService.js";
import * as sessionService from "./src/services/sessionService.js";
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
import uploadRoutes from "./src/routes/uploadRoutes.js";
import sessionRoutes from "./src/routes/sessionRoutes.js";

// CONFIGURATION
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Serveur HTTP et Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const localhostPattern = /^http:\/\/localhost:\d+$/;
      if (localhostPattern.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});
registerNotificationSocket(io);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const localhostPattern = /^http:\/\/localhost:\d+$/;
      if (localhostPattern.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Gestion des utilisateurs en ligne
let onlineUsers = new Set();
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log(" Nouvelle connexion Socket.io :", socket.id);

  socket.on("user-online", (userId) => {
    if (!userId) return;

    const safeId = String(userId);
    socket.data.userId = safeId;
    socket.join(`user:${safeId}`);

    if (!userSockets.has(safeId)) {
      userSockets.set(safeId, new Set());
    }
    userSockets.get(safeId).add(socket.id);
    onlineUsers.add(safeId);

    io.emit("online-users", Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    console.log(" Utilisateur déconnecté :", socket.id);
    const userId = socket.data.userId;

    if (userId && userSockets.has(userId)) {
      const sockets = userSockets.get(userId);
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        userSockets.delete(userId);
        onlineUsers.delete(userId);
      }
    }

    io.emit("online-users", Array.from(onlineUsers));
  });
});

// Route de base
app.get("/", (req, res) => {
  res.send(" API GRH CARSO - Prisma + Express + Cloudinary + Socket.io");
});

// Inscription
app.post("/api/auth/register", async (req, res) => {
  try {
    const { nom_utilisateur, email, mot_de_passe, role } = req.body;

    if (!nom_utilisateur || !email || !mot_de_passe) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Cet email est déjà utilisé !" });

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
    console.error(" Erreur signup :", err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) 
      return res.status(400).json({ message: "Email et mot de passe requis" });

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
      include: { employe: true, conges: true },
    });

    if (!utilisateur) 
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });

    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!motDePasseValide) 
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });

    if (utilisateur.statut && utilisateur.statut !== "ACTIF") {
      return res.status(401).json({ message: "Compte désactivé" });
    }

    const token = jwt.sign(
      {
        id: utilisateur.id,
        email: utilisateur.email,
        nom_utilisateur: utilisateur.nom_utilisateur,
        prenom_utilisateur: utilisateur.prenom_utilisateur,
        role: utilisateur.role,
      },
      process.env.JWT_SECRET || "votre_secret_jwt",
      { expiresIn: "24h" }
    );

    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { derniere_connexion: new Date() },
    });

    // Créer une session de connexion
    try {
      const ip_address = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const user_agent = req.headers['user-agent'];
      await sessionService.createSession({
        utilisateurId: utilisateur.id,
        ip_address,
        user_agent,
      });
      console.log(` Session créée pour l'utilisateur ${utilisateur.id}`);
    } catch (sessionError) {
      console.error(' Erreur création session (non bloquant):', sessionError);
      // Ne pas bloquer la connexion si la création de session échoue
    }

    // IMPORTANT : Retourner premiere_connexion
    res.json({
      token,
      user: {
        id: utilisateur.id,
        nom_utilisateur: utilisateur.nom_utilisateur,
        prenom_utilisateur: utilisateur.prenom_utilisateur,
        email: utilisateur.email,
        role: utilisateur.role,
        employe: utilisateur.employe,
        premiere_connexion: utilisateur.premiere_connexion,
        mot_de_passe_temporaire: utilisateur.mot_de_passe_temporaire 
      },
    });
  } catch (error) {
    console.error(" Erreur login :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

// Vérification token
app.get("/api/auth/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token manquant" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: decoded.id },
      include: { employe: true },
    });
    if (!utilisateur) return res.status(401).json({ message: "Utilisateur non trouvé" });

    res.json({ user: utilisateur });
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
});

// Route de déconnexion - Enregistre l'heure de départ
app.post("/api/auth/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      // Si pas de token, on retourne quand même un succès (déconnexion silencieuse)
      return res.json({ 
        success: true, 
        message: "Déconnexion effectuée" 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");
    } catch (error) {
      // Token invalide ou expiré, on retourne quand même un succès
      return res.json({ 
        success: true, 
        message: "Déconnexion effectuée" 
      });
    }

    // Enregistrer l'heure de déconnexion
    try {
      await sessionService.updateSessionLogout(decoded.id);
      console.log(` Session fermée pour l'utilisateur ${decoded.id}`);
    } catch (sessionError) {
      console.error(' Erreur mise à jour session (non bloquant):', sessionError);
      // Ne pas bloquer la déconnexion si la mise à jour de session échoue
    }

    res.json({ 
      success: true, 
      message: "Déconnexion effectuée avec succès" 
    });
  } catch (error) {
    console.error(" Erreur logout :", error);
    // Même en cas d'erreur, on retourne un succès pour ne pas bloquer la déconnexion
    res.json({ 
      success: true, 
      message: "Déconnexion effectuée" 
    });
  }
});

// Dashboard
app.get("/api/dashboard", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Token manquant" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: decoded.id },
      select: { id: true, nom_utilisateur: true, prenom_utilisateur: true, email: true, role: true, avatar: true },
    });
    if (!utilisateur) return res.status(401).json({ message: "Utilisateur non trouvé" });

    return res.json({
      success: true,
      message: "Bienvenue sur le Dashboard ",
      user: utilisateur,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token invalide" });
    }
    console.error(" Erreur /api/dashboard:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

// Statistiques du Dashboard
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Token manquant" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const [
      totalEmployes,
      totalUtilisateurs,
      totalContrats,
      totalAbsences,
      totalPresences,
      totalConges,
      totalPaiements,
      totalBulletins,
      totalPerformances,
      totalPostes,
      totalDepartements,
      employesActifs,
      employesList,
      congesEnAttente,
      paiementsCeMois,
      performancesRecent,
      presencesRecent,
      absencesRecent30,
      congesActifs
    ] = await Promise.all([
      prisma.employe.count(),
      prisma.utilisateur.count(),
      prisma.contrat.count(),
      prisma.absence.count(),
      prisma.presence.count(),
      prisma.conge.count(),
      prisma.paiement.count(),
      prisma.bulletinSalaire.count(),
      prisma.suiviPerformance.count(),
      prisma.poste.count(),
      prisma.departement.count(),
      prisma.employe.count({ where: { contrat: { statut: "ACTIF" } } }),
      prisma.employe.findMany({
        take: 4,
        include: {
          poste: true,
          departement: true,
          contrat: true
        },
        orderBy: { date_embauche: 'desc' }
      }),
      prisma.conge.count({ where: { statut: "SOUMIS" } }),
      prisma.paiement.aggregate({
        where: {
          date_paiement: {
            gte: startOfMonth
          }
        },
        _sum: { montant: true },
        _count: true
      }),
      prisma.suiviPerformance.findMany({
        take: 12,
        orderBy: { date_eval: 'desc' },
        include: { employe: true }
      }),
      prisma.presence.findMany({
        where: {
          date_jour: {
            gte: last30Days
          }
        },
        include: { employe: true }
      }),
      prisma.absence.count({
        where: {
          OR: [
            { date_debut: { gte: last30Days } },
            { date_fin: { gte: last30Days } }
          ]
        }
      }),
      prisma.conge.findMany({
        where: {
          statut: "APPROUVE",
          date_debut: { lte: now },
          date_fin: { gte: now }
        },
        include: {
          employe: {
            include: { poste: true }
          }
        },
        orderBy: { date_debut: 'asc' }
      })
    ]);

    const moyennePerformance = performancesRecent.length > 0
      ? performancesRecent.reduce((sum, p) => sum + p.note, 0) / performancesRecent.length
      : 0;

    const salaireMoyen = paiementsCeMois._count > 0
      ? paiementsCeMois._sum.montant / paiementsCeMois._count
      : 0;

    const totalPresences30j = presencesRecent.filter(p => p.statut === "PRESENT").length;
    const tauxPresence = presencesRecent.length > 0
      ? (totalPresences30j / presencesRecent.length) * 100
      : 0;

    const kpiData = performancesRecent.slice(0, 12).map(p => ({
      name: new Date(p.date_eval).toLocaleDateString('fr-FR', { month: 'short' }),
      value: p.note
    }));

    const overviewTotals = [
      { key: 'employes', label: 'Employés', value: totalEmployes, color: '#2563eb' },
      { key: 'utilisateurs', label: 'Utilisateurs', value: totalUtilisateurs, color: '#7c3aed' },
      { key: 'contrats', label: 'Contrats', value: totalContrats, color: '#f97316' },
      { key: 'postes', label: 'Postes', value: totalPostes, color: '#14b8a6' },
      { key: 'departements', label: 'Départements', value: totalDepartements, color: '#0ea5e9' },
      { key: 'absences', label: 'Absences', value: totalAbsences, color: '#f43f5e' },
      { key: 'presences', label: 'Présences', value: totalPresences, color: '#22c55e' },
      { key: 'conges', label: 'Congés', value: totalConges, color: '#a855f7' },
      { key: 'paiements', label: 'Paiements', value: totalPaiements, color: '#facc15' },
      { key: 'bulletins', label: 'Bulletins', value: totalBulletins, color: '#fb7185' },
      { key: 'performances', label: 'Performances', value: totalPerformances, color: '#38bdf8' }
    ];

    const totalOverview = overviewTotals.reduce((sum, item) => sum + item.value, 0);
    const overviewWithPercentages = overviewTotals.map(item => ({
      ...item,
      percentage: totalOverview ? (item.value / totalOverview) * 100 : 0
    }));

    const leaves = congesActifs.map((conge) => ({
      id: conge.id,
      name: `${conge.employe?.nom || ''} ${conge.employe?.prenom || ''}`.trim(),
      role: conge.employe?.poste?.intitule || "Poste non défini",
      type: conge.type_conge || "Congé",
      dateRange: `${new Date(conge.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} - ${new Date(conge.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`
    }));

    const employeeStatus = employesList.map(emp => ({
      id: emp.id,
      name: `${emp.nom} ${emp.prenom}`,
      email: emp.email || `${emp.nom.toLowerCase()}.${emp.prenom.toLowerCase()}@carso.mg`,
      role: emp.poste?.intitule || 'Non défini',
      status: emp.contrat?.statut === "ACTIF" ? "Actif" : "Inactif",
      avatar: null
    }));

    const tauxAbsence = absencesRecent30 + presencesRecent.length > 0
      ? (absencesRecent30 / (absencesRecent30 + presencesRecent.length)) * 100
      : 0;

    res.json({
      stats: {
        totalEmployes,
        totalUtilisateurs,
        totalContrats,
        totalPresences
      },
      statsChange: {
        totalEmployes: "+2%",
        totalUtilisateurs: "+1%",
        totalContrats: "+3%",
        totalPresences: "+4%"
      },
      kpiData,
      overviewTotals: overviewWithPercentages,
      employeeStatus,
      leaves,
      additionalStats: {
        tauxAbsence: Math.round(tauxAbsence * 10) / 10,
        performanceMoyenne: Math.round(moyennePerformance * 10) / 10,
        totalPostes,
        salaireMoyen: Math.round(salaireMoyen)
      }
    });
  } catch (error) {
    console.error(" Erreur /api/dashboard/stats:", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
});

// Routes API
app.use("/api/upload", uploadRoutes);
app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/employes", employeRoutes);
app.use("/api/postes", posteRoutes);
app.use("/api/departements", departementRoutes);
app.use("/api/contrats", contratRoutes);
app.use("/api/absences", absenceRoutes);
app.use("/api/presences", presenceRoutes);
app.use("/api/conges", congeRoutes);
app.use("/api/performances", performanceRoutes);
app.use("/api/paiements", paiementRoutes);
app.use("/api/bulletins", bulletinRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sessions", sessionRoutes);

// DÉMARRAGE DU SERVEUR
server.listen(PORT, () => {
  console.log(` Serveur HTTP + Socket.io démarré sur http://localhost:${PORT}`);
  console.log(`Socket.io configuré et prêt`);
  console.log(`Démarrage de la tâche CRON des congés...`);
  
  startCongesCronJob();
  
  console.log(`\n Routes API disponibles :`);
  console.log(`   - POST   /api/auth/register`);
  console.log(`   - POST   /api/auth/login`);
  console.log(`   - GET    /api/auth/verify`);
  console.log(`   - GET    /api/dashboard`);
  console.log(`   - GET    /api/dashboard/stats`);
  console.log(`   - POST   /api/upload/avatar`);
  console.log(`   - CRUD   /api/utilisateurs`);
  console.log(`   - CRUD   /api/employes`);
  console.log(`   - CRUD   /api/postes`);
  console.log(`   - CRUD   /api/departements`);
  console.log(`   - CRUD   /api/contrats`);
  console.log(`   - CRUD   /api/absences`);
  console.log(`   - CRUD   /api/presences`);
  console.log(`   - CRUD   /api/conges`);
  console.log(`   - CRUD   /api/performances`);
  console.log(`   - CRUD   /api/paiements`);
  console.log(`   - CRUD   /api/bulletins`);
  console.log(`   - CRUD   /api/notifications`);
});

// Gestion propre de la déconnexion
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});

export { io, onlineUsers };