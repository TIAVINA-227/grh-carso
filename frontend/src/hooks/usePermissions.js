// frontend/src/hooks/usePermissions.js
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { hasPermission, canAccessRoute, ROLES } from '../config/permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  // RETOURNER DIRECTEMENT L'OBJET (pas {permissions: {...}})
  return useMemo(() => {
    if (!user || !user.role) {
      return {
        canView: () => false,
        canCreate: () => false,
        canEdit: () => false,
        canUpdate: () => false,
        canDelete: () => false,
        canApprove: () => false,
        canViewOwn: () => false,
        canPointer: () => false,
        canDeclare: () => false,
        canRequest: () => false,
        canList: () => false,
        canAccess: () => false,
        isSuperAdmin: false,
        isAdmin: false,
        isEmploye: false,
        role: null,
        user: null
      };
    }

    return {
      // Vérifier une permission spécifique
      canView: (module) => hasPermission(user.role, module, 'view'),
      canCreate: (module) => hasPermission(user.role, module, 'create'),
      canEdit: (module) => hasPermission(user.role, module, 'edit'),
      canUpdate: (module) => hasPermission(user.role, module, 'edit'),
      canDelete: (module) => hasPermission(user.role, module, 'delete'),
      canApprove: (module) => hasPermission(user.role, module, 'approve'),
      canViewOwn: (module) => hasPermission(user.role, module, 'viewOwn'),
      // Nouvelles permissions spécifiques
      canPointer: (module) => hasPermission(user.role, module, 'pointer'),
      canDeclare: (module) => hasPermission(user.role, module, 'declare'),
      canRequest: (module) => hasPermission(user.role, module, 'request'),
      canList: (module) => hasPermission(user.role, module, 'list'),
      
      // Vérifier l'accès à une route
      canAccess: (routeName) => canAccessRoute(user.role, routeName),
      
      // Vérifier le rôle directement
      isSuperAdmin: user.role === ROLES.SUPER_ADMIN,
      isAdmin: user.role === ROLES.ADMIN,
      isEmploye: user.role === ROLES.EMPLOYE,
      
      // Rôle actuel
      role: user.role,
      
      // Utilisateur complet
      user: user
    };
  }, [user]);
};