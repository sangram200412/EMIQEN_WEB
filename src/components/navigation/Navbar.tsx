import React, { useState } from 'react';
import { Mic, Menu, X, LogIn, MessageSquare } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeSelector } from '../common/ThemeSelector';
import type { ThemeMode } from '../../hooks/useTheme';
import type { UserProfile } from '../auth/LoginModal';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
  backendConnected: boolean;
  onOpenLogin: () => void;
  user: UserProfile | null;
  onOpenChat: () => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToSection,
  backendConnected,
  onOpenLogin,
  user,
  onOpenChat,
  currentTheme,
  onThemeChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Pipeline', id: 'pipeline' },
    { label: 'Voice Studio', id: 'playground' },
    { label: 'STT & TTS', id: 'voice-lab' },
    { label: 'Emotion AI', id: 'emotion-intelligence' },
    { label: 'India Context', id: 'india-aware' },
    { label: 'SLM Core', id: 'model-intelligence' },
    { label: 'Architecture', id: 'architecture' },
  ];

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#080B10]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Identity with Logo */}
        <a
          href="#"
          className="flex items-center group focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <BrandLogo size="md" />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-[#A4ADBB] dark:hover:text-[#F4F7FB] transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Controls: Theme Selector + Status + Auth */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* Theme Selector (Dark, Light, Default) */}
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
            variant="compact"
          />

          {/* Backend Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#0D1420] border border-slate-200 dark:border-white/10 text-[10px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${backendConnected ? 'bg-emerald-400' : 'bg-[#48E5F5]'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${backendConnected ? 'bg-emerald-400' : 'bg-[#48E5F5]'}`} />
            </span>
            <span className="text-slate-600 dark:text-[#A4ADBB]">
              {backendConnected ? 'Connected' : 'Demo SLM'}
            </span>
          </div>

          {/* Login / Chat Workspace Button */}
          {user ? (
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#9A83FF] text-[#080B10] font-semibold text-xs transition-all shadow-[0_0_15px_rgba(72,229,245,0.3)] cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Chat Workspace</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0D1420] dark:hover:bg-[#152033] text-slate-800 dark:text-[#F4F7FB] font-medium text-xs border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#48E5F5]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Direct Voice Playground Action */}
          <button
            onClick={() => handleNavClick('playground')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#48E5F5] hover:bg-[#3ec4d1] text-[#080B10] font-semibold text-xs transition-all shadow-[0_0_15px_rgba(72,229,245,0.25)] cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 fill-current" />
            <span className="hidden md:inline">Voice Studio</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
            variant="compact"
          />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#F4F7FB] border border-slate-200 dark:border-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#080B10] border-b border-slate-200 dark:border-white/10 px-6 py-6 space-y-4 shadow-lg dark:shadow-none">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left py-2 text-sm text-slate-600 hover:text-slate-900 dark:text-[#A4ADBB] dark:hover:text-[#48E5F5] font-medium border-b border-slate-100 dark:border-white/5"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#9A83FF] text-[#080B10] font-semibold text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Chat Workspace</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-[#0D1420] text-slate-800 dark:text-[#F4F7FB] border border-slate-200 dark:border-white/10 font-semibold text-sm"
              >
                <LogIn className="w-4 h-4 text-[#0284C7] dark:text-[#48E5F5]" />
                <span>Sign In to Console</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
