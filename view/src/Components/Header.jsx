import { FaBell, FaSun } from "react-icons/fa";

const Header = ({ user }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <input
        type="text"
        placeholder="Rechercher..."
        className="w-1/3 px-3 py-2 border rounded-lg"
      />

      <div className="flex items-center gap-6">
        <FaSun className="text-gray-600 cursor-pointer" />
        <FaBell className="text-gray-600 cursor-pointer" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <span className="font-semibold">{user?.nom_utilisateur || "Jean Dupont"}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
