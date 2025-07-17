
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import { isAuthenticated, getCurrentUser } from '../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // TODO: Authentication check - uncomment when ready to implement
  /*
  useEffect(() => {
    // Check if user is logged in by checking localStorage or making API call
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    // Parse user data and set it
    setUser(JSON.parse(userData));
  }, [navigate]);
  */

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setDropdownOpen(false); // Close dropdown on logout
  };

  const handleUpdateField = (field) => {
    // TODO: Implement field update logic
    console.log(`Update ${field}`);
  };

  const handleViewHistory = (type) => {
    // TODO: Implement history view logic
    console.log(`View ${type} history`);
  };

  const handleViewLegal = (type) => {
    // TODO: Implement legal view logic
    console.log(`View ${type} legal`);
  };

  const handleLogoClick = () => {
    // Check if user has recent chat sessions
    const hasRecentChat = localStorage.getItem('recentChatSession') ||
                         sessionStorage.getItem('chatSessionId') ||
                         localStorage.getItem('lastChatTime');
    
    if (hasRecentChat) {
      // Redirect to chatbot with session history
      navigate('/chat');
    } else {
      // Redirect to landing page
      navigate('/');
    }
  };

  const avatarUrl = user && user.avatar ? user.avatar : null;
  const avatarLetter = user && user.full_name
    ? user.full_name[0].toUpperCase()
    : (user && user.username ? user.username[0].toUpperCase() : 'U');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo (always visible, clickable) */}
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="flex items-center hover:opacity-80 transition-opacity duration-200 focus:outline-none"
                aria-label="AK-47 Home"
              >
                <Logo size="default" showText={true} />
              </button>
            </div>
            {/* Right: Auth/User Section */}
            <div className="flex items-center space-x-3 relative">
              {!loggedIn ? (
                <Link
                  to="/login"
                  className="text-amber-600 hover:text-amber-700 px-4 py-2 rounded font-medium border border-amber-600 hover:bg-amber-50 transition-colors duration-200"
                >
                  Login
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((open) => !open)}
                    className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label="User menu"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      avatarLetter
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                      <div className="px-4 py-2 text-gray-700 font-semibold border-b">
                        {user && user.full_name ? user.full_name : user && user.username ? user.username : 'User'}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {/* Profile Icon */}
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        {/* Logout Icon */}
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            {/* Profile Header */}
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                <span className="text-white text-lg font-medium">S</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-900 bg-gray-100 rounded-md">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Feedback
              </a>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

            {/* Account Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleUpdateField('email')}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    Update
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">••••••••</p>
                  </div>
                  <button
                    onClick={() => handleUpdateField('password')}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Language</p>
                    <p className="text-sm text-gray-500">English</p>
                  </div>
                  <button
                    onClick={() => handleUpdateField('language')}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    Update
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Currency</p>
                    <p className="text-sm text-gray-500">USD</p>
                  </div>
                  <button
                    onClick={() => handleUpdateField('currency')}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">History</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Chat History</p>
                  <button
                    onClick={() => handleViewHistory('chat')}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Purchase History</p>
                  <button
                    onClick={() => handleViewHistory('purchase')}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* Legal Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Legal</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Terms of Service</p>
                  <button
                    onClick={() => handleViewLegal('terms')}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Privacy Policy</p>
                  <button
                    onClick={() => handleViewLegal('privacy')}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
