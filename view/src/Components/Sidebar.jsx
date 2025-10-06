import React from 'react';
import { Home, Users, FileText, Calendar, Clock, BarChart, Briefcase, DollarSign } from 'lucide-react';
import { NavLink } from 'react-router-dom'; // Nécessite React Router
import CarsoLogo from "../assets/carso1.png";

const navItems = [
  { name: 'Dashboard', icon: Home, link: '/dashboard' },
  { name: 'Employés', icon: Users, link: '/employees' },
  { name: 'Contrats', icon: FileText, link: '/contrats' },
  { name: 'Absences', icon: Calendar, link: '/absences' },
  { name: 'Présences', icon: Clock, link: '/presences' },
  { name: 'Performances', icon: BarChart, link: '/performances' },
  { name: 'Postes', icon: Briefcase, link: '/postes' },
  { name: 'Congés', icon: Calendar, link: '/conges' },
  { name: 'Départements', icon: Users, link: '/departements' },
  { name: 'Paiements', icon: DollarSign, link: '/paiements' },
  { name: 'Bulletins', icon: FileText, link: '/bulletins' },
  { name: 'Deconnexion', icon: Home, link: '/login'},
];
const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-55 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="flex items-center justify-center h-22 border-b border-gray-200">
        {/* L'endroit où vous avez le logo CARSO en haut à gauche */}
        {/*<span className="text-xl font-bold text-blue-900">CARSO</span>*/}
        <img
            src={CarsoLogo}
            alt="CARSO Logo"
            className="h-30 w-auto mb-6 ml-1 mt-6.5"
          />
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg my-1 transition-colors duration-200 ${
                isActive ? 'bg-gray-100 text-blue-900 font-semibold border-l-4 border-blue-950' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      {/* Section utilisateur en bas (Jean Dupont) */}
      <div className="p-4 border-t border-gray-200">
         <div className="flex items-center">
            {/* ... icône/photo de Jean Dupont */}
            <div className="ml-3 text-sm">
                <p className="font-semibold text-gray-900">Jean Dupont</p>
                <p className="text-xs text-gray-500">Admin</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;