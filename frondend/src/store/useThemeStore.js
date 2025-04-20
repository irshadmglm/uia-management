import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";

      // Apply theme class to <html> (for Tailwind)
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);

      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));
