import { useThemeStore } from "../store/useThemeStore";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ThemeSwapButton = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
    >
      {theme === "light" ? (
        <MdDarkMode className="text-xl text-gray-800 dark:text-yellow-400" />
      ) : (
        <MdLightMode className="text-xl text-gray-200 dark:text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeSwapButton;
