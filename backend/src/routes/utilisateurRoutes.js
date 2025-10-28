import express from "express";
import {
  createUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById,
  updateUtilisateur,
  deleteUtilisateur
} from "../controllers/utilisateurController.js";

const router = express.Router();

router.post("/", createUtilisateur);
router.get("/", getAllUtilisateurs);
router.get("/:id", getUtilisateurById);
router.put("/:id", updateUtilisateur);
router.delete("/:id", deleteUtilisateur);

export default router;
