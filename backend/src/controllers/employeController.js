
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
    const result = await employeService.deleteEmploye(req.params.id);
    res.status(200).json({ message: 'Employé supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les départements
export const getAllDepartements = async (req, res) => {
  try {
    const departements = await employeService.getAllDepartements();
    res.status(200).json(departements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les postes
export const getAllPostes = async (req, res) => {
  try {
    const postes = await employeService.getAllPostes();
    res.status(200).json(postes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
