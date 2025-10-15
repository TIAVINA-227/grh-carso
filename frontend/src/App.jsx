import React from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/login-form"; // ton LoginForm.jsx
import { SignupForm } from "@/components/signup-form"; // ton composant RegisterForm
import Dashboard from "./pages/Dashboard"; // ton composant Dashboard
import EmployesPage from "./pages/Employes"; // page Employés
import ProtectedLayout from "./components/ProtectedLayout";
import { Toaster } from "sonner";





function AppContainer() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <div className={
      isAuthPage
        ? "bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
        : "min-h-svh w-full"
    }>
      <div className={isAuthPage ? "w-full max-w-sm md:max-w-4xl" : "w-full"}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<SignupForm />} />

          {/* Protected routes - require server verification */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employes" element={<EmployesPage />} />
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
      <Toaster/>
    </BrowserRouter>
  );
}

export default App;
