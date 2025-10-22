// src/routes/posteRoutes.js
import express from 'express';
import {
  createPoste,
  getAllPostes,
  getPosteById,
  updatePoste,
  deletePoste
} from '../controllers/posteController.js';

const router = express.Router();

router.post('/', createPoste);
router.get('/', getAllPostes);
router.get('/:id', getPosteById);
router.put('/:id', updatePoste);
router.delete('/:id', deletePoste);

export default router;
