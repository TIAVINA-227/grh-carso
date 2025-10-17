// src/controllers/employeController.js
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// export const getEmployes = async (req, res) => {
//   try {
//     const employes = await prisma.employe.findMany({
//       orderBy: { id: "desc" },
//     });
//     res.json({ data: employes });
//   } catch (error) {
//     console.error("Erreur lors de la récupération :", error);a
//     res.status(500).json({ message: "Erreur serveur" });    
//   }
// };

// export const getEmployeById = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     const employe = await prisma.employe.findUnique({ where: { id } });
//     if (!employe)
//       return res.status(404).json({ message: "Employé non trouvé" });
//     res.json(employe);
//   } catch (error) {
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };

// export const getAllEmployes = async (req, res) => {
//   try {
//     const employes = await prisma.employe.findMany();   
//     res.json(employes);
//   } catch (error) {
//     console.error("Erreur lors de la récupération des employés :", error);
//     res.status(500).json({ message: "Erreur serveur" });
//   } };

import * as employeService from "../services/employeService.js";

// ➕ Créer un employé
export const createEmployes = async (req, res, next) => {
  try {
    const employes = await employeService.createEmploye(req.body);
    res.status(201).json(employes);
  } catch (error) {
    next(error);
  }
};

// 📋 Récupérer tous les employés
export const getEmployes = async (req, res, next) => {
  try {
    const employes = await employeService.getEmployes();
    res.json(employes);
  } catch (error) {
    next(error);
  }
};

// 🔍 Récupérer un employé par ID
export const getEmployeById = async (req, res, next) => {
  try {
    const employe = await employeService.getEmployeById(parseInt(req.params.id));
    if (!employe) return res.status(404).json({ message: "Employé non trouvé" });
    res.json(employe);
  } catch (error) {
    next(error);
  }
};

// ✏️ Modifier un employé
export const updateEmploye = async (req, res, next) => {
  try {
    const employe = await employeService.updateEmploye(parseInt(req.params.id), req.body);
    res.json(employe);
  } catch (error) {
    next(error);
  }
};

// ❌ Supprimer un employé
export const deleteEmploye = async (req, res, next) => {
  try {
    await employeService.deleteEmploye(parseInt(req.params.id));
    res.json({ message: "Employé supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};
