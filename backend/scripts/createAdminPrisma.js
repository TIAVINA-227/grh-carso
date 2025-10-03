import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Vérifier si l'admin existe déjà
    const existing = await prisma.utilisateur.findUnique({
      where: { nom_utilisateur: "admin" }
    });
    if (existing) {
      console.log("✅ L'utilisateur admin existe déjà.");
      return;
    }

    // Créer un employé minimal
    const employe = await prisma.employe.create({
      data: {
        matricule: "ADMIN001",
        nom: "Administrateur",
        prenom: "Système",
        date_naissance: new Date("1990-01-01"),
        date_embauche: new Date(),
        email: "admin@example.com"
      }
    });

    const plain = "Admin123!";
    const hash = await bcrypt.hash(plain, 10);

    await prisma.utilisateur.create({
      data: {
        nom_utilisateur: "admin",
        mot_de_passe: hash,
        email: "admin@example.com",
        role: "admin",
        statut: "actif",
        employeId: employe.id
      }
    });

    console.log("✅ Utilisateur admin créé.");
    console.log("Nom d'utilisateur: admin");
    console.log("Mot de passe: ", plain);
  } catch (e) {
    console.error("❌ Erreur création admin:", e);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();


