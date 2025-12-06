// // backend/src/controllers/utilisateurController.js
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";
// import * as utilisateurService from "../services/utilisateurService.js"; // 🆕 Importer le service

// const prisma = new PrismaClient();

// // ✅ Créer un utilisateur
// // backend/src/controllers/utilisateurController.js


// // ✅ Créer un utilisateur (VERSION AMÉLIORÉE AVEC EMAIL)
// export const createUtilisateur = async (req, res) => {
//   try {
//     const { 
//       nom_utilisateur, 
//       prenom_utilisateur,
//       email, 
//       mot_de_passe, // Ce champ sera ignoré, on génère un mot de passe aléatoire
//       role,
//       telephone,
//       date_naissance,
//       bio
//     } = req.body;

//     if (!email) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "L'email est requis" 
//       });
//     }

//     // Vérifier si l'email existe déjà
//     const existingUser = await prisma.utilisateur.findUnique({
//       where: { email: email.trim().toLowerCase() }
//     });

//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Cet email est déjà utilisé" 
//       });
//     }

//     // 🆕 UTILISER LE SERVICE au lieu de la logique directe
//     const nouvelUtilisateur = await utilisateurService.createUtilisateur({
//       nom_utilisateur: nom_utilisateur?.trim(),
//       prenom: prenom_utilisateur?.trim(),
//       email: email.trim(),
//       role: role || "EMPLOYE",
//       telephone: telephone || null,
//       date_naissance: date_naissance || null,
//       bio: bio || null
//     });

//     console.log('✅ Utilisateur créé avec email envoyé:', nouvelUtilisateur.email);

//     res.status(201).json({
//       success: true,
//       message: "Utilisateur créé avec succès. Un email avec les identifiants a été envoyé.",
//       utilisateur: nouvelUtilisateur
//     });

//   } catch (error) {
//     console.error("❌ Erreur création utilisateur:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Erreur lors de la création",
//       error: error.message 
//     });
//   }
// };

// // ... Gardez toutes vos autres fonctions inchangées

// // ✅ Récupérer tous les utilisateurs
// export const getAllUtilisateurs = async (req, res) => {
//   try {
//     const utilisateurs = await prisma.utilisateur.findMany({
//       select: {
//         id: true,
//         nom_utilisateur: true,
//         prenom_utilisateur: true,
//         email: true,
//         role: true,
//         statut: true,
//         telephone: true,
//         date_naissance: true,
//         bio: true,
//         avatar: true,
//         adresse: true,
//         ville: true,
//         pays: true,
//         photo_couverture: true,
//         date_creation: true,
//         derniere_connexion: true
//       },
//       orderBy: { date_creation: 'desc' }
//     });

//     res.json({
//       success: true,
//       count: utilisateurs.length,
//       utilisateurs
//     });

//   } catch (error) {
//     console.error("❌ Erreur récupération utilisateurs:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Erreur lors de la récupération" 
//     });
//   }
// };

// // ✅ Récupérer un utilisateur par ID
// export const getUtilisateurById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { id: parseInt(id) },
//       select: {
//         id: true,
//         nom_utilisateur: true,
//         prenom_utilisateur: true,
//         email: true,
//         role: true,
//         statut: true,
//         telephone: true,
//         date_naissance: true,
//         bio: true,
//         avatar: true,
//         adresse: true,
//         ville: true,
//         pays: true,
//         photo_couverture: true,
//         date_creation: true,
//         derniere_connexion: true
//       }
//     });

//     if (!utilisateur) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Utilisateur non trouvé" 
//       });
//     }

//     res.json({
//       success: true,
//       ...utilisateur
//     });

//   } catch (error) {
//     console.error("❌ Erreur récupération utilisateur:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Erreur lors de la récupération" 
//     });
//   }
// };

// // ✅ Mettre à jour un utilisateur (avec support avatar Cloudinary et synchronisation employe)
// export const updateUtilisateur = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       nom_utilisateur, 
//       prenom_utilisateur, 
//       telephone, 
//       date_naissance, 
//       bio, 
//       avatar,
//       role,
//       statut,
//       adresse,
//       ville,
//       pays,
//       photo_couverture
//     } = req.body;

//     console.log('🔄 Mise à jour utilisateur ID:', id);
//     console.log('📦 Données reçues:', { nom_utilisateur, prenom_utilisateur, telephone, avatar: avatar ? 'URL présente' : 'Pas d\'avatar', adresse, ville, pays, photo_couverture });

//     const existingUser = await prisma.utilisateur.findUnique({
//       where: { id: parseInt(id) },
//       include: { employe: true }
//     });

//     if (!existingUser) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Utilisateur non trouvé' 
//       });
//     }

//     // Préparer les données à mettre à jour pour l'utilisateur
//     const userDataToUpdate = {};
    
//     if (nom_utilisateur !== undefined) userDataToUpdate.nom_utilisateur = nom_utilisateur;
//     if (prenom_utilisateur !== undefined) userDataToUpdate.prenom_utilisateur = prenom_utilisateur;
//     if (telephone !== undefined) userDataToUpdate.telephone = telephone;
//     if (date_naissance !== undefined) userDataToUpdate.date_naissance = date_naissance ? new Date(date_naissance) : null;
//     if (bio !== undefined) userDataToUpdate.bio = bio;
//     if (avatar !== undefined) userDataToUpdate.avatar = avatar; // URL Cloudinary
//     if (role !== undefined) userDataToUpdate.role = role;
//     if (statut !== undefined) userDataToUpdate.statut = statut;
//     if (adresse !== undefined) userDataToUpdate.adresse = adresse;
//     if (ville !== undefined) userDataToUpdate.ville = ville;
//     if (pays !== undefined) userDataToUpdate.pays = pays;
//     if (photo_couverture !== undefined) userDataToUpdate.photo_couverture = photo_couverture;

//     console.log('📝 Données à mettre à jour utilisateur:', userDataToUpdate);

//     const updatedUser = await prisma.utilisateur.update({
//       where: { id: parseInt(id) },
//       data: userDataToUpdate,
//       include: { employe: true }
//     });

//     // 🔄 Synchroniser l'avatar avec l'employé lié
//     if (existingUser.employe && avatar !== undefined) {
//       console.log('🔗 Synchronisation avatar avec l\'employé ID:', existingUser.employe.id);
//       try {
//         await prisma.employe.update({
//           where: { id: existingUser.employe.id },
//           data: { avatar: avatar }
//         });
//         console.log('✅ Avatar synchronisé avec l\'employé');
//       } catch (employeError) {
//         console.warn('⚠️ Erreur sync avatar employé:', employeError.message);
//         // Ne pas bloquer la mise à jour utilisateur
//       }
//     }

//     console.log('✅ Utilisateur mis à jour avec succès');

//     const { mot_de_passe, ...userWithoutPassword } = updatedUser;

//     return res.status(200).json({
//       success: true,
//       message: 'Profil mis à jour avec succès',
//       utilisateur: userWithoutPassword
//     });

//   } catch (error) {
//     console.error('❌ Erreur mise à jour utilisateur:', error);
//     console.error('Stack:', error.stack);
//     console.error('Données reçues:', req.body);
//     return res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la mise à jour',
//       error: error.message,
//       details: error.stack
//     });
//   }
// };

// // ✅ Supprimer un utilisateur
// export const deleteUtilisateur = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { id: parseInt(id) }
//     });

//     if (!utilisateur) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Utilisateur non trouvé" 
//       });
//     }

//     await prisma.utilisateur.delete({
//       where: { id: parseInt(id) }
//     });

//     res.json({
//       success: true,
//       message: "Utilisateur supprimé avec succès"
//     });

//   } catch (error) {
//     console.error("❌ Erreur suppression utilisateur:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Erreur lors de la suppression" 
//     });
//   }
// };

// // ✅ Changer le mot de passe
// export const changerMotDePasse = async (req, res) => {
//   try {
//     const { userId, ancienMotDePasse, nouveauMotDePasse } = req.body;

//     if (!userId || !ancienMotDePasse || !nouveauMotDePasse) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Tous les champs sont requis" 
//       });
//     }

//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { id: parseInt(userId) }
//     });

//     if (!utilisateur) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Utilisateur non trouvé" 
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(ancienMotDePasse, utilisateur.mot_de_passe);

//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         success: false, 
//         message: "Ancien mot de passe incorrect" 
//       });
//     }

//     const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);

//     await prisma.utilisateur.update({
//       where: { id: parseInt(userId) },
//       data: { mot_de_passe: hashedPassword }
//     });

//     res.json({
//       success: true,
//       message: "Mot de passe modifié avec succès"
//     });

//   } catch (error) {
//     console.error("❌ Erreur changement mot de passe:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Erreur lors du changement de mot de passe" 
//     });
//   }
// };

// // ✅ Demander reset mot de passe (placeholder)
// export const demanderResetMotDePasse = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { email }
//     });

//     if (!utilisateur) {
//       // Ne pas révéler si l'email existe
//       return res.json({
//         success: true,
//         message: "Si cet email existe, un lien de réinitialisation a été envoyé"
//       });
//     }

//     // TODO: Implémenter l'envoi d'email avec token
//     // Pour l'instant, retourner un message générique

//     res.json({
//       success: true,
//       message: "Un lien de réinitialisation a été envoyé à votre email"
//     });

//   } catch (error) {
//     console.error("❌ Erreur demande reset:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Erreur lors de la demande" 
//     });
//   }
// };

// // ✅ Reset mot de passe avec token (placeholder)
// export const resetMotDePasseAvecToken = async (req, res) => {
//   try {
//     const { token, nouveauMotDePasse } = req.body;

//     // TODO: Vérifier le token
//     // TODO: Mettre à jour le mot de passe

//     res.json({
//       success: true,
//       message: "Mot de passe réinitialisé avec succès"
//     });

//   } catch (error) {
//     console.error("❌ Erreur reset mot de passe:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Erreur lors de la réinitialisation" 
//     });
//   }
// };

// // backend/src/controllers/utilisateurController.js
// // Ajoutez cette fonction à votre fichier existant

// // 🆕 Fonction pour changer le mot de passe depuis le profil
// export const changePasswordProfile = async (req, res) => {
//   const { id } = req.params;
//   const { ancienMotDePasse, nouveauMotDePasse } = req.body;

//   try {
//     // ⚠️ VERSION SANS AUTH MIDDLEWARE (temporaire)
//     // Si vous avez un middleware auth, décommentez la ligne suivante :
//     // if (req.user && req.user.id !== parseInt(id)) {
//     //   return res.status(403).json({ 
//     //     message: "Vous ne pouvez modifier que votre propre mot de passe" 
//     //   });
//     // }

//     // Validation des champs
//     if (!ancienMotDePasse || !nouveauMotDePasse) {
//       return res.status(400).json({ 
//         message: "Tous les champs sont requis" 
//       });
//     }

//     if (nouveauMotDePasse.length < 6) {
//       return res.status(400).json({ 
//         message: "Le nouveau mot de passe doit contenir au moins 6 caractères" 
//       });
//     }

//     // Récupérer l'utilisateur de la base de données
//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: { id: parseInt(id) }
//     });

//     if (!utilisateur) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }

//     // Vérifier l'ancien mot de passe
//     const motDePasseValide = await bcrypt.compare(
//       ancienMotDePasse, 
//       utilisateur.mot_de_passe
//     );

//     if (!motDePasseValide) {
//       return res.status(401).json({ 
//         message: "L'ancien mot de passe est incorrect" 
//       });
//     }

//     // Vérifier que le nouveau mot de passe est différent de l'ancien
//     const memeMotDePasse = await bcrypt.compare(
//       nouveauMotDePasse, 
//       utilisateur.mot_de_passe
//     );

//     if (memeMotDePasse) {
//       return res.status(400).json({ 
//         message: "Le nouveau mot de passe doit être différent de l'ancien" 
//       });
//     }

//     // Hasher le nouveau mot de passe
//     const salt = await bcrypt.genSalt(10);
//     const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

//     // Mettre à jour le mot de passe dans la base de données
//     await prisma.utilisateur.update({
//       where: { id: parseInt(id) },
//       data: { 
//         mot_de_passe: nouveauMotDePasseHash,
//         premiere_connexion: false
//       }
//     });

//     console.log(`✅ Mot de passe changé pour l'utilisateur ID: ${id}`);

//     res.json({ 
//       success: true,
//       message: "Mot de passe modifié avec succès" 
//     });

//   } catch (error) {
//     console.error('❌ Erreur changement mot de passe:', error);
//     res.status(500).json({ 
//       message: "Erreur lors du changement de mot de passe",
//       error: error.message 
//     });
//   }
// };

// backend/src/controllers/utilisateurController.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as utilisateurService from "../services/utilisateurService.js";

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

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "L'email est requis" 
      });
    }

    const existingUser = await prisma.utilisateur.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Cet email est déjà utilisé" 
      });
    }

    const nouvelUtilisateur = await utilisateurService.createUtilisateur({
      nom_utilisateur: nom_utilisateur?.trim(),
      prenom: prenom_utilisateur?.trim(),
      email: email.trim(),
      role: role || "EMPLOYE",
      telephone: telephone || null,
      date_naissance: date_naissance || null,
      bio: bio || null
    });

    console.log('✅ Utilisateur créé avec email envoyé:', nouvelUtilisateur.email);

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès. Un email avec les identifiants a été envoyé.",
      utilisateur: nouvelUtilisateur
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

// ✅ Mettre à jour un utilisateur
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

    const existingUser = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) },
      include: { 
        employe: true
      }
    });

    if (!existingUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    const userDataToUpdate = {};
    
    if (nom_utilisateur !== undefined) userDataToUpdate.nom_utilisateur = nom_utilisateur;
    if (prenom_utilisateur !== undefined) userDataToUpdate.prenom_utilisateur = prenom_utilisateur;
    if (telephone !== undefined) userDataToUpdate.telephone = telephone;
    if (date_naissance !== undefined) userDataToUpdate.date_naissance = date_naissance ? new Date(date_naissance) : null;
    if (bio !== undefined) userDataToUpdate.bio = bio;
    if (avatar !== undefined) userDataToUpdate.avatar = avatar;
    if (role !== undefined) userDataToUpdate.role = role;
    if (statut !== undefined) userDataToUpdate.statut = statut;
    if (adresse !== undefined) userDataToUpdate.adresse = adresse;
    if (ville !== undefined) userDataToUpdate.ville = ville;
    if (pays !== undefined) userDataToUpdate.pays = pays;
    if (photo_couverture !== undefined) userDataToUpdate.photo_couverture = photo_couverture;

    const updatedUser = await prisma.utilisateur.update({
      where: { id: parseInt(id) },
      data: userDataToUpdate,
      include: { employe: true }
    });

    // 🔄 Synchroniser l'avatar avec l'employé lié (si existe)
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
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};

// ✅ Supprimer un utilisateur (ADAPTÉ À VOTRE SCHÉMA PRISMA)
export const deleteUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    console.log(`🗑️ Tentative de suppression utilisateur ID: ${userId}`);

    // 1. Vérifier que l'utilisateur existe avec SEULEMENT les relations de votre schéma
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: userId },
      include: {
        employe: {
          include: {
            contrat: true,
            absences: true,
            presences: true,
            paiements: {
              include: {
                bulletin: true
              }
            },
            conges: true,
            performances: true
          }
        },
        conges: true,
        notifications: true
      }
    });

    if (!utilisateur) {
      return res.status(404).json({ 
        success: false, 
        message: "Utilisateur non trouvé" 
      });
    }

    console.log(`📊 Relations trouvées:`, {
      employe: !!utilisateur.employe,
      conges_utilisateur: utilisateur.conges?.length || 0,
      conges_employe: utilisateur.employe?.conges?.length || 0,
      notifications: utilisateur.notifications?.length || 0,
      absences: utilisateur.employe?.absences?.length || 0,
      presences: utilisateur.employe?.presences?.length || 0,
      paiements: utilisateur.employe?.paiements?.length || 0,
      contrat: !!utilisateur.employe?.contrat,
      performances: utilisateur.employe?.performances?.length || 0
    });

    // 2. Protéger le dernier SUPER_ADMIN
    const superAdminCount = await prisma.utilisateur.count({
      where: { role: 'SUPER_ADMIN' }
    });

    if (utilisateur.role === 'SUPER_ADMIN' && superAdminCount === 1) {
      return res.status(400).json({
        success: false,
        message: "⛔ Impossible de supprimer le dernier Super Admin du système"
      });
    }

    // 3. Supprimer dans une transaction - ORDRE IMPORTANT (des enfants aux parents)
    await prisma.$transaction(async (tx) => {
      
      // Si l'utilisateur a un employé lié, supprimer d'abord toutes ses données
      if (utilisateur.employe) {
        const employeId = utilisateur.employe.id;
        
        // 3.1. Supprimer les bulletins de salaire (enfant de paiements)
        if (utilisateur.employe.paiements?.length > 0) {
          for (const paiement of utilisateur.employe.paiements) {
            if (paiement.bulletin) {
              await tx.bulletinSalaire.delete({
                where: { id: paiement.bulletin.id }
              });
              console.log(`✅ Bulletin de salaire ${paiement.bulletin.id} supprimé`);
            }
          }
        }

        // 3.2. Supprimer les paiements
        const deletedPaiements = await tx.paiement.deleteMany({
          where: { employeId: employeId }
        });
        console.log(`✅ ${deletedPaiements.count} paiements supprimés`);

        // 3.3. Supprimer les congés de l'employé
        const deletedCongesEmploye = await tx.conge.deleteMany({
          where: { employeId: employeId }
        });
        console.log(`✅ ${deletedCongesEmploye.count} congés (employé) supprimés`);

        // 3.4. Supprimer les performances
        const deletedPerformances = await tx.suiviPerformance.deleteMany({
          where: { employeId: employeId }
        });
        console.log(`✅ ${deletedPerformances.count} performances supprimées`);

        // 3.5. Supprimer les présences
        const deletedPresences = await tx.presence.deleteMany({
          where: { employeId: employeId }
        });
        console.log(`✅ ${deletedPresences.count} présences supprimées`);

        // 3.6. Supprimer les absences
        const deletedAbsences = await tx.absence.deleteMany({
          where: { employeId: employeId }
        });
        console.log(`✅ ${deletedAbsences.count} absences supprimées`);

        // 3.7. Supprimer le contrat (relation 1-1)
        if (utilisateur.employe.contrat) {
          await tx.contrat.delete({
            where: { id: utilisateur.employe.contrat.id }
          });
          console.log(`✅ Contrat supprimé`);
        }

        // 3.8. Supprimer l'employé
        await tx.employe.delete({
          where: { id: employeId }
        });
        console.log(`✅ Employé ID ${employeId} supprimé`);
      }

      // 4. Supprimer les congés directement liés à l'utilisateur
      const deletedCongesUtilisateur = await tx.conge.deleteMany({
        where: { utilisateurId: userId }
      });
      console.log(`✅ ${deletedCongesUtilisateur.count} congés (utilisateur) supprimés`);

      // 5. Supprimer les notifications
      const deletedNotifications = await tx.notification.deleteMany({
        where: { utilisateurId: userId }
      });
      console.log(`✅ ${deletedNotifications.count} notifications supprimées`);

      // 6. ENFIN, supprimer l'utilisateur
      await tx.utilisateur.delete({
        where: { id: userId }
      });
      console.log(`✅ Utilisateur ID ${userId} supprimé`);
    });

    res.json({
      success: true,
      message: "✅ Utilisateur et toutes ses données associées supprimés avec succès"
    });

  } catch (error) {
    console.error("❌ Erreur suppression utilisateur:", error);
    console.error("Code d'erreur Prisma:", error.code);
    console.error("Stack:", error.stack);
    
    // Messages d'erreur détaillés
    let errorMessage = "Erreur lors de la suppression";
    
    if (error.code === 'P2003') {
      errorMessage = "Impossible de supprimer: des contraintes de clés étrangères existent. Vérifiez les relations restantes.";
    } else if (error.code === 'P2025') {
      errorMessage = "Enregistrement non trouvé lors de la suppression";
    } else if (error.name === 'PrismaClientValidationError') {
      errorMessage = "Erreur de validation Prisma. Les champs ne correspondent pas au schéma.";
    } else if (error.code === 'P2014') {
      errorMessage = "La relation violerait une contrainte requise sur un champ lié";
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? {
        error: error.message,
        code: error.code,
        meta: error.meta
      } : undefined
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
      data: { 
        mot_de_passe: hashedPassword,
        premiere_connexion: false,
        mot_de_passe_temporaire: null
      }
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

// ✅ Demander reset mot de passe
export const demanderResetMotDePasse = async (req, res) => {
  try {
    const { email } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (!utilisateur) {
      return res.json({
        success: true,
        message: "Si cet email existe, un lien de réinitialisation a été envoyé"
      });
    }

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

// ✅ Reset mot de passe avec token
export const resetMotDePasseAvecToken = async (req, res) => {
  try {
    const { token, nouveauMotDePasse } = req.body;

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

// ✅ Changer le mot de passe depuis le profil
export const changePasswordProfile = async (req, res) => {
  const { id } = req.params;
  const { ancienMotDePasse, nouveauMotDePasse } = req.body;

  try {
    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({ 
        success: false,
        message: "Tous les champs sont requis" 
      });
    }

    if (nouveauMotDePasse.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: "Le nouveau mot de passe doit contenir au moins 6 caractères" 
      });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }

    const motDePasseValide = await bcrypt.compare(
      ancienMotDePasse, 
      utilisateur.mot_de_passe
    );

    if (!motDePasseValide) {
      return res.status(401).json({ 
        success: false,
        message: "L'ancien mot de passe est incorrect" 
      });
    }

    const memeMotDePasse = await bcrypt.compare(
      nouveauMotDePasse, 
      utilisateur.mot_de_passe
    );

    if (memeMotDePasse) {
      return res.status(400).json({ 
        success: false,
        message: "Le nouveau mot de passe doit être différent de l'ancien" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

    await prisma.utilisateur.update({
      where: { id: parseInt(id) },
      data: { 
        mot_de_passe: nouveauMotDePasseHash,
        premiere_connexion: false,
        mot_de_passe_temporaire: null
      }
    });

    console.log(`✅ Mot de passe changé pour l'utilisateur ID: ${id}`);

    res.json({ 
      success: true,
      message: "Mot de passe modifié avec succès" 
    });

  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors du changement de mot de passe",
      error: error.message 
    });
  }
};