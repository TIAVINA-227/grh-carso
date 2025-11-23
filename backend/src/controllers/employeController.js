
// // src/controllers/employeController.js
// import * as employeService from '../services/employeService.js';
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// // Créer un employé
// export const createEmploye = async (req, res) => {
//   try {
//     const employe = await employeService.createEmploye(req.body);
//     res.status(201).json(employe);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Récupérer tous les employés
// export const getAllEmployes = async (req, res) => {
//   try {
//     const employes = await employeService.getAllEmployes();
//     res.status(200).json(employes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Récupérer un employé par ID
// export const getEmployeById = async (req, res) => {
//   try {
//     const employe = await employeService.getEmployeById(req.params.id);
//     if (!employe) return res.status(404).json({ message: 'Employé non trouvé' });
//     res.status(200).json(employe);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Mettre à jour un employé
// export const updateEmploye = async (req, res) => {
//   try {
//     const employe = await employeService.updateEmploye(req.params.id, req.body);
//     if (!employe) return res.status(404).json({ message: 'Employé non trouvé' });
//     res.status(200).json(employe);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Supprimer un employé
// export const deleteEmploye = async (req, res) => {
//   try {
//     const result = await employeService.deleteEmploye(req.params.id);
//     res.status(200).json({ message: 'Employé supprimé avec succès' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Récupérer tous les départements
// export const getAllDepartements = async (req, res) => {
//   try {
//     const departements = await employeService.getAllDepartements();
//     res.status(200).json(departements);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Récupérer tous les postes
// export const getAllPostes = async (req, res) => {
//   try {
//     const postes = await employeService.getAllPostes();
//     res.status(200).json(postes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// =====================================================
// backend/src/controllers/employeController.js - CORRIGÉ
// =====================================================
import * as employeService from '../services/employeService.js';

// Créer un employé
export const createEmploye = async (req, res) => {
  try {
    const employe = await employeService.createEmploye(req.body);
    res.status(201).json({
      success: true,
      message: 'Employé créé avec succès',
      data: employe
    });
  } catch (error) {
    console.error('Erreur création employé:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Récupérer tous les employés
export const getAllEmployes = async (req, res) => {
  try {
    const employes = await employeService.getAllEmployes();
    res.status(200).json({
      success: true,
      data: employes
    });
  } catch (error) {
    console.error('Erreur récupération employés:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Récupérer un employé par ID
export const getEmployeById = async (req, res) => {
  try {
    const employe = await employeService.getEmployeById(req.params.id);
    if (!employe) {
      return res.status(404).json({ 
        success: false,
        message: 'Employé non trouvé' 
      });
    }
    res.status(200).json({
      success: true,
      data: employe
    });
  } catch (error) {
    console.error('Erreur récupération employé:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Mettre à jour un employé
export const updateEmploye = async (req, res) => {
  try {
    const employe = await employeService.updateEmploye(req.params.id, req.body);
    if (!employe) {
      return res.status(404).json({ 
        success: false,
        message: 'Employé non trouvé' 
      });
    }
    res.status(200).json({
      success: true,
      message: 'Employé mis à jour avec succès',
      data: employe
    });
  } catch (error) {
    console.error('Erreur mise à jour employé:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Supprimer un employé (hard delete avec toutes les dépendances)
export const deleteEmploye = async (req, res) => {
  try {
    const { id } = req.params;
    const employeId = parseInt(id);

    if (isNaN(employeId)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide',
      });
    }

    // Vérifier les dépendances
    const dependencies = await employeService.checkEmployeDependencies(employeId);
    
    // Avertir si beaucoup de données liées (>20 enregistrements)
    if (dependencies.totalDependencies > 20) {
      return res.status(400).json({
        success: false,
        message: 'Trop de données liées. Utilisez la désactivation à la place.',
        data: dependencies,
        suggestion: 'Utilisez PATCH /api/employes/:id/desactiver pour désactiver cet employé'
      });
    }

    // Supprimer l'employé
    const result = await employeService.deleteEmploye(employeId);

    return res.status(200).json({
      success: true,
      message: 'Employé et toutes ses données supprimés avec succès',
      data: result,
    });

  } catch (error) {
    console.error('Erreur suppression employé:', error);
    
    if (error.message === 'Employé non trouvé') {
      return res.status(404).json({
        success: false,
        message: 'Employé non trouvé',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Désactiver un employé (soft delete) - RECOMMANDÉ
export const softDeleteEmploye = async (req, res) => {
  try {
    const { id } = req.params;
    const employeId = parseInt(id);

    if (isNaN(employeId)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide',
      });
    }

    const result = await employeService.softDeleteEmploye(employeId);

    return res.status(200).json({
      success: true,
      message: 'Employé désactivé avec succès',
      data: result,
    });

  } catch (error) {
    console.error('Erreur désactivation employé:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer tous les départements
export const getAllDepartements = async (req, res) => {
  try {
    const departements = await employeService.getAllDepartements();
    res.status(200).json({
      success: true,
      data: departements
    });
  } catch (error) {
    console.error('Erreur récupération départements:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Récupérer tous les postes
export const getAllPostes = async (req, res) => {
  try {
    const postes = await employeService.getAllPostes();
    res.status(200).json({
      success: true,
      data: postes
    });
  } catch (error) {
    console.error('Erreur récupération postes:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};