// backend/src/utils/dateUtils.js

/**
 * Jours fériés à Madagascar (année fixe - peut être étendu pour calcul dynamique)
 * Source: Jours fériés officiels de Madagascar
 */
export const JOURS_FERIES_MADAGASCAR = [
  // Jours fériés fixes
  { mois: 1, jour: 1, nom: "Jour de l'An" },
  { mois: 3, jour: 29, nom: "Commémoration du 29 mars 1947" },
  { mois: 5, jour: 1, nom: "Fête du Travail" },
  { mois: 6, jour: 26, nom: "Fête Nationale - Jour de l'Indépendance" },
  { mois: 8, jour: 15, nom: "Assomption" },
  { mois: 11, jour: 1, nom: "Toussaint" },
  { mois: 12, jour: 25, nom: "Noël" },
  // Note: Les fêtes religieuses variables (Pâques, Ascension, Pentecôte, Fête-Dieu) 
  // peuvent être ajoutées avec calcul dynamique si nécessaire
];

/**
 * Vérifier si une date est un jour férié à Madagascar
 */
export const estJourFerie = (date) => {
  const dateObj = new Date(date);
  const mois = dateObj.getMonth() + 1; // getMonth() retourne 0-11
  const jour = dateObj.getDate();
  
  return JOURS_FERIES_MADAGASCAR.some(
    ferie => ferie.mois === mois && ferie.jour === jour
  );
};

/**
 * Vérifier si une date est un week-end (samedi ou dimanche)
 */
export const estWeekend = (date) => {
  const dateObj = new Date(date);
  const jourSemaine = dateObj.getDay(); // 0 = Dimanche, 6 = Samedi
  return jourSemaine === 0 || jourSemaine === 6;
};

/**
 * Calculer le nombre de jours ouvrés entre deux dates (excluant week-ends et jours fériés)
 * @param {Date|string} dateDebut - Date de début
 * @param {Date|string} dateFin - Date de fin (inclusive)
 * @returns {number} Nombre de jours ouvrés
 */
export const calculerJoursOuvres = (dateDebut, dateFin) => {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  
  // S'assurer que les dates sont au début de la journée
  debut.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);
  
  if (debut > fin) {
    throw new Error("La date de début doit être antérieure à la date de fin");
  }
  
  let joursOuvres = 0;
  const dateCourante = new Date(debut);
  
  // Parcourir chaque jour jusqu'à la date de fin (inclusive)
  while (dateCourante <= fin) {
    // Si ce n'est ni un week-end ni un jour férié, compter comme jour ouvré
    if (!estWeekend(dateCourante) && !estJourFerie(dateCourante)) {
      joursOuvres++;
    }
    
    // Passer au jour suivant
    dateCourante.setDate(dateCourante.getDate() + 1);
  }
  
  return joursOuvres;
};

/**
 * Calculer le nombre de jours calendaires entre deux dates (inclus)
 * @param {Date|string} dateDebut - Date de début
 * @param {Date|string} dateFin - Date de fin (inclusive)
 * @returns {number} Nombre de jours calendaires
 */
export const calculerJoursCalendaires = (dateDebut, dateFin) => {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  
  debut.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);
  
  const diffTime = fin - debut;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // +1 car on inclut le jour de début
};

/**
 * Obtenir le premier jour de l'année civile
 */
export const getDebutAnneeCivile = (annee = null) => {
  const an = annee || new Date().getFullYear();
  return new Date(an, 0, 1); // 1er janvier
};

/**
 * Obtenir le dernier jour de l'année civile
 */
export const getFinAnneeCivile = (annee = null) => {
  const an = annee || new Date().getFullYear();
  return new Date(an, 11, 31, 23, 59, 59, 999); // 31 décembre
};

/**
 * Calculer le nombre de mois complets entre deux dates (plus précis)
 * @param {Date|string} dateDebut - Date de début
 * @param {Date|string} dateFin - Date de fin
 * @returns {number} Nombre de mois complets
 */
export const calculerMoisComplets = (dateDebut, dateFin) => {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  
  const anneesDiff = fin.getFullYear() - debut.getFullYear();
  const moisDiff = fin.getMonth() - debut.getMonth();
  const joursDiff = fin.getDate() - debut.getDate();
  
  // Calculer le nombre total de mois
  let moisComplets = anneesDiff * 12 + moisDiff;
  
  // Si le jour de fin est avant le jour de début, soustraire un mois
  if (joursDiff < 0) {
    moisComplets--;
  }
  
  return Math.max(0, moisComplets);
};

