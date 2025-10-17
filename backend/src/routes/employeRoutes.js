import express from "express";
import { getEmployes, getEmployeById,getAllEmployes } from "../controllers/employeController.js";

const router = express.Router();

router.get("/", getAllEmployes);
router.get("/:id", getEmployeById);

export default router;
