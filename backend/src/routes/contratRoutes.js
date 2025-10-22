// backend/src/routes/contratRoutes.js
import express from 'express';
import { createContrat, getAllContrats, getContratById, updateContrat, deleteContrat } from '../controllers/contratController.js';
const router = express.Router();
router.post('/', createContrat);
router.get('/', getAllContrats);
router.get('/:id', getContratById);
router.put('/:id', updateContrat);
router.delete('/:id', deleteContrat);
export default router;
