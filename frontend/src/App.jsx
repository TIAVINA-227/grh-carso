// // src/App.jsx
// import React from "react";
// import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
// import { LoginForm } from "@/components/login-form";
// import { SignupForm } from "@/components/signup-form";
// import { Toaster } from "sonner";
// import Page from "./pages/Dashboard";
// import EmployesPage from "./pages/Employes";
// import Contrats from "./pages/Contrats";
// import Absences from "./pages/Absences";
// import Presences from "./pages/Presences"; 
// import Postes from "./pages/Postes";
// import Conges from "./pages/Conges";
// import Departements from "./pages/Departements";
// import Paiments from "./pages/Paiments";
// import Bulletins from "./pages/Bulletins";
// import Performances from "./pages/Performances";
// import Utilisateurs from "./pages/Utilisateurs";
// import { AuthProvider } from "./hooks/useAuth";
// import UtilisateursPage from "./pages/Utilisateurs";


// function AppContainer() {
//   const location = useLocation();
//   const isAuthPage =
//     location.pathname === "/" || location.pathname === "/register";

//   return (
//     <div
//       className={
//         isAuthPage
//           ? "bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
//           : "min-h-svh w-full"
//       }
//     >
//       <div className={isAuthPage ? "w-full max-w-sm md:max-w-4xl" : "w-full"}>
//         <Routes>
//           {/* Auth routes */}
//           <Route path="/" element={<LoginForm />} />
//           <Route path="/register" element={<SignupForm />} />

//           {/* Routes protégées */}
//           <Route path="/dashboard" element={<Page />}>
//               <Route path="employes" element={<EmployesPage />} />
//               <Route path="contrats" element={<Contrats />} />
//               <Route path="absences" element={<Absences />} />
//               <Route path="presences" element={<Presences />} />
//               <Route path ="performances" element={<Performances />} />
//               <Route path="postes" element={<Postes />} />
//               <Route path="conges" element={<Conges />} />
//               <Route path="departements" element={<Departements />} />
//               <Route path="paiements" element={<Paiments />} />
//               <Route path="bulletins" element={<Bulletins />} />
//               <Route path="utilisateurs" element={<UtilisateursPage />} />
//             </Route>
//         </Routes>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppContainer />
//         <Toaster />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
// src/App.jsx
import React from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
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
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

function AppContainer() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/";

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
          {/* Route de connexion uniquement */}
          <Route path="/" element={<LoginForm />} />

          {/* Routes protégées */}
          <Route path="/dashboard" element={<Page />}>
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

          </Route>
          
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppContainer />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;