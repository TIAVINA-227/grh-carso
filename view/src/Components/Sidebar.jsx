import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Calendar,
  Clock,
  BarChart,
  Briefcase,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CarsoLogo from "../assets/carso1.png";

const navItems = [
  { name: "Dashboard", icon: Home, link: "/dashboard" },
  { name: "Employés", icon: Users, link: "/employees" },
  { name: "Contrats", icon: FileText, link: "/contrats" },
  { name: "Absences", icon: Calendar, link: "/absences" },
  { name: "Présences", icon: Clock, link: "/presences" },
  { name: "Performances", icon: BarChart, link: "/performances" },
  { name: "Postes", icon: Briefcase, link: "/postes" },
  { name: "Congés", icon: Calendar, link: "/conges" },
  { name: "Départements", icon: Users, link: "/departements" },
  { name: "Paiements", icon: DollarSign, link: "/paiements" },
  { name: "Bulletins", icon: FileText, link: "/bulletins" },
  { name: "Déconnexion", icon: Home, link: "/login" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 flex flex-col h-screen border-r border-gray-200 bg-white shadow-sm transition-all duration-300 z-40
        ${collapsed ? "w-20" : "w-50"}`}
    >
      {/* ----- HEADER LOGO ----- */}
      <div className="flex items-center justify-between h-20 border-b border-gray-100 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src={CarsoLogo} alt="CARSO Logo" className="h-25 w-auto items-center" />
            
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* ----- NAVIGATION ----- */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-[#0f285f] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#1c254d]"
              }
              ${collapsed ? "justify-center" : ""}
            `
            }
            title={collapsed ? item.name : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ----- USER INFO ----- */}
      <div className="border-t border-gray-100 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="User Avatar"
              className="h-10 w-10 rounded-full border border-gray-200"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">Jean Dupont</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        ) : (
          <img
            src="https://i.pravatar.cc/100"
            alt="User Avatar"
            className="h-10 w-10 rounded-full border border-gray-200 mx-auto"
          />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
