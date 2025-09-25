import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return(
    <Router>
      <Routes>
        {/* Page de login */}
        <Route path="/login" element={<Login />}/>

        {/* Dashbord Protege */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard/> : <Navigate to="/login" />} />

        {/* Par defaut -> redirection vers login si pas connecte */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;