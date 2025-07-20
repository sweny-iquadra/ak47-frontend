
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, clearAuth } from '../utils/api';
import Logo from './Logo';

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleStorage = () => {
      setLoggedIn(isAuthenticated());
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleLogoClick = () => {
    // Always redirect to landing page
    navigate('/');
  };

  const avatarUrl = user && user.avatar ? user.avatar : null; // or user.profile_image
  const avatarLetter = user && user.full_name
    ? user.full_name[0].toUpperCase()
    : (user && user.username ? user.username[0].toUpperCase() :
      user && user.email ? user.email[0].toUpperCase() : 'U');

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo (always visible, clickable) */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-all duration-200 focus:outline-none group"
              aria-label="AI Shopping Assistant Home"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                <Logo size="small" showText={false} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Smart Shopping</p>
              </div>
            </button>
          </div>

          {/* Right: Auth/User Section */}
          <div className="flex items-center space-x-3 relative">
            {!loggedIn ? (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
                  aria-label="User menu"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-2xl object-cover" />
                  ) : (
                    <span className="text-white font-semibold">{avatarLetter}</span>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user && user.full_name ? user.full_name :
                          user && user.username ? user.username :
                            user && user.email ? user.email : 'User'}
                      </p>
                      <p className="text-xs text-gray-500">AI Shopping Assistant User</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="font-medium">Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                        </svg>
                      </div>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
