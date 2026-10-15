import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'emblem' | 'stacked';
  layout?: 'horizontal' | 'stacked';
  showDomain?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  layout = 'horizontal',
  showDomain = true,
}) => {
  const isStacked = variant === 'stacked' || layout === 'stacked';
  const isEmblemOnly = variant === 'emblem';

  const emblemSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9 sm:h-10 sm:w-10',
    lg: 'h-11 w-11 sm:h-12 sm:w-12',
    xl: 'h-14 w-14 sm:h-16 sm:w-16',
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl md:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const domainSizes = {
    sm: 'text-[11px] sm:text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
    xl: 'text-base sm:text-lg',
  };

  return (
    <div
      className={`inline-flex ${
        isStacked ? 'flex-col items-center text-center gap-1.5' : 'flex-row items-center gap-2.5 sm:gap-3'
      } select-none ${className}`}
    >
      {/* 3D Hexagonal Voice Core Emblem with Ambient Backlight */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Soft radial backlight to accentuate the silhouette and back spine */}
        <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-tr from-[#8B5CF6]/25 via-[#0EA5E9]/25 to-[#38BDF8]/25 blur-md -z-10 pointer-events-none opacity-75 group-hover:opacity-100 transition-opacity" />
        <img
          src="/logo-emblem.png"
          alt="EMIQEN AI Core"
          className={`${emblemSizes[size]} object-contain relative z-10 transition-all duration-300 group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(14,165,233,0.35)] group-hover:drop-shadow-[0_0_18px_rgba(56,189,248,0.6)]`}
        />
      </div>

      {/* Brand Typography Wordmark (High-Contrast in both Dark and Light Themes) */}
      {!isEmblemOnly && (
        <div className="flex items-baseline tracking-wider font-extrabold leading-none">
          {/* Main EMIQEN name */}
          <span className={`${textSizes[size]} font-black tracking-widest text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200`}>
            EMI
          </span>
          <span className={`${textSizes[size]} font-black tracking-widest bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] dark:from-[#38BDF8] dark:to-[#48E5F5] bg-clip-text text-transparent transition-colors duration-200`}>
            Q
          </span>
          <span className={`${textSizes[size]} font-black tracking-widest text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200`}>
            EN
          </span>

          {/* .COM Top-Level Domain Accent */}
          {showDomain && (
            <span
              className={`${domainSizes[size]} font-extrabold tracking-wide ml-0.5 sm:ml-1 bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#8B5CF6] dark:from-[#38BDF8] dark:via-[#48E5F5] dark:to-[#A78BFA] bg-clip-text text-transparent transition-colors duration-200`}
            >
              .COM
            </span>
          )}
        </div>
      )}
    </div>
  );
};
