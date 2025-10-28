// src/App.jsx
import React from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { Toaster } from "sonner";
import { AuthProvider } from "./hooks/useAuth";
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
import Utilisateurs from "./pages/Utilisateurs";




function AppContainer() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <div
      className={
        isAuthPage
          ? "bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
          : "min-h-svh w-full"
      }
    >
      <div className={isAuthPage ? "w-full max-w-sm md:max-w-4xl" : "w-full"}>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<SignupForm />} />

          {/* Routes protégées */}
          <Route path="/dashboard" element={<Page />}>
              <Route path="employes" element={<EmployesPage />} />
              <Route path="contrats" element={<Contrats />} />
              <Route path="absences" element={<Absences />} />
              <Route path="presences" element={<Presences />} />
              <Route path ="performances" element={<Performances />} />
              <Route path="postes" element={<Postes />} />
              <Route path="conges" element={<Conges />} />
              <Route path="departements" element={<Departements />} />
              <Route path="paiements" element={<Paiments />} />
              <Route path="bulletins" element={<Bulletins />} />
              <Route path="utilisateurs" element={<Utilisateurs />} />
            </Route>
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContainer />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
