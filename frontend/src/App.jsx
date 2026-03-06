import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, useLocation, Navigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { Toaster } from "sonner";
import Page from "./pages/Dashboard";
import EmployesPage from "./pages/Employes";
import Contrats from "./pages/Contrats";
import Absences from "./pages/Absences";
import Presences from "./pages/Presences";
import Postes from "./pages/Postes";
import Conges from "./pages/Conges";
import Departements from "./pages/Departements";
import Paiments from "./pages/Paiments";
import Bulletins from "./pages/Bulletins";
import Performances from "./pages/Performances";
import UtilisateursPage from "./pages/Utilisateurs";
import ProfilPage from "./pages/Profil";
import NotificationsPage from "./pages/Notifications";
import Sessions from "./pages/Sessions";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import TableauDeBord from "./pages/TableauDeBord";

function AppContainer() {
  const location = useLocation();
  const { user, isLoading, updateUser } = useAuth();
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  
  const isAuthPage = location.pathname === "/";

  //  Vérifier la première connexion
  useEffect(() => {
    console.log(" Vérification première connexion...");
    console.log("User:", user);
    console.log("premiere_connexion:", user?.premiere_connexion);
    console.log("premiereConnexion:", user?.premiereConnexion);
    
    if (user && (user.premiere_connexion === true || user.premiereConnexion === true)) {
      console.log(" PREMIÈRE CONNEXION DÉTECTÉE - Affichage du modal");
      setShowFirstLoginModal(true);
    } else {
      setShowFirstLoginModal(false);
    }
  }, [user]);

  // Callback après changement de mot de passe
  const handlePasswordChanged = () => {
    console.log(" Mot de passe changé - Mise à jour user");
    
    // Mettre à jour le statut première connexion
    updateUser({ 
      premiere_connexion: false, 
      premiereConnexion: false 
    });
    
    setShowFirstLoginModal(false);
    
    // Optionnel: recharger pour rafraîchir le token
    // window.location.reload();
  };

  // Afficher loader pendant chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isAuthPage
          ? "bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
          : "min-h-svh w-full"
      }
    >
      {/*  Modal première connexion - Affiché en priorité */}
      {showFirstLoginModal && user && (
        <ChangePasswordModal
          open={showFirstLoginModal}
          userId={user.id}
          isFirstLogin={true}
          onPasswordChanged={handlePasswordChanged}
        />
      )}

      <div className={isAuthPage ? "w-full max-w-sm md:max-w-4xl" : "w-full"}>
        <Routes>
          <Route path="/" element={<LoginForm />} />

          <Route path="/dashboard" element={<Page />}>
            <Route 
              index 
              element={
                <ProtectedRoute routeName="tableau-de-bord">
                  <TableauDeBord/>
                </ProtectedRoute>
              } 
            />
            <Route
              path="employes"
              element={
                <ProtectedRoute routeName="employes">
                  <EmployesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="contrats"
              element={
                <ProtectedRoute routeName="contrats">
                  <Contrats />
                </ProtectedRoute>
              }
            />
            <Route
              path="absences"
              element={
                <ProtectedRoute routeName="absences">
                  <Absences />
                </ProtectedRoute>
              }
            />
            <Route
              path="presences"
              element={
                <ProtectedRoute routeName="presences">
                  <Presences />
                </ProtectedRoute>
              }
            />
            <Route
              path="performances"
              element={
                <ProtectedRoute routeName="performances">
                  <Performances />
                </ProtectedRoute>
              }
            />
            <Route
              path="postes"
              element={
                <ProtectedRoute routeName="postes">
                  <Postes />
                </ProtectedRoute>
              }
            />
            <Route
              path="conges"
              element={
                <ProtectedRoute routeName="conges">
                  <Conges />
                </ProtectedRoute>
              }
            />
            <Route
              path="departements"
              element={
                <ProtectedRoute routeName="departements">
                  <Departements />
                </ProtectedRoute>
              }
            />
            <Route
              path="paiements"
              element={
                <ProtectedRoute routeName="paiements">
                  <Paiments />
                </ProtectedRoute>
              }
            />
            <Route
              path="bulletins"
              element={
                <ProtectedRoute routeName="bulletins">
                  <Bulletins />
                </ProtectedRoute>
              }
            />
            <Route
              path="utilisateurs"
              element={
                <ProtectedRoute routeName="utilisateurs">
                  <UtilisateursPage />
                </ProtectedRoute>
              }
            />
            <Route path="profil" element={<ProfilPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route
              path="sessions"
              element={
                <ProtectedRoute routeName="sessions">
                  <Sessions />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppContainer />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;