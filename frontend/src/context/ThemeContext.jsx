import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  dark: false,
  setDark: () => {},
  toggleDark: () => {},
});

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("theme");
    if (stored) return stored === "dark";
    // Default to light mode for both main site and admin panel
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.body.classList.toggle("dark", dark);
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleDark = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, setDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
