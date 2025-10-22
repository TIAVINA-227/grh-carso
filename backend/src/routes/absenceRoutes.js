import express from 'express';
import { createAbsence, getAllAbsences, getAbsenceById, updateAbsence, deleteAbsence } from '../controllers/absenceController.js';
const router = express.Router();
router.post('/', createAbsence);
router.get('/', getAllAbsences);
router.get('/:id', getAbsenceById);
router.put('/:id', updateAbsence);
router.delete('/:id', deleteAbsence);
export default router;
