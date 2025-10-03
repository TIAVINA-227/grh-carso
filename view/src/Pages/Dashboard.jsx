import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("❌ Pas de token, redirection vers login");
        navigate("/login");
        return;
      }

      try {
        console.log("🔄 Chargement du dashboard...");
        
        const response = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log("📊 Réponse dashboard:", response.status);

        if (response.status === 404) {
          setError("❌ Route /api/dashboard non trouvée. Vérifie le backend.");
          return;
        }

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Données dashboard:", data);

        if (data.success) {
          setMessage(data.message);
          setUser(data.user);
        } else {
          setError(data.error || "Erreur inconnue");
        }

      } catch (err) {
        console.error("💥 Erreur dashboard:", err);
        setError("Impossible de charger le dashboard: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0F2F1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c4d44] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F2F1] flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-[#1c4d44] mb-4 text-center">Dashboard fa way CARSO</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Erreur:</strong> {error}
          </div>
        )}

        {message && (
          <p className="text-lg text-green-600 mb-4 text-center">{message}</p>
        )}

        {user && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Informations utilisateur</h2>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Nom:</strong> {user.nom_utilisateur}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rôle:</strong> {user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 font-semibold"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
