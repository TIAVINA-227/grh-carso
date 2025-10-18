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


// src/controllers/employeController.js
import * as employeService from '../services/employeService.js';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Créer un employé
export const createEmploye = async (req, res) => {
  try {
    const employe = await employeService.createEmploye(req.body);
    res.status(201).json(employe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les employés
export const getAllEmployes = async (req, res) => {
  try {
    const employes = await employeService.getAllEmployes();
    res.status(200).json(employes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un employé par ID
export const getEmployeById = async (req, res) => {
  try {
    const employe = await employeService.getEmployeById(req.params.id);
    if (!employe) return res.status(404).json({ message: 'Employé non trouvé' });
    res.status(200).json(employe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un employé
export const updateEmploye = async (req, res) => {
  try {
    const employe = await employeService.updateEmploye(req.params.id, req.body);
    if (!employe) return res.status(404).json({ message: 'Employé non trouvé' });
    res.status(200).json(employe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un employé
export const deleteEmploye = async (req, res) => {
  try {
    const employe = await employeService.deleteEmploye(req.params.id);
    if (!employe) return res.status(404).json({ message: 'Employé non trouvé' });
    res.status(200).json({ message: 'Employé supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
