// backend/src/config/congesRules.js
export const CONGES_RULES = {
  "Congé annuel": {
    joursParMois: 2.5,
    joursParAn: 30,
    maxConsecutif: 30,
    couleur: "blue"
  },
  "Congé maladie": {
    joursParAn: 15,
    requireJustificatif: true,
    couleur: "red"
  },
  "Congé maternité": {
    joursTotal: 98,
    unique: true,
    couleur: "pink"
  },
  "Congé paternité": {
    joursTotal: 10,
    unique: true,
    couleur: "cyan"
  },
  "Congé sans solde": {
    illimite: true,
    requireApprobation: true,
    couleur: "gray"
  },
  "Événement familial - Mariage": {
    joursTotal: 3,
    couleur: "purple"
  },
  "Événement familial - Décès": {
    joursTotal: 3,
    couleur: "gray"
  },
  "Événement familial - Naissance": {
    joursTotal: 3,
    couleur: "green"
  },
  "RTT": {
    joursParAn: 12,
    couleur: "orange"
  },
  "Formation": {
    requireApprobation: true,
    couleur: "teal"
  }
};

/**
 * Calculer le solde de congés annuels basé sur l'ancienneté
 * Madagascar : 2,5 jours par mois travaillé (max 30 jours/an)
 */
export const calculateSoldeConges = (dateEmbauche) => {
  const now = new Date();
  const embauche = new Date(dateEmbauche);
  const moisTravailles = Math.floor((now - embauche) / (1000 * 60 * 60 * 24 * 30));
  
  return Math.min(moisTravailles * 2.5, 30);
};

/**
 * Valider une demande de congé selon les règles
 */
export const validateConge = (typeConge, duree, soldeRestant, congesPris) => {
  const rules = CONGES_RULES[typeConge];
  
  if (!rules) {
    return { valid: false, message: "Type de congé invalide" };
  }
  
  // Congé sans solde : toujours valide (si approuvé)
  if (rules.illimite) {
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