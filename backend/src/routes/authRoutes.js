
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// clé secrète JWT (à mettre dans .env)
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

router.get("/", (req, res) => {
    res.send("API Auth is running");
    console.log("ca marche");
    
 })

// ✅ Route inscription (SignUp)
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l’utilisateur existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé !" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = await prisma.utilisateur.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (err) {
    console.error("Erreur signup :", err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
});

// ✅ Route connexion (Login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l’utilisateur existe
    const user = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("Erreur login :", err);
    res.status(500).json({ error: "Erreur serveur lors de la connexion." });
  }
});

module.exports = router;
