// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { AlertCircle } from 'lucide-react';

export const ProtectedRoute = ({ 
  children, 
  module,
  requireAuth = true,
  fallbackPath = '/'
}) => {
  const { user, isLoading } = useAuth();
  const permissions = usePermissions();

  // Afficher un loader pendant la vérification de l'auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est connecté
  if (requireAuth && !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Vérifier les permissions pour le module
  if (module && !permissions.canAccess(module)) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Accès refusé
              </h3>
              <p className="text-red-700">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                {permissions.isEmploye && (
                  <span className="block mt-2">
                    En tant qu'employé, vous avez accès uniquement à vos propres données.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};