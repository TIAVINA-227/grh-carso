// backend/src/controllers/utilisateurController.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ✅ Créer un utilisateur
export const createUtilisateur = async (req, res) => {
  try {
    const { 
      nom_utilisateur, 
      prenom_utilisateur,
      email, 
      mot_de_passe, 
      role,
      telephone,
      date_naissance,
      bio
    } = req.body;

    if (!nom_utilisateur || !email || !mot_de_passe) {
      return res.status(400).json({ 
        success: false, 
        message: "Nom, email et mot de passe requis" 
      });
    }

    const existingUser = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Cet email est déjà utilisé" 
      });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const nouvelUtilisateur = await prisma.utilisateur.create({
      data: {
        nom_utilisateur: nom_utilisateur.trim(),
        prenom_utilisateur: prenom_utilisateur?.trim() || '',
        email: email.trim().toLowerCase(),
        mot_de_passe: hashedPassword,
        role: role || "EMPLOYE",
        telephone: telephone || null,
        date_naissance: date_naissance ? new Date(date_naissance) : null,
        bio: bio || null,
        statut: "ACTIF"
      }
    });

    const { mot_de_passe: _, ...userWithoutPassword } = nouvelUtilisateur;

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      utilisateur: userWithoutPassword
    });

  } catch (error) {
    console.error("❌ Erreur création utilisateur:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la création",
      error: error.message 
    });
  }
};

// ✅ Récupérer tous les utilisateurs
export const getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      select: {
        id: true,
        nom_utilisateur: true,
        prenom_utilisateur: true,
        email: true,
        role: true,
        statut: true,
        telephone: true,
        date_naissance: true,
        bio: true,
        avatar: true,
        adresse: true,
        ville: true,
        pays: true,
        photo_couverture: true,
        date_creation: true,
        derniere_connexion: true
      },
      orderBy: { date_creation: 'desc' }
    });

    res.json({
      success: true,
      count: utilisateurs.length,
      utilisateurs
    });

  } catch (error) {
    console.error("❌ Erreur récupération utilisateurs:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération" 
    });
  }
};

// ✅ Récupérer un utilisateur par ID
export const getUtilisateurById = async (req, res) => {
  try {
    const { id } = req.params;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nom_utilisateur: true,
        prenom_utilisateur: true,
        email: true,
        role: true,
        statut: true,
        telephone: true,
        date_naissance: true,
        bio: true,
        avatar: true,
        adresse: true,
        ville: true,
        pays: true,
        photo_couverture: true,
        date_creation: true,
        derniere_connexion: true
      }
    });

    if (!utilisateur) {
      return res.status(404).json({ 
        success: false, 
        message: "Utilisateur non trouvé" 
      });
    }

    res.json({
      success: true,
      ...utilisateur
    });

  } catch (error) {
    console.error("❌ Erreur récupération utilisateur:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération" 
    });
  }
};

// ✅ Mettre à jour un utilisateur (avec support avatar Cloudinary et synchronisation employe)
export const updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nom_utilisateur, 
      prenom_utilisateur, 
      telephone, 
      date_naissance, 
      bio, 
      avatar,
      role,
      statut,
      adresse,
      ville,
      pays,
      photo_couverture
    } = req.body;

    console.log('🔄 Mise à jour utilisateur ID:', id);
    console.log('📦 Données reçues:', { nom_utilisateur, prenom_utilisateur, telephone, avatar: avatar ? 'URL présente' : 'Pas d\'avatar', adresse, ville, pays, photo_couverture });

    const existingUser = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) },
      include: { employe: true }
    });

    if (!existingUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Préparer les données à mettre à jour pour l'utilisateur
    const userDataToUpdate = {};
    
    if (nom_utilisateur !== undefined) userDataToUpdate.nom_utilisateur = nom_utilisateur;
    if (prenom_utilisateur !== undefined) userDataToUpdate.prenom_utilisateur = prenom_utilisateur;
    if (telephone !== undefined) userDataToUpdate.telephone = telephone;
    if (date_naissance !== undefined) userDataToUpdate.date_naissance = date_naissance ? new Date(date_naissance) : null;
    if (bio !== undefined) userDataToUpdate.bio = bio;
    if (avatar !== undefined) userDataToUpdate.avatar = avatar; // URL Cloudinary
    if (role !== undefined) userDataToUpdate.role = role;
    if (statut !== undefined) userDataToUpdate.statut = statut;
    if (adresse !== undefined) userDataToUpdate.adresse = adresse;
    if (ville !== undefined) userDataToUpdate.ville = ville;
    if (pays !== undefined) userDataToUpdate.pays = pays;
    if (photo_couverture !== undefined) userDataToUpdate.photo_couverture = photo_couverture;

    console.log('📝 Données à mettre à jour utilisateur:', userDataToUpdate);

    const updatedUser = await prisma.utilisateur.update({
      where: { id: parseInt(id) },
      data: userDataToUpdate,
      include: { employe: true }
    });

    // 🔄 Synchroniser l'avatar avec l'employé lié
    if (existingUser.employe && avatar !== undefined) {
      console.log('🔗 Synchronisation avatar avec l\'employé ID:', existingUser.employe.id);
      try {
        await prisma.employe.update({
          where: { id: existingUser.employe.id },
          data: { avatar: avatar }
        });
        console.log('✅ Avatar synchronisé avec l\'employé');
      } catch (employeError) {
        console.warn('⚠️ Erreur sync avatar employé:', employeError.message);
        // Ne pas bloquer la mise à jour utilisateur
      }
    }

    console.log('✅ Utilisateur mis à jour avec succès');

    const { mot_de_passe, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      utilisateur: userWithoutPassword
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour utilisateur:', error);
    console.error('Stack:', error.stack);
    console.error('Données reçues:', req.body);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
      details: error.stack
    });
  }
};

// ✅ Supprimer un utilisateur
export const deleteUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      return res.status(404).json({ 
        success: false, 
        message: "Utilisateur non trouvé" 
      });
    }

    await prisma.utilisateur.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: "Utilisateur supprimé avec succès"
    });

  } catch (error) {
    console.error("❌ Erreur suppression utilisateur:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression" 
    });
  }
};

// ✅ Changer le mot de passe
export const changerMotDePasse = async (req, res) => {
  try {
    const { userId, ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!userId || !ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({ 
        success: false, 
        message: "Tous les champs sont requis" 
      });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!utilisateur) {
      return res.status(404).json({ 
        success: false, 
        message: "Utilisateur non trouvé" 
      });
    }

    const isPasswordValid = await bcrypt.compare(ancienMotDePasse, utilisateur.mot_de_passe);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Ancien mot de passe incorrect" 
      });
    }

    const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);

    await prisma.utilisateur.update({
      where: { id: parseInt(userId) },
      data: { mot_de_passe: hashedPassword }
    });

    res.json({
      success: true,
      message: "Mot de passe modifié avec succès"
    });

  } catch (error) {
    console.error("❌ Erreur changement mot de passe:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors du changement de mot de passe" 
    });
  }
};

// ✅ Demander reset mot de passe (placeholder)
export const demanderResetMotDePasse = async (req, res) => {
  try {
    const { email } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (!utilisateur) {
      // Ne pas révéler si l'email existe
      return res.json({
        success: true,
        message: "Si cet email existe, un lien de réinitialisation a été envoyé"
      });
    }

    // TODO: Implémenter l'envoi d'email avec token
    // Pour l'instant, retourner un message générique

    res.json({
      success: true,
      message: "Un lien de réinitialisation a été envoyé à votre email"
    });

  } catch (error) {
    console.error("❌ Erreur demande reset:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la demande" 
    });
  }
};

// ✅ Reset mot de passe avec token (placeholder)
export const resetMotDePasseAvecToken = async (req, res) => {
  try {
    const { token, nouveauMotDePasse } = req.body;

    // TODO: Vérifier le token
    // TODO: Mettre à jour le mot de passe

    res.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès"
    });

  } catch (error) {
    console.error("❌ Erreur reset mot de passe:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la réinitialisation" 
    });
  }
};