// backend/src/controllers/performanceController.js

import * as perfService from '../services/performanceService.js';

// Create
export const createPerformance = async (req, res) => {
    try {
        const performance = await perfService.createPerformance(req.body);
        res.status(201).json(performance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Read All
export const getAllPerformances = async (req, res) => {
    try {
        const performances = await perfService.getAllPerformances();
        res.json(performances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Read One
export const getPerformanceById = async (req, res) => {
    try {
        const performance = await perfService.getPerformanceById(req.params.id);

        if (!performance) {
            return res.status(404).json({ message: 'Non trouvé' });
        }

        res.json(performance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Update
export const updatePerformance = async (req, res) => {
    try {
        const updatedPerformance = await perfService.updatePerformance(
            req.params.id,
            req.body
        );

        res.json(updatedPerformance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Delete
export const deletePerformance = async (req, res) => {
    try {
        await perfService.deletePerformance(req.params.id);
        res.json({ message: 'Supprimé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
