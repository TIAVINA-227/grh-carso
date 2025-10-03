import { FaUserFriends, FaCalendarCheck, FaFileContract, FaChartBar, FaSuitcase, FaUmbrellaBeach, FaBuilding, FaMoneyBillWave, FaReceipt, FaTachometerAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Employés", icon: <FaUserFriends />, path: "/employes" },
    { name: "Contrats", icon: <FaFileContract />, path: "/contrats" },
    { name: "Absences", icon: <FaCalendarCheck />, path: "/absences" },
    { name: "Présences", icon: <FaCalendarCheck />, path: "/presences" },
    { name: "Performances", icon: <FaChartBar />, path: "/performances" },
    { name: "Postes", icon: <FaSuitcase />, path: "/postes" },
    { name: "Congés", icon: <FaUmbrellaBeach />, path: "/conges" },
    { name: "Départements", icon: <FaBuilding />, path: "/departements" },
    { name: "Paiements", icon: <FaMoneyBillWave />, path: "/paiements" },
    { name: "Bulletins", icon: <FaReceipt />, path: "/bulletins" },
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 font-bold text-xl">🚀 CARSO</div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg font-medium ${
                isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon} {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <p className="font-semibold">Jean Dupont</p>
            <p className="text-sm text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
