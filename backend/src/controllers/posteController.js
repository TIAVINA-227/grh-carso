// src/controllers/posteController.js
import * as posteService from '../services/posteService.js';

export const createPoste = async (req, res) => {
	try {
		const poste = await posteService.createPoste(req.body);
		res.status(201).json(poste);
	} catch (error) {
		console.error('createPoste error', error);
		res.status(500).json({ message: error.message });
	}
};

export const getAllPostes = async (req, res) => {
	try {
		const postes = await posteService.getAllPostes();
		res.status(200).json(postes);
	} catch (error) {
		console.error('getAllPostes error', error);
		res.status(500).json({ message: error.message });
	}
};

export const getPosteById = async (req, res) => {
	try {
		const poste = await posteService.getPosteById(req.params.id);
		if (!poste) return res.status(404).json({ message: 'Poste non trouvé' });
		res.status(200).json(poste);
	} catch (error) {
		console.error('getPosteById error', error);
		res.status(500).json({ message: error.message });
	}
};

export const updatePoste = async (req, res) => {
	try {
		const poste = await posteService.updatePoste(req.params.id, req.body);
		if (!poste) return res.status(404).json({ message: 'Poste non trouvé' });
		res.status(200).json(poste);
	} catch (error) {
		console.error('updatePoste error', error);
		res.status(500).json({ message: error.message });
	}
};

export const deletePoste = async (req, res) => {
	try {
		const poste = await posteService.deletePoste(req.params.id);
		res.status(200).json({ message: 'Poste supprimé avec succès' });
	} catch (error) {
		console.error('deletePoste error', error);
		res.status(500).json({ message: error.message });
	}
};

