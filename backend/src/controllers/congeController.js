// // backend/src/controllers/congeController.js
// import * as congeService from "../services/congeService.js";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// /**
//  * ➕ Créer un nouveau congé
//  */
// export const createConge = async (req, res) => {
//   try {
//     const { employeId, date_debut, date_fin, motif, statut, utilisateurId, type_conge } = req.body;

//     console.log('📥 Requête création congé:', {
//       employeId,
//       utilisateurId,
//       type_conge,
//       date_debut,
//       date_fin
//     });

//     // ✅ Validation des champs requis
//     if (!utilisateurId) {
//       return res.status(400).json({ 
//         message: "L'identifiant de l'utilisateur (utilisateurId) est requis." 
//       });
//     }

//     if (!employeId) {
//       return res.status(400).json({ 
//         message: "L'ID de l'employé (employeId) est requis." 
//       });
//     }

//     if (!date_debut || !date_fin) {
//       return res.status(400).json({ 
//         message: "Les dates de début et de fin sont requises." 
//       });
//     }

//     // ✅ Vérifier que l'utilisateur existe
//     const utilisateurExiste = await prisma.utilisateur.findUnique({
//       where: { id: parseInt(utilisateurId) }
//     });

//     if (!utilisateurExiste) {
//       const utilisateursDisponibles = await prisma.utilisateur.findMany({
//         select: { id: true, email: true }
//       });
      
//       console.log('⚠️ Utilisateurs disponibles:', utilisateursDisponibles);
      
//       return res.status(400).json({ 
//         message: `Utilisateur avec l'ID ${utilisateurId} n'existe pas.`,
//         utilisateursDisponibles: utilisateursDisponibles.map(u => ({ id: u.id, email: u.email }))
//       });
//     }

//     // ✅ Vérifier que l'employé existe
//     const employeExiste = await prisma.employe.findUnique({
//       where: { id: parseInt(employeId) }
//     });

//     if (!employeExiste) {
//       const employesDisponibles = await prisma.employe.findMany({
//         select: { id: true, nom: true, prenom: true }
//       });
      
//       console.log('⚠️ Employés disponibles:', employesDisponibles);
      
//       return res.status(400).json({ 
//         message: `Employé avec l'ID ${employeId} n'existe pas.`,
//         employesDisponibles: employesDisponibles.map(e => ({ 
//           id: e.id, 
//           nom: `${e.prenom} ${e.nom}` 
//         }))
//       });
//     }

//     // ✅ Créer le congé
//     const nouveauConge = await congeService.createConge({
//       employeId: parseInt(employeId),
//       date_debut,
//       date_fin,
//       motif: motif || null,
//       statut: statut || 'SOUMIS',
//       utilisateurId: parseInt(utilisateurId),
//       type_conge: type_conge || 'Congé annuel'
//     });

//     console.log('✅ Congé créé avec succès:', nouveauConge.id);
//     res.status(201).json(nouveauConge);

//   } catch (error) {
//     console.error("❌ Erreur création congé:", error);
//     res.status(500).json({ 
//       message: error.message || "Erreur lors de la création du congé" 
//     });
//   }
// };

// /**
//  * 📋 Récupérer tous les congés
//  */
// export const getAllConges = async (req, res) => {
//   try {
//     const conges = await congeService.getAllConges();
//     res.json(conges);
//   } catch (error) {
//     console.error("❌ Erreur récupération congés:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * 🔍 Récupérer un congé par ID
//  */
// export const getCongeById = async (req, res) => {
//   try {
//     const conge = await congeService.getCongeById(req.params.id);
    
//     if (!conge) {
//       return res.status(404).json({ message: "Congé non trouvé." });
//     }
    
//     res.json(conge);
//   } catch (error) {
//     console.error("❌ Erreur récupération congé:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * ✏️ Mettre à jour un congé
//  */
// export const updateConge = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const conge = await congeService.updateConge(id, req.body);
    
//     if (!conge) {
//       return res.status(404).json({ message: "Congé non trouvé." });
//     }
    
//     res.json(conge);
//   } catch (error) {
//     console.error("❌ Erreur mise à jour congé:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * ❌ Supprimer un congé
//  */
// export const deleteConge = async (req, res) => {
//   try {
//     const result = await congeService.deleteConge(req.params.id);
//     res.json(result);
//   } catch (error) {
//     console.error("❌ Erreur suppression congé:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// backend/src/controllers/congeController.js
import * as congeService from "../services/congeService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ➕ Créer un nouveau congé
 */
export const createConge = async (req, res) => {
  try {
    const { employeId, date_debut, date_fin, motif, statut, utilisateurId, type_conge } = req.body;

    console.log('📥 Requête création congé:', {
      employeId,
      utilisateurId,
      type_conge,
      date_debut,
      date_fin
    });

    if (!utilisateurId) {
      return res.status(400).json({ 
        message: "L'identifiant de l'utilisateur (utilisateurId) est requis." 
      });
    }

    if (!employeId) {
      return res.status(400).json({ 
        message: "L'ID de l'employé (employeId) est requis." 
      });
    }

    if (!date_debut || !date_fin) {
      return res.status(400).json({ 
        message: "Les dates de début et de fin sont requises." 
      });
    }

    const utilisateurExiste = await prisma.utilisateur.findUnique({
      where: { id: parseInt(utilisateurId) }
    });

    if (!utilisateurExiste) {
      return res.status(400).json({ 
        message: `Utilisateur avec l'ID ${utilisateurId} n'existe pas.`
      });
    }

    const employeExiste = await prisma.employe.findUnique({
      where: { id: parseInt(employeId) }
    });

    if (!employeExiste) {
      return res.status(400).json({ 
        message: `Employé avec l'ID ${employeId} n'existe pas.`
      });
    }

    const nouveauConge = await congeService.createConge({
      employeId: parseInt(employeId),
      date_debut,
      date_fin,
      motif: motif || null,
      statut: statut || 'SOUMIS',
      utilisateurId: parseInt(utilisateurId),
      type_conge: type_conge || 'Congé annuel'
    });

    console.log('✅ Congé créé avec succès:', nouveauConge.id);
    res.status(201).json(nouveauConge);

  } catch (error) {
    console.error("❌ Erreur création congé:", error);
    res.status(500).json({ 
      message: error.message || "Erreur lors de la création du congé" 
    });
  }
};

/**
 * 📋 Récupérer tous les congés
 */
export const getAllConges = async (req, res) => {
  try {
    const conges = await congeService.getAllConges();
    res.json(conges);
  } catch (error) {
    console.error("❌ Erreur récupération congés:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔍 Récupérer un congé par ID
 */
export const getCongeById = async (req, res) => {
  try {
    const conge = await congeService.getCongeById(req.params.id);
    
    if (!conge) {
      return res.status(404).json({ message: "Congé non trouvé." });
    }
    
    res.json(conge);
  } catch (error) {
    console.error("❌ Erreur récupération congé:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✏️ Mettre à jour un congé
 */
export const updateConge = async (req, res) => {
  try {
    const { id } = req.params;
    const conge = await congeService.updateConge(id, req.body);
    
    if (!conge) {
      return res.status(404).json({ message: "Congé non trouvé." });
    }
    
    res.json(conge);
  } catch (error) {
    console.error("❌ Erreur mise à jour congé:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ❌ Supprimer un congé
 */
export const deleteConge = async (req, res) => {
  try {
    const result = await congeService.deleteConge(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("❌ Erreur suppression congé:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📊 Récupérer le solde de congés d'un employé
 */
export const getSoldeConges = async (req, res) => {
  try {
    const { employeId } = req.params;
    const solde = await congeService.getSoldeConges(employeId);
    res.json(solde);
  } catch (error) {
    console.error("❌ Erreur récupération solde:", error);
    res.status(500).json({ message: error.message });
  }
};