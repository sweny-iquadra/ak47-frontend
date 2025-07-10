
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
      {/* AI Shopping Assistant Logo */}
      <div className="relative">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 40 40" 
          className={`text-blue-600 logo-svg transition-all duration-300 ${sizeClasses[size]} group-hover:scale-105`}
          fill="currentColor"
        >
          {/* Main circular background with gradient */}
          <circle 
            cx="20" 
            cy="20" 
            r="18" 
            fill="url(#aiGradient)" 
            stroke="url(#borderGradient)" 
            strokeWidth="2"
          />
          
          {/* Shopping cart body */}
          <path 
            d="M8 10 L12 10 L14 22 L28 22 L30 14 L16 14" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.95"
          />
          
          {/* Cart wheels */}
          <circle cx="16" cy="26" r="1.5" fill="#ffffff" opacity="0.95" />
          <circle cx="26" cy="26" r="1.5" fill="#ffffff" opacity="0.95" />
          
          {/* AI Brain circuits overlay */}
          <g opacity="0.9">
            {/* Neural network nodes */}
            <circle cx="20" cy="12" r="1" fill="#A855F7" />
            <circle cx="16" cy="16" r="1" fill="#A855F7" />
            <circle cx="24" cy="16" r="1" fill="#A855F7" />
            <circle cx="20" cy="20" r="1" fill="#A855F7" />
            
            {/* Neural connections */}
            <line x1="20" y1="12" x2="16" y2="16" stroke="#A855F7" strokeWidth="0.8" opacity="0.8" />
            <line x1="20" y1="12" x2="24" y2="16" stroke="#A855F7" strokeWidth="0.8" opacity="0.8" />
            <line x1="16" y1="16" x2="20" y2="20" stroke="#A855F7" strokeWidth="0.8" opacity="0.8" />
            <line x1="24" y1="16" x2="20" y2="20" stroke="#A855F7" strokeWidth="0.8" opacity="0.8" />
          </g>
          
          {/* AI Chip/Processor symbol */}
          <rect 
            x="17" 
            y="7" 
            width="6" 
            height="6" 
            rx="1" 
            fill="url(#chipGradient)" 
            stroke="#ffffff" 
            strokeWidth="0.5"
          />
          
          {/* Chip pins */}
          <line x1="15" y1="9" x2="17" y2="9" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="15" y1="11" x2="17" y2="11" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="23" y1="9" x2="25" y2="9" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="23" y1="11" x2="25" y2="11" stroke="#ffffff" strokeWidth="0.5" />
          
          {/* Search/Magnifying glass */}
          <circle cx="32" cy="8" r="3" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.9" />
          <line x1="34.5" y1="10.5" x2="37" y2="13" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          
          {/* Price tag */}
          <path 
            d="M6 30 L10 30 L12 28 L10 26 L6 26 Z" 
            fill="#10B981" 
            opacity="0.9"
          />
          <circle cx="8" cy="28" r="0.5" fill="#ffffff" />
          
          {/* Gradient definitions */}
          <defs>
            {/* Main AI gradient - Modern teal to purple */}
            <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="25%" stopColor="#0891B2" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="75%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            
            {/* Border gradient */}
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            
            {/* Chip gradient - Emerald green for tech */}
            <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Animated glow effect */}
        <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-md -z-10 logo-glow group-hover:opacity-40 group-hover:scale-110 transition-all duration-300 animate-pulse"></div>
      </div>
      
      {/* Brand name with tech-inspired styling */}
      {showText && (
        <div className="flex flex-col brand-text">
          <div className={`font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
            AK-47
          </div>
          <div className="text-xs text-teal-600 font-medium tracking-wide uppercase flex items-center space-x-1">
            <span className="inline-block w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>AI Shopping Assistant</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
