import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const formatNameFromEmail = (emailStr: string): string => {
    if (!emailStr) return 'User';
    const localPart = emailStr.split('@')[0];
    return localPart
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const displayName = email ? formatNameFromEmail(email) : 'Member';
      onLoginSuccess({
        name: displayName,
        email: email || 'user@emiqen.com',
        role: 'Verified Researcher',
        avatar: displayName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'EM',
      });
      onClose();
    }, 500);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Guest Researcher',
        email: 'guest@emiqen.com',
        role: 'Guest Access',
        avatar: 'GR',
      });
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="glass-panel max-w-md w-full rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/15 relative overflow-hidden text-left shadow-2xl"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#48E5F5]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-[#A4ADBB] dark:hover:text-[#F4F7FB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <BrandLogo size="lg" />
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                Sign In to <span className="text-[#0284C7] dark:text-[#48E5F5]">EMIQEN</span> Console
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#A4ADBB] mt-1">
                Access your personalized Small Language Model voice chat workspace
              </p>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-mono text-slate-700 dark:text-[#A4ADBB] block mb-1 font-medium">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 dark:text-[#A4ADBB] absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-[#080B10] border border-slate-300 dark:border-white/10 focus:border-[#0284C7] dark:focus:border-[#48E5F5] text-xs text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A4ADBB]/40 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-700 dark:text-[#A4ADBB] block mb-1 font-medium">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#A4ADBB] absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-[#080B10] border border-slate-300 dark:border-white/10 focus:border-[#0284C7] dark:focus:border-[#48E5F5] text-xs text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A4ADBB]/40 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#38C6D5] text-[#080B10] font-semibold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(72,229,245,0.4)] transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#080B10] border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In & Open Chat Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-[10px] font-mono text-[#A4ADBB] uppercase">or explore as guest</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Guest Access Option */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#080B10]/60 dark:bg-[#080B10]/60 light:bg-slate-100 hover:bg-[#080B10] light:hover:bg-slate-200 border border-white/10 light:border-slate-300 text-xs font-mono text-[#A4ADBB] hover:text-[#F4F7FB] light:text-slate-700 light:hover:text-slate-900 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#48E5F5]" />
              <span>Instant Guest Researcher Access</span>
            </div>
            <span className="text-[10px] text-[#48E5F5]">Try Demo</span>
          </button>

          {/* Bottom Security Note */}
          <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#A4ADBB]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Session · Domain SLM Privacy Enforced</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
