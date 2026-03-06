// backend/src/controllers/presenceController.js

import * as presenceService from '../services/presenceService.js';

export const createPresence = async (req, res) => {
  try {
    console.log('📥 Données reçues:', req.body);
    
    // ✅ Validation des champs requis
    const { employeId, date_jour, statut, heures_travaillees } = req.body;
    
    if (!employeId) {
      return res.status(400).json({ 
        message: 'employeId est requis' 
      });
    }
    
    if (!date_jour) {
      return res.status(400).json({ 
        message: 'date_jour est requis' 
      });
    }
    
    if (!statut) {
      return res.status(400).json({ 
        message: 'statut est requis' 
      });
    }

    const presence = await presenceService.createPresence(req.body);
    res.status(201).json(presence);
  } catch (error) {
    console.error('❌ Erreur création présence:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllPresences = async (req, res) => {
  try {
    const { period } = req.query;
    const presences = await presenceService.getAllPresences({ period });
    res.json(presences);
  } catch (error) {
    console.error('❌ Erreur récupération présences:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPresenceById = async (req, res) => {
  try {
    const presence = await presenceService.getPresenceById(req.params.id);
    if (!presence) {
      return res.status(404).json({ message: 'Présence non trouvée' });
    }
    res.json(presence);
  } catch (error) {
    console.error('❌ Erreur récupération présence:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePresence = async (req, res) => {
  try {
    const presence = await presenceService.updatePresence(req.params.id, req.body);
    res.json(presence);
  } catch (error) {
    console.error('❌ Erreur mise à jour présence:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deletePresence = async (req, res) => {
  try {
    await presenceService.deletePresence(req.params.id);
    res.json({ message: 'Présence supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression présence:', error);
    res.status(500).json({ message: error.message });
  }
};