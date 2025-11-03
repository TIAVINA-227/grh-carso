// backend/src/routes/congeRoutes.js (ancien nom: congeService.js)
import express from 'express';
import { 
  createConge, 
  getAllConges, 
  getCongeById, 
  updateConge, 
  deleteConge 
} from '../controllers/congeController.js';

const router = express.Router();

router.post('/', createConge);
router.get('/', getAllConges);
router.get('/:id', getCongeById);
router.put('/:id', updateConge);
router.delete('/:id', deleteConge);

export default router;