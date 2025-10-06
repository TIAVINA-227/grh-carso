import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white h-22 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      
      {/* Barre de Recherche */}
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-64 p-2 pl-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          />
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Actions et Profil */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:text-gray-900 relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Menu déroulant de l'utilisateur */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img 
                src="URL_TO_USER_AVATAR" // Remplacez par l'URL réelle de l'avatar
                alt="Profil" 
                className="h-9 w-9 rounded-full object-cover border-2 border-gray-100"
            />
            <span className="font-medium text-gray-700 hidden sm:block">Jean Dupont</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
              <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User className="h-4 w-4 mr-2" />
                Mon Compte
              </a>
              <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="h-4 w-4 mr-2" />
                Profil
              </a>
              <hr className="my-1" />
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion...
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;