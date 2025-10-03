import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          onClick={toggleSidebar}
        >
          <Menu />
        </button>
        <h1 className="text-lg font-bold">📝 My Notes</h1>
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
