
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
      {/* Professional AK-47 Logo */}
      <div className="relative">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 40 40" 
          className={`text-blue-600 logo-svg transition-all duration-300 ${sizeClasses[size]}`}
          fill="currentColor"
        >
          {/* Outer circle with gradient effect */}
          <circle 
            cx="20" 
            cy="20" 
            r="18" 
            fill="url(#logoGradient)" 
            stroke="currentColor" 
            strokeWidth="2"
          />
          
          {/* Inner geometric pattern */}
          <path 
            d="M12 20 L20 12 L28 20 L20 28 Z" 
            fill="white" 
            opacity="0.9"
          />
          
          {/* Central diamond */}
          <path 
            d="M16 20 L20 16 L24 20 L20 24 Z" 
            fill="currentColor"
          />
          
          {/* Stylized "A" in the center */}
          <path 
            d="M18 22 L19 19 L21 19 L22 22 M19.5 20.5 L20.5 20.5" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            fill="none"
          />
          
          {/* Additional decorative elements */}
          <circle cx="13" cy="13" r="1" fill="white" opacity="0.6" />
          <circle cx="27" cy="13" r="1" fill="white" opacity="0.6" />
          <circle cx="13" cy="27" r="1" fill="white" opacity="0.6" />
          <circle cx="27" cy="27" r="1" fill="white" opacity="0.6" />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="25%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="75%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            
            {/* Additional gradient for hover effect */}
            <radialGradient id="hoverGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </radialGradient>
          </defs>
        </svg>
        
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-md -z-10 logo-glow group-hover:opacity-40 group-hover:scale-110 transition-all duration-300"></div>
      </div>
      
      {/* Brand name with modern typography */}
      {showText && (
        <div className="flex flex-col brand-text">
          <div className={`font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
            AK-47
          </div>
          <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">
            AI Assistant
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
