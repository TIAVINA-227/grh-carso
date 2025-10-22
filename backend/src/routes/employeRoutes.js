// src/routes/employeRoutes.js
import express from 'express';
import {
  createEmploye,
  getAllEmployes,
  getEmployeById,
  updateEmploye,
  deleteEmploye,
  getAllDepartements,
  getAllPostes
} from '../controllers/employeController.js';

const router = express.Router();

router.post('/', createEmploye);
router.get('/', getAllEmployes);
router.get('/departements', getAllDepartements);
router.get('/postes', getAllPostes);
router.get('/:id', getEmployeById);
router.put('/:id', updateEmploye);
router.delete('/:id', deleteEmploye);

export default router;
