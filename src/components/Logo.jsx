
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
      {/* A³ Cube Logo */}
      <div className="relative">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 40 40" 
          className={`logo-svg transition-all duration-300 ${sizeClasses[size]} group-hover:scale-105`}
          fill="currentColor"
        >
          {/* 3D Cube Structure */}
          <g>
            {/* Top face of cube */}
            <path 
              d="M8 16 L20 8 L32 16 L20 24 Z" 
              fill="url(#topFaceGradient)" 
              stroke="url(#cubeStroke)" 
              strokeWidth="1"
            />
            
            {/* Left face of cube */}
            <path 
              d="M8 16 L20 24 L20 36 L8 28 Z" 
              fill="url(#leftFaceGradient)" 
              stroke="url(#cubeStroke)" 
              strokeWidth="1"
            />
            
            {/* Right face of cube */}
            <path 
              d="M20 24 L32 16 L32 28 L20 36 Z" 
              fill="url(#rightFaceGradient)" 
              stroke="url(#cubeStroke)" 
              strokeWidth="1"
            />
            
            {/* Inner edges for depth */}
            <line x1="20" y1="8" x2="20" y2="24" stroke="url(#edgeGradient)" strokeWidth="0.8" opacity="0.7" />
            <line x1="8" y1="16" x2="20" y2="24" stroke="url(#edgeGradient)" strokeWidth="0.8" opacity="0.7" />
            <line x1="32" y1="16" x2="20" y2="24" stroke="url(#edgeGradient)" strokeWidth="0.8" opacity="0.7" />
          </g>
          
          {/* Letter A in the center of cube */}
          <text 
            x="20" 
            y="22" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="font-bold text-white"
            style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif' }}
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="0.3"
          >
            A
          </text>
          
          {/* AI Circuit overlay on top face */}
          <g opacity="0.8">
            {/* Neural network nodes */}
            <circle cx="14" cy="14" r="0.8" fill="#F59E0B" />
            <circle cx="26" cy="14" r="0.8" fill="#F59E0B" />
            <circle cx="20" cy="10" r="0.8" fill="#F59E0B" />
            
            {/* Neural connections */}
            <line x1="14" y1="14" x2="20" y2="10" stroke="#F59E0B" strokeWidth="0.6" opacity="0.9" />
            <line x1="26" y1="14" x2="20" y2="10" stroke="#F59E0B" strokeWidth="0.6" opacity="0.9" />
            <line x1="14" y1="14" x2="26" y2="14" stroke="#F59E0B" strokeWidth="0.6" opacity="0.9" />
          </g>
          
          {/* Floating data particles around cube */}
          <g className="animate-pulse">
            <circle cx="6" cy="12" r="1" fill="#3B82F6" opacity="0.6" />
            <circle cx="34" cy="20" r="1" fill="#10B981" opacity="0.6" />
            <circle cx="12" cy="32" r="1" fill="#8B5CF6" opacity="0.6" />
            <circle cx="28" cy="6" r="1" fill="#F59E0B" opacity="0.6" />
          </g>
          
          {/* Gradient definitions */}
          <defs>
            {/* Top face gradient - brightest */}
            <linearGradient id="topFaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            
            {/* Left face gradient - medium */}
            <linearGradient id="leftFaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            
            {/* Right face gradient - darkest */}
            <linearGradient id="rightFaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#172554" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            
            {/* Cube stroke gradient */}
            <linearGradient id="cubeStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            
            {/* Edge gradient */}
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Animated glow effect */}
        <div className="absolute inset-0 rounded-lg bg-blue-400 opacity-20 blur-md -z-10 logo-glow group-hover:opacity-40 group-hover:scale-110 transition-all duration-300 animate-pulse"></div>
      </div>
      
      {/* Brand name with tech-inspired styling */}
      {showText && (
        <div className="flex flex-col brand-text">
          <div className={`font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
            A³
          </div>
          <div className="text-xs text-blue-600 font-medium tracking-wide uppercase flex items-center space-x-1">
            <span className="inline-block w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
            <span>Anything Anywhere Anytime</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
