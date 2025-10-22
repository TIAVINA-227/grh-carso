import * as departementService from '../services/departementService.js';

export const createDepartement = async (req, res) => {
  try {
    const d = await departementService.createDepartement(req.body);
    res.status(201).json(d);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllDepartements = async (req, res) => {
  try {
    const list = await departementService.getAllDepartements();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getDepartementById = async (req, res) => {
  try {
    const d = await departementService.getDepartementById(req.params.id);
    if (!d) return res.status(404).json({ message: 'Departement non trouvé' });
    res.json(d);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateDepartement = async (req, res) => {
  try {
    const d = await departementService.updateDepartement(req.params.id, req.body);
    res.json(d);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteDepartement = async (req, res) => {
  try {
    await departementService.deleteDepartement(req.params.id);
    res.json({ message: 'Supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
