import express from 'express';
import { createPresence, getAllPresences, getPresenceById, updatePresence, deletePresence } from '../controllers/presenceController.js';
const router = express.Router();
router.post('/', createPresence);
router.get('/', getAllPresences);
router.get('/:id', getPresenceById);
router.put('/:id', updatePresence);
router.delete('/:id', deletePresence);
export default router;
