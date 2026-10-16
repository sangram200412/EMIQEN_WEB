import React from 'react';
import { Sun, Moon } from 'lucide-react';
import type { ThemeMode } from '../../hooks/useTheme';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  className?: string;
  variant?: 'pill' | 'compact';
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  className = '',
  variant = 'pill',
}) => {
  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { mode: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 p-1 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 ${className}`}>
        {options.map((opt) => {
          const isActive = currentTheme === opt.mode;
          return (
            <button
              key={opt.mode}
              onClick={() => onThemeChange(opt.mode)}
              title={`${opt.label} mode`}
              aria-label={`${opt.label} theme mode`}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#48E5F5] text-[#080B10] font-semibold shadow-sm'
                  : 'text-[#A4ADBB] hover:text-[#F4F7FB]'
              }`}
            >
              {opt.icon}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center p-1 rounded-xl bg-[#0D1420]/80 dark:bg-[#0D1420]/80 light:bg-slate-200/80 border border-white/10 light:border-slate-300 text-xs font-mono ${className}`}>
      {options.map((opt) => {
        const isActive = currentTheme === opt.mode;
        return (
          <button
            key={opt.mode}
            onClick={() => onThemeChange(opt.mode)}
            aria-label={`${opt.label} theme mode`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#48E5F5] text-[#080B10] font-semibold shadow-[0_0_12px_rgba(72,229,245,0.3)]'
                : 'text-[#A4ADBB] hover:text-[#F4F7FB] light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            {opt.icon}
            <span className="text-[11px] font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
