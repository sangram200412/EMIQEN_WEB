import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'emblem';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  const sizeMap = {
    sm: variant === 'emblem' ? 'h-7' : 'h-8 sm:h-9',
    md: variant === 'emblem' ? 'h-9' : 'h-10 sm:h-11',
    lg: variant === 'emblem' ? 'h-12' : 'h-14 sm:h-16',
    xl: variant === 'emblem' ? 'h-16' : 'h-20 sm:h-24',
  };

  const imageSrc = variant === 'emblem' ? '/logo-emblem.png' : '/logo.png';

  return (
    <div className={`inline-flex items-center select-none bg-transparent ${className}`}>
      <img
        src={imageSrc}
        alt="EMIQEN.COM"
        className={`${sizeMap[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.03]`}
      />
    </div>
  );
};
