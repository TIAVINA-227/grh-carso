// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Topbar from "@/components/topbar";
import { useAuth } from "@/hooks/useAuth";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";

export default function Page() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    // Attendre la fin du chargement
    if (isLoading) {
      console.log('Chargement...');
      return;
    }

    // Rediriger SEULEMENT si pas d'utilisateur
    if (!user) {
      console.log('❌ Pas d\'utilisateur, redirection vers login');
      navigate("/", { replace: true });
      return;
    }

    console.log('Utilisateur chargé:', user.email);

    // Vérifier première connexion
    const checkFirstLogin = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json"
          },
        });

        if (response.ok) {
          const userData = await response.json();
          
          if (userData.premiere_connexion === true) {
            console.log('⚠️ Première connexion - Modal affiché');
            setIsFirstLogin(true);
            setShowPasswordModal(true);
          }
        }
      } catch (error) {
        console.error("Erreur vérification:", error);
      }
    };

    checkFirstLogin();
  }, [user, isLoading, navigate]);

  const handlePasswordChanged = () => {
    console.log('Mot de passe changé');
    setShowPasswordModal(false);
    setIsFirstLogin(false);
  };

  // Afficher loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si pas d'utilisateur
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>

      {showPasswordModal && (
        <ChangePasswordModal
          open={showPasswordModal}
          userId={user.id}
          isFirstLogin={isFirstLogin}
          onPasswordChanged={handlePasswordChanged}
        />
      )}
    </SidebarProvider>
  );
}