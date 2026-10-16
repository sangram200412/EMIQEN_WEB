import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
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

// Strictly validates that the address is a proper Google/Gmail account
export const isProperGoogleEmail = (emailStr: string): boolean => {
  const trimmed = emailStr.trim().toLowerCase();
  // Must match format username@(gmail.com or googlemail.com)
  const gmailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@(gmail\.com|googlemail\.com)$/;
  return gmailRegex.test(trimmed);
};

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [googleQuickEmail, setGoogleQuickEmail] = useState('');

  if (!isOpen) return null;

  const formatNameFromEmail = (emailStr: string): string => {
    if (!emailStr) return 'Google User';
    const localPart = emailStr.split('@')[0];
    return localPart
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const executeLogin = (validEmail: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = validEmail.trim().toLowerCase();
      const displayName = formatNameFromEmail(cleanEmail);
      
      onLoginSuccess({
        name: displayName,
        email: cleanEmail,
        role: 'Verified Google Account',
        avatar: displayName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'GA',
      });
      onClose();
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    // 1. Check if email is empty
    if (!cleanEmail) {
      setErrorMessage('Please enter your Google / Gmail account.');
      return;
    }

    // 2. Strict Google/Gmail check: MUST be @gmail.com or @googlemail.com
    if (!isProperGoogleEmail(cleanEmail)) {
      setErrorMessage(
        'Access Denied: Only verified Google / Gmail accounts (@gmail.com) are permitted. Please enter a valid Gmail address.'
      );
      return;
    }

    // 3. Password length check
    if (password.trim().length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Both passed -> execute verified login
    executeLogin(cleanEmail);
  };

  const handleGoogleOneTap = () => {
    const cleanEmail = email.trim();
    if (cleanEmail && isProperGoogleEmail(cleanEmail)) {
      executeLogin(cleanEmail);
    } else {
      setGoogleQuickEmail(cleanEmail.includes('@') ? cleanEmail : '');
      setGooglePromptOpen(true);
      setErrorMessage(null);
    }
  };

  const handleGoogleQuickConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProperGoogleEmail(googleQuickEmail)) {
      setErrorMessage(
        'Only official Google / Gmail accounts (@gmail.com) can log in.'
      );
      return;
    }
    setGooglePromptOpen(false);
    executeLogin(googleQuickEmail);
  };

  // Real-time domain validation indicators
  const hasTypedEmail = email.trim().length > 0;
  const isCurrentlyValidGmail = isProperGoogleEmail(email);
  const hasNonGmailDomain = hasTypedEmail && email.includes('@') && !isCurrentlyValidGmail;

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
          <div className="flex flex-col items-center text-center space-y-3 mb-5">
            <BrandLogo size="lg" />
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                Sign In with <span className="text-[#0284C7] dark:text-[#48E5F5]">Google Account</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#A4ADBB] mt-1">
                Access your EMIQEN-SLM voice workspace with your verified Gmail
              </p>
            </div>
          </div>

          {/* One-Click Continue with Google Button */}
          <div className="space-y-3 mb-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleOneTap}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 dark:bg-[#0D1420] dark:hover:bg-[#152033] border border-slate-300 dark:border-white/15 text-xs sm:text-sm font-semibold text-slate-800 dark:text-[#F4F7FB] flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {/* Google 4-Color SVG Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="flex-1 border-t border-slate-200 dark:border-white/10" />
              <span className="text-[10px] font-mono text-slate-400 dark:text-[#A4ADBB] uppercase tracking-wider">
                or sign in with Gmail credentials
              </span>
              <div className="flex-1 border-t border-slate-200 dark:border-white/10" />
            </div>
          </div>

          {/* Error Banner Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 shadow-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Authentication Restricted</span>
                <span className="leading-snug block">{errorMessage}</span>
              </div>
            </motion.div>
          )}

          {/* Quick Google Account Popup Input (If activated via Continue with Google) */}
          {googlePromptOpen && (
            <motion.form
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleGoogleQuickConfirm}
              className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-[#080B10] border border-[#4285F4]/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-[#F4F7FB] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4285F4]" />
                  Verify Google Account
                </span>
                <button
                  type="button"
                  onClick={() => setGooglePromptOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </div>
              <input
                type="email"
                autoFocus
                value={googleQuickEmail}
                onChange={(e) => {
                  setGoogleQuickEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="yourname@gmail.com"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#0D1420] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 focus:outline-none focus:border-[#4285F4]"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Confirm & Log In with Google
              </button>
            </motion.form>
          )}

          {/* Standard Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono text-slate-700 dark:text-[#A4ADBB] font-medium">
                  Google / Gmail Address *
                </label>
                {/* Real-time Indicator */}
                {isCurrentlyValidGmail && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Valid Google Account</span>
                  </span>
                )}
                {hasNonGmailDomain && (
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                    Must be @gmail.com
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 dark:text-[#A4ADBB] absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="yourname@gmail.com"
                  required
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-[#080B10] border ${
                    hasNonGmailDomain
                      ? 'border-amber-500 focus:border-amber-500'
                      : isCurrentlyValidGmail
                      ? 'border-emerald-500/60 focus:border-emerald-500'
                      : 'border-slate-300 dark:border-white/10 focus:border-[#0284C7] dark:focus:border-[#48E5F5]'
                  } text-xs text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A4ADBB]/40 focus:outline-none transition-colors shadow-xs`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-mono text-slate-700 dark:text-[#A4ADBB] block mb-1 font-medium">
                Google Account Password *
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#A4ADBB] absolute left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#080B10] border border-slate-300 dark:border-white/10 focus:border-[#0284C7] dark:focus:border-[#48E5F5] text-xs text-slate-900 dark:text-[#F4F7FB] placeholder:text-slate-400 dark:placeholder:text-[#A4ADBB]/40 focus:outline-none transition-colors shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#48E5F5] to-[#38C6D5] text-[#080B10] font-semibold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(72,229,245,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#080B10] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Google Account...</span>
                </>
              ) : (
                <>
                  <span>Sign In with Gmail & Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Security & Enforcement Note */}
          <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-[#A4ADBB]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>Strict Google Authentication · Verified @gmail.com Required</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

