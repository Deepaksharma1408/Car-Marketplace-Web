'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'pearl' | 'monaco';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  subtitle: string;
  badge: string;
  bgHex: string;
  surfaceHex: string;
  accentHex: string;
  textHex: string;
  isLight: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'monaco',
    name: 'Monaco Riviera Light',
    subtitle: 'Cool Ice White & French Azure Cyan',
    badge: 'Cool Light',
    bgHex: '#F4F7FB',
    surfaceHex: '#FFFFFF',
    accentHex: '#0284C7',
    textHex: '#0F172A',
    isLight: true,
  },
  {
    id: 'pearl',
    name: 'Desert Pearl Light',
    subtitle: 'Warm Ivory & Royal Gold Showroom',
    badge: 'Warm Light',
    bgHex: '#FAF9F5',
    surfaceHex: '#FFFFFF',
    accentHex: '#B8860B',
    textHex: '#18181B',
    isLight: true,
  },
  {
    id: 'dark',
    name: 'Obsidian Gold',
    subtitle: 'Midnight Dubai Supercar Vibe',
    badge: 'Dark Luxury',
    bgHex: '#0A0C10',
    surfaceHex: '#12151C',
    accentHex: '#D4AF6A',
    textHex: '#F4F5F7',
    isLight: false,
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  activeThemeOption: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('monaco');

  const applyThemeToDom = (t: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.removeAttribute('data-theme');

    if (t === 'pearl') {
      root.classList.add('light');
      root.setAttribute('data-theme', 'pearl');
    } else if (t === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.setAttribute('data-theme', 'monaco');
    }
  };

  useEffect(() => {
    try {
      const saved = (localStorage.getItem('vehiclespot_theme') || localStorage.getItem('autoreel_theme')) as ThemeMode;
      if (saved && (saved === 'dark' || saved === 'pearl' || saved === 'monaco')) {
        setThemeState(saved);
        applyThemeToDom(saved);
      } else {
        setThemeState('monaco');
        applyThemeToDom('monaco');
      }
    } catch (e) {
      setThemeState('monaco');
      applyThemeToDom('monaco');
    }
  }, []);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    try {
      localStorage.setItem('vehiclespot_theme', t);
    } catch (e) {
      // ignore quota
    }
    applyThemeToDom(t);
  };

  const toggleTheme = () => {
    const next = theme === 'monaco' ? 'pearl' : theme === 'pearl' ? 'dark' : 'monaco';
    setTheme(next);
  };

  const activeThemeOption = THEME_OPTIONS.find((o) => o.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, activeThemeOption }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

