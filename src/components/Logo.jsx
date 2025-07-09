
import React from 'react';

const Logo = ({ size = 'default', showText = true }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <div className="flex items-center space-x-3 logo-container group">
      {/* Warm Minimalist Logo */}
      <div className="relative">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 40 40" 
          className={`text-amber-600 logo-svg transition-all duration-300 ${sizeClasses[size]}`}
          fill="currentColor"
        >
          {/* Outer rounded square with warm gradient */}
          <rect 
            x="2" 
            y="2" 
            width="36" 
            height="36" 
            rx="8" 
            fill="url(#warmGradient)" 
            stroke="currentColor" 
            strokeWidth="1.5"
          />
          
          {/* Inner geometric pattern - abstract house/shelter symbol */}
          <path 
            d="M12 28 L12 18 L20 12 L28 18 L28 28 Z" 
            fill="url(#lightGradient)" 
            opacity="0.9"
          />
          
          {/* Central element - stylized "A" */}
          <path 
            d="M16 24 L18 18 L22 18 L24 24 M18.5 21 L21.5 21" 
            stroke="#8B4513" 
            strokeWidth="2" 
            strokeLinecap="round" 
            fill="none"
          />
          
          {/* Decorative dots in corners */}
          <circle cx="8" cy="8" r="1.5" fill="#D2691E" opacity="0.7" />
          <circle cx="32" cy="8" r="1.5" fill="#D2691E" opacity="0.7" />
          <circle cx="8" cy="32" r="1.5" fill="#D2691E" opacity="0.7" />
          <circle cx="32" cy="32" r="1.5" fill="#D2691E" opacity="0.7" />
          
          {/* Gradient definitions */}
          <defs>
            {/* Main warm gradient */}
            <linearGradient id="warmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F4A460" />
              <stop offset="25%" stopColor="#D2691E" />
              <stop offset="50%" stopColor="#CD853F" />
              <stop offset="75%" stopColor="#A0522D" />
              <stop offset="100%" stopColor="#8B4513" />
            </linearGradient>
            
            {/* Light cream gradient for inner shape */}
            <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="50%" stopColor="#F5DEB3" />
              <stop offset="100%" stopColor="#DEB887" />
            </linearGradient>
            
            {/* Hover effect gradient */}
            <radialGradient id="hoverWarmGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE4B5" />
              <stop offset="100%" stopColor="#F4A460" />
            </radialGradient>
          </defs>
        </svg>
        
        {/* Warm glow effect */}
        <div className="absolute inset-0 rounded-lg bg-amber-400 opacity-10 blur-md -z-10 logo-glow group-hover:opacity-30 group-hover:scale-110 transition-all duration-300"></div>
      </div>
      
      {/* Brand name with warm color scheme */}
      {showText && (
        <div className="flex flex-col brand-text">
          <div className={`font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
            AK-47
          </div>
          <div className="text-xs text-amber-600 font-medium tracking-wide uppercase">
            AI Assistant
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
