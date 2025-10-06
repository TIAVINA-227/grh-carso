import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ pour rediriger après connexion
import CarsoLogo from "../assets/carso1.png";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [nom_utilisateur, setnom_utilisateur] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setmot_de_passe] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Connexion avec email + mot de passe
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          mot_de_passe: mot_de_passe,
        }),
      });

    const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email ou mot de passe incorrect");
        return;
      }


      // ✅ Stockage du token et des infos utilisateur
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Connexion réussie ! Bienvenue " + data.user.nom_utilisateur);

      // ✅ Redirection vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      setError("Impossible de se connecter au serveur.");
    }
  };

  // ✅ Inscription
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom_utilisateur: nom_utilisateur.trim(),
          email: email.trim().toLowerCase(),
          mot_de_passe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      alert(data.message || "Inscription réussie ! Veuillez vous connecter.");
      setIsSignUp(false);

      // ✅ Réinitialiser les champs
      setnom_utilisateur("");
      setEmail("");
      setmot_de_passe("");
    } catch (err) {
      console.error("Erreur inscription :", err);
      setError("Impossible de s'inscrire pour le moment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f7] flex items-center justify-center font-sans">
      <div className="flex flex-row md:flex-rox w-full max-w-4xl bg-white shadow-log rounded-xl overflow-hidden m-2">
        {/* Partie gauche */}
        <div className="hidden md:flex md:w-1/2 p-8 bg-gradient-to-br from-[#eff3f6] to-[#013293] items-center justify-center flex-col text-center">
          <div className="w-50 h-50 bg-white rounded-full flex items-center justify-center mb-6">
            <img
              src={CarsoLogo}
              alt="CARSO Logo"
              className="h-48 w-auto mb-6 ml-1 mt-7"
            />
          </div>
          <h1 className="text-5xl font-bold text-[#082154] mb-4">CARSO</h1>
          <p className="tex-lg text-gray-800 leadind-relaxed max-w-md">
            Bienvenue sur notre plateforme de gestion des ressources humaines.
            Accédez facilement à votre compte ou créez-en un nouveau.
          </p>
        </div>

        {/* Partie droite */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-[#f8fbfb]">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-semibold text-[#03266e] mb-2">
              {isSignUp ? "Créer un compte" : "Welcome"}
            </h2>
            {/*<p className="text-gray-600 text-lg flex items-center justify-center">
              <span className="mr-1 text-2xl">🔐</span>
              {isSignUp ? "Sign Up" : "Login"}
            </p>*/}
          </div>

          {/* Formulaire LOGIN */}
          {!isSignUp && (
            <form onSubmit={handleLogin} className="w-full max-w-sm">
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="User Email"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013293]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <input
                  type="password" // ✅ corrigé
                  placeholder="Mot de passe"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013293]"
                  value={mot_de_passe}
                  onChange={(e) => setmot_de_passe(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between mb-6 text-sm">
                <label className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2 accent-[#013293]"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Stay signed in
                </label>
                <a href="#" className="text-[#013293] hover:underline">
                  Forgot password?
                </a>
              </div>

              {error && (
                <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#1951c1] text-white py-3 rounded-lg hover:bg-[#013293] transition duration-300 ease-in-out font-semibold text-lg"
              >
                LOGIN
              </button>

              <p className="text-sm text-center mt-4">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-[#013293] font-semibold"
                >
                  S’inscrire
                </button>
              </p>
            </form>
          )}

          {/* Formulaire SIGNUP */}
          {isSignUp && (
            <form onSubmit={handleSignUp} className="w-full max-w-sm">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013293]"
                  value={nom_utilisateur}
                  onChange={(e) => setnom_utilisateur(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013293]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <input
                  type="password" 
                  placeholder="Mot de passe"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013293]"
                  value={mot_de_passe}
                  onChange={(e) => setmot_de_passe(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 text-white  py-3 rounded-lg hover:bg-green-800 transition duration-300 ease-in-out font-semibold text-lg"
              >
                SIGN UP
              </button>

              <p className="text-sm text-center mt-4">
                Déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-[#013293] font-semibold"
                >
                  Se connecter
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
