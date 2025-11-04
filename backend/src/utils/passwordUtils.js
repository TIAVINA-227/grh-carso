// backend/src/utils/passwordUtils.js
import crypto from 'crypto';

/**
 * Génère un mot de passe temporaire sécurisé
 * @param {number} length - Longueur du mot de passe (défaut: 12)
 * @returns {string} Mot de passe généré
 */
export const genererMotDePasseTemporaire = (length = 12) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  
  // S'assurer qu'on a au moins un caractère de chaque type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Remplir le reste aléatoirement
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mélanger les caractères
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Génère un token de réinitialisation sécurisé
 * @returns {string} Token hexadécimal
 */
export const genererTokenReset = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Valide la force d'un mot de passe
 * @param {string} password - Le mot de passe à valider
 * @returns {Object} Résultat de la validation
 */
export const validerMotDePasse = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default {
  genererMotDePasseTemporaire,
  genererTokenReset,
  validerMotDePasse
};