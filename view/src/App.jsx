import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/";
import Dashboard from "./Pages/Dashboard/";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Login />} /> {/* Redirection par défaut */}
      </Routes>
    </Router>
  );
}

export default App;
