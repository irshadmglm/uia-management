import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "light", // default theme
  initializeTheme: () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
    set({ theme: savedTheme });
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));

