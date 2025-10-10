import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Sun, Moon, User, LogOut } from "lucide-react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 transition-colors">
      {/* Barre de recherche */}
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50  pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4d44] focus:border-transparent dark:text-gray-200"
          />
        </div>
      </div>

      {/* Boutons d’action */}
      <div className="flex items-center gap-3">
        {/* Mode sombre */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Menu utilisateur */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <img
              src="https://i.pravatar.cc/100"
              alt="Profil"
              className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
            />
            <span className="font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
              Jean Dupont
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl py-2 z-20 animate-fadeIn">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full"
              >
                <User className="h-4 w-4 mr-2" />
                Profil
              </button>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
