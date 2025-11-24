// ========================================
// Corrections pour backend/src/controllers/absenceController.js
// ========================================
import * as absenceService from '../services/absenceService.js';

export const createAbsence = async (req, res) => {
  try {
    console.log('📥 Données reçues:', req.body);
    
    // ✅ Validation des champs requis
    const { employeId, date_debut, date_fin, type_absence } = req.body;
    
    if (!employeId) {
      return res.status(400).json({ 
        message: 'employeId est requis' 
      });
    }
    
    if (!date_debut) {
      return res.status(400).json({ 
        message: 'date_debut est requis' 
      });
    }
    
    if (!date_fin) {
      return res.status(400).json({ 
        message: 'date_fin est requis' 
      });
    }

    const absence = await absenceService.createAbsence(req.body);
    res.status(201).json(absence);
  } catch (error) {
    console.error('❌ Erreur création absence:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllAbsences = async (req, res) => {
  try {
    const { period } = req.query;
    const absences = await absenceService.getAllAbsences({ period });
    res.json(absences);
  } catch (error) {
    console.error('❌ Erreur récupération absences:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAbsenceById = async (req, res) => {
  try {
    const absence = await absenceService.getAbsenceById(req.params.id);
    if (!absence) {
      return res.status(404).json({ message: 'Absence non trouvée' });
    }
    res.json(absence);
  } catch (error) {
    console.error('❌ Erreur récupération absence:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateAbsence = async (req, res) => {
  try {
    const absence = await absenceService.updateAbsence(req.params.id, req.body);
    res.json(absence);
  } catch (error) {
    console.error('❌ Erreur mise à jour absence:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAbsence = async (req, res) => {
  try {
    await absenceService.deleteAbsence(req.params.id);
    res.json({ message: 'Absence supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression absence:', error);
    res.status(500).json({ message: error.message });
  }
};