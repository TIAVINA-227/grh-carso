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
    viewOwn: [ROLES.EMPLOYE] // L'employé voit son contrat
  },
  
  // Gestion des absences
  absences: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYE],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    viewOwn: [ROLES.EMPLOYE]
  },
  
  // Gestion des présences
  presences: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    viewOwn: [ROLES.EMPLOYE]
  },
  
  // Gestion des congés
  conges: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYE],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    approve: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    viewOwn: [ROLES.EMPLOYE]
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
    viewOwn: [ROLES.EMPLOYE]
  },
  
  // Gestion des bulletins
  bulletins: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
    viewOwn: [ROLES.EMPLOYE]
  },
  
  // Gestion des performances
  performances: {
    view: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    edit: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
    viewOwn: [ROLES.EMPLOYE]
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