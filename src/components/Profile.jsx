
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import { isAuthenticated, getCurrentUser } from '../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('account');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setDropdownOpen(false);
  };

  const handleUpdateField = (field) => {
    console.log(`Update ${field}`);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const avatarUrl = user && user.avatar ? user.avatar : null;
  const avatarLetter = user && user.full_name
    ? user.full_name[0].toUpperCase()
    : (user && user.username ? user.username[0].toUpperCase() : 'U');

  const menuItems = [
    { id: 'account', label: 'Account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'preferences', label: 'Preferences', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4' },
    { id: 'history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'support', label: 'Support', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="flex items-center hover:opacity-80 transition-all duration-200 focus:outline-none group"
                aria-label="A³ Home"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                  <Logo size="small" showText={false} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    A³
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Anything Anywhere Anytime</p>
                </div>
              </button>
            </div>

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
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
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
                        <p className="text-xs text-gray-500">A³ User</p>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-2xl object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">{avatarLetter}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {user && user.full_name ? user.full_name : 
                   user && user.username ? user.username : 'User Profile'}
                </h1>
                <p className="text-white/80 text-lg">A³ Premium Member</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-white/90">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-gray-50/50 border-r border-gray-200 p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/70 hover:shadow-md'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8">
              {activeSection === 'account' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-700">Verified</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Email Address</h3>
                            <p className="text-gray-600">{user && user.email ? user.email : 'user@example.com'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpdateField('email')}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"
                        >
                          Update
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                            <p className="text-gray-600">Last updated 30 days ago</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpdateField('password')}
                          className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Assistant Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Language</h3>
                          <p className="text-gray-600">English (US)</p>
                        </div>
                        <button
                          onClick={() => handleUpdateField('language')}
                          className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Currency</h3>
                          <p className="text-gray-600">USD ($)</p>
                        </div>
                        <button
                          onClick={() => handleUpdateField('currency')}
                          className="px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors duration-200"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'history' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity & History</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Chat History</h3>
                            <p className="text-gray-600">View all conversations</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
                          View
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
                            <p className="text-gray-600">Recent actions & searches</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'support' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>
                  
                  <div className="grid gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
                          <p className="text-gray-600">Find answers to common questions</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors duration-200">
                          View FAQ
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">Contact Support</h3>
                          <p className="text-gray-600">Get help from our support team</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200">
                          Contact Us
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
