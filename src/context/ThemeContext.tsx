import React, { createContext } from 'react';

interface ThemeContextData {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextData | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{} as ThemeContextData}>
      {children}
    </ThemeContext.Provider>
  );
}
