// frontend/src/config/permissions.js

// ✅ Définition des rôles
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EMPLOYE: 'EMPLOYE'
};

// ✅ Définition des permissions par module
export const PERMISSIONS = {
  // Gestion des utilisateurs
  utilisateurs: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN]
  },
  
  // Gestion des employés
  employes: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
    viewOwn: [ROLES.EMPLOYE] // L'employé voit son propre profil
  },
  
  // Gestion des contrats
  contrats: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
    viewOwn: [ROLES.EMPLOYE], // L'employé voit uniquement son contrat
    list: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Pour lister tous les contrats
  },
  
  // Gestion des absences
  absences: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    viewOwn: [ROLES.EMPLOYE],
    declare: [ROLES.EMPLOYE], // L'employé peut déclarer ses absences
    list: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Pour lister toutes les absences
  },
  
  // Gestion des présences
  presences: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    viewOwn: [ROLES.EMPLOYE],
    pointer: [ROLES.EMPLOYE], // L'employé peut pointer sa présence
    list: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Pour lister toutes les présences
  },
  
  // Gestion des congés
  conges: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    approve: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    viewOwn: [ROLES.EMPLOYE],
    request: [ROLES.EMPLOYE], // L'employé peut faire des demandes de congés
    list: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Pour lister tous les congés
  },
  
  // Gestion des départements
  departements: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN]
  },
  
  // Gestion des postes
  postes: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN]
  },
  
  // Gestion des paiements
  paiements: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
    viewOwn: [ROLES.EMPLOYE], // L'employé voit uniquement ses paiements
    list: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Pour lister tous les paiements
  },
  
  // Gestion des bulletins
  bulletins: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
    viewOwn: [ROLES.EMPLOYE], // L'employé voit uniquement ses bulletins
    list: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Pour lister tous les bulletins
  },
  
  // Gestion des performances
  performances: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
    viewOwn: [ROLES.EMPLOYE], // L'employé voit uniquement ses performances
    list: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Pour lister toutes les performances
  }
};

// ✅ Fonction pour vérifier si un rôle a une permission
export const hasPermission = (userRole, module, action) => {
  if (!PERMISSIONS[module] || !PERMISSIONS[module][action]) {
    return false;
  }
  return PERMISSIONS[module][action].includes(userRole);
};

// ✅ Mapping des routes vers les modules
export const ROUTE_MODULES = {
  'employes': 'employes',
  'contrats': 'contrats',
  'absences': 'absences',
  'presences': 'presences',
  'conges': 'conges',
  'departements': 'departements',
  'postes': 'postes',
  'paiements': 'paiements',
  'bulletins': 'bulletins',
  'performances': 'performances',
  'utilisateurs': 'utilisateurs'
};

// ✅ Fonction pour vérifier l'accès à une route
export const canAccessRoute = (userRole, routeName) => {
  const module = ROUTE_MODULES[routeName];
  if (!module) return true; // Si pas de mapping, accès par défaut
  
  // Vérifier si l'utilisateur a au moins une permission (view ou viewOwn)
  return hasPermission(userRole, module, 'view') || 
         hasPermission(userRole, module, 'viewOwn');
};