import express from 'express';
import {
  createDepartement,
  getAllDepartements,
  getDepartementById,
  updateDepartement,
  deleteDepartement
} from '../controllers/departementController.js';

const router = express.Router();

router.post('/', createDepartement);
router.get('/', getAllDepartements);
router.get('/:id', getDepartementById);
router.put('/:id', updateDepartement);
router.delete('/:id', deleteDepartement);

export default router;
