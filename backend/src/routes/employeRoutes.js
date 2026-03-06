// backend/src/routes/employeRoutes.js

import express from 'express';
import {
  createEmploye,
  getAllEmployes,
  getEmployeById,
  updateEmploye,
  deleteEmploye,
  softDeleteEmploye,
  getAllDepartements,
  getAllPostes
} from '../controllers/employeController.js';

const router = express.Router();

// Routes pour les employés
router.post('/', createEmploye);
router.get('/', getAllEmployes);
router.get('/departements', getAllDepartements);
router.get('/postes', getAllPostes);
router.get('/:id', getEmployeById);
router.put('/:id', updateEmploye);

// Suppression complète (avec toutes les dépendances)
router.delete('/:id', deleteEmploye);

// Désactivation (soft delete) - RECOMMANDÉ
router.patch('/:id/desactiver', softDeleteEmploye);

export default router;