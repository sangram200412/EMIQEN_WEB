import { useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('emiqen-theme');
    if (saved === 'light') {
      return 'light';
    }
    localStorage.setItem('emiqen-theme', 'dark');
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode: ThemeMode) => {
      const isDark = mode === 'dark';

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    applyTheme(theme);
    localStorage.setItem('emiqen-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
