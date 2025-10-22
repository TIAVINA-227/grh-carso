import express from 'express';
import { createBulletin, getAllBulletins, getBulletinById, updateBulletin, deleteBulletin } from '../controllers/bulletinController.js';
const router = express.Router();
router.post('/', createBulletin);
router.get('/', getAllBulletins);
router.get('/:id', getBulletinById);
router.put('/:id', updateBulletin);
router.delete('/:id', deleteBulletin);
export default router;
