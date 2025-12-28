// backend/src/config/congesRules.js
import { 
  calculerMoisComplets, 
  getDebutAnneeCivile, 
  getFinAnneeCivile 
} from '../utils/dateUtils.js';

export const CONGES_RULES = {
  "Congé annuel": {
    joursParMois: 2.5,
    joursParAn: 30,
    maxConsecutif: 30,
    maxReport: 6, // Maximum 6 jours reportables à l'année suivante
    couleur: "blue",
    utiliserJoursOuvres: false // Les congés annuels utilisent des jours calendaires
  },
  "Congé maladie": {
    joursParAn: 15,
    requireJustificatif: true,
    couleur: "red",
    utiliserJoursOuvres: false
  },
  "Congé maternité": {
    joursTotal: 98,
    unique: true,
    couleur: "pink",
    utiliserJoursOuvres: false
  },
  "Congé paternité": {
    joursTotal: 10,
    unique: true,
    couleur: "cyan",
    utiliserJoursOuvres: false
  },
  "Congé sans solde": {
    illimite: true,
    requireApprobation: true,
    couleur: "gray",
    utiliserJoursOuvres: false
  },
  "Événement familial - Mariage": {
    joursTotal: 3,
    couleur: "purple",
    utiliserJoursOuvres: false
  },
  "Événement familial - Décès": {
    joursTotal: 3,
    couleur: "gray",
    utiliserJoursOuvres: false
  },
  "Événement familial - Naissance": {
    joursTotal: 3,
    couleur: "green",
    utiliserJoursOuvres: false
  },
  "RTT": {
    joursParAn: 12,
    couleur: "orange",
    utiliserJoursOuvres: false
  },
  "Formation": {
    requireApprobation: true,
    couleur: "teal",
    utiliserJoursOuvres: false
  }
};

/**
 * Calculer le solde de congés annuels basé sur l'ancienneté
 * Madagascar : 2,5 jours par mois travaillé (max 30 jours/an)
 * Période de référence : Année civile (1er janvier - 31 décembre)
 * 
 * @param {Date|string} dateEmbauche - Date d'embauche de l'employé
 * @param {Date|string} dateReference - Date de référence (début de l'année civile par défaut)
 * @returns {number} Nombre de jours de congés annuels pour l'année en cours
 */
export const calculateSoldeConges = (dateEmbauche, dateReference = null) => {
  const embauche = new Date(dateEmbauche);
  const reference = dateReference ? new Date(dateReference) : getDebutAnneeCivile();
  
  // Si l'embauche est après le début de l'année de référence, calculer depuis l'embauche
  // Sinon, calculer depuis le début de l'année
  const dateDebutCalcul = embauche > reference ? embauche : reference;
  
  // Calculer les mois complets entre la date de début et la fin de l'année
  const finAnnee = getFinAnneeCivile(reference.getFullYear());
  const moisTravailles = calculerMoisComplets(dateDebutCalcul, finAnnee);
  
  // Calculer les jours de congés : 2,5 jours par mois (arrondi à l'entier supérieur pour chaque mois complet)
  const joursConges = Math.min(moisTravailles * 2.5, 30);
  
  return Math.ceil(joursConges); // Arrondir à l'entier supérieur
};

/**
 * Calculer le solde avec report des congés non pris de l'année précédente
 * @param {Date|string} dateEmbauche - Date d'embauche
 * @param {number} joursNonPrisAnneePrecedente - Jours non pris de l'année précédente (max 6)
 * @returns {number} Solde total incluant le report
 */
export const calculateSoldeAvecReport = (dateEmbauche, joursNonPrisAnneePrecedente = 0) => {
  const soldeAnneeCourante = calculateSoldeConges(dateEmbauche);
  const report = Math.min(joursNonPrisAnneePrecedente, CONGES_RULES["Congé annuel"].maxReport);
  
  return soldeAnneeCourante + report;
};

/**
 * Valider une demande de congé selon les règles
 * @param {string} typeConge - Type de congé
 * @param {number} duree - Durée en jours (ouvrés ou calendaires selon le type)
 * @param {number} soldeRestant - Solde restant pour ce type de congé
 * @param {Array} congesPris - Liste des congés déjà pris de l'année
 * @param {number} joursPrisType - Nombre de jours déjà pris pour ce type spécifique
 * @returns {Object} { valid: boolean, message: string }
 */
export const validateConge = (typeConge, duree, soldeRestant, congesPris = [], joursPrisType = 0) => {
  const rules = CONGES_RULES[typeConge];
  
  if (!rules) {
    return { valid: false, message: "Type de congé invalide" };
  }
  
  // Congé sans solde : vérifier qu'on a d'abord épuisé le solde annuel
  if (rules.illimite) {
    // Pour un congé sans solde, on peut permettre même avec solde restant
    // (l'employeur décide)
    return { valid: true };
  }
  
  // Vérifier le solde pour congé annuel
  if (typeConge === "Congé annuel") {
    if (duree > soldeRestant) {
      return { 
        valid: false, 
        message: `Solde insuffisant. Vous avez ${soldeRestant} jour(s) disponible(s)` 
      };
    }
    
    if (duree > rules.maxConsecutif) {
      return { 
        valid: false, 
        message: `Maximum ${rules.maxConsecutif} jours consécutifs autorisés` 
      };
    }
  }
  
  // ✅ Vérifier la limite annuelle pour congé maladie
  if (typeConge === "Congé maladie" && rules.joursParAn) {
    const totalPris = joursPrisType + duree;
    if (totalPris > rules.joursParAn) {
      const restant = Math.max(0, rules.joursParAn - joursPrisType);
      return { 
        valid: false, 
        message: `Limite annuelle de ${rules.joursParAn} jours atteinte. Il vous reste ${restant} jour(s)` 
      };
    }
  }
  
  // ✅ Vérifier la limite annuelle pour RTT
  if (typeConge === "RTT" && rules.joursParAn) {
    const totalPris = joursPrisType + duree;
    if (totalPris > rules.joursParAn) {
      const restant = Math.max(0, rules.joursParAn - joursPrisType);
      return { 
        valid: false, 
        message: `Limite annuelle de ${rules.joursParAn} jours RTT atteinte. Il vous reste ${restant} jour(s)` 
      };
    }
  }
  
  // Vérifier les congés uniques (maternité, paternité)
  if (rules.unique) {
    const anneeActuelle = new Date().getFullYear();
    const dejaPris = congesPris.find(c => 
      c.type_conge === typeConge && 
      c.statut === "APPROUVE" &&
      new Date(c.date_debut).getFullYear() === anneeActuelle
    );
    
    if (dejaPris) {
      return { 
        valid: false, 
        message: `${typeConge} déjà pris cette année` 
      };
    }
    
    if (duree > rules.joursTotal) {
      return { 
        valid: false, 
        message: `Maximum ${rules.joursTotal} jours autorisés pour ${typeConge}` 
      };
    }
  }
  
  // Vérifier les événements familiaux
  if (typeConge.includes("Événement familial")) {
    if (duree > rules.joursTotal) {
      return { 
        valid: false, 
        message: `Maximum ${rules.joursTotal} jours autorisés` 
      };
    }
  }
  
  return { valid: true };
};