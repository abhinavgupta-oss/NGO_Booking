import React, {
  createContext,
  useContext,
  useState,
} from "react";

import {
  LightTheme,
  DarkTheme,
} from "./colors";

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        colors: darkMode
          ? DarkTheme
          : LightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext);