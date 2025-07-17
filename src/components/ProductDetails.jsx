
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import { isAuthenticated, getCurrentUser } from '../utils/api';

const ProductDetails = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // TODO: Authentication check - uncomment when ready to implement
  /*
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in by checking localStorage or making API call
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(token && user);
    
    // If not logged in, redirect to login
    if (!token || !user) {
      navigate('/login');
      return;
    }
  }, [navigate]);
  */

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log('Buy now clicked');
  };

  const handleLogoClick = () => {
    // Always redirect to landing page
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const avatarUrl = user && user.avatar ? user.avatar : null;
  const avatarLetter = user && user.full_name
    ? user.full_name[0].toUpperCase()
    : (user && user.username ? user.username[0].toUpperCase() : 'U');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
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
                  className="text-amber-600 hover:text-amber-700 px-4 py-2 rounded font-medium border border-amber-60 hover:bg-amber-50 transition-colors duration-200"
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
                      <div className="px-4 py-2 text-gray-700 text-semibold border-b">
                        {user && user.full_name ? user.full_name : user && user.username ? user.username : 'User'}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {/* Profile Icon */}
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 00-6.879-6.879z" />
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-22" />
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="flex-shrink-0 h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="hover:text-gray-700">Electronics</span>
            </li>
            <li className="flex items-center">
              <svg className="flex-shrink-0 h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900">Smartphones</span>
            </li>
          </ol>
        </nav>

        {/* Product Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nova X500 Smartphone
        </h1>

        {/* Product Overview */}
        <p className="text-gray-600 mb-8 max-w-4xl">
          Experience the future with the Nova X500, featuring a stunning display, powerful processor, and advanced camera system.
        </p>

        {/* Product Images Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Image */}
          <div className="bg-gradient-to-br from-orange-200 to-pink-300 rounded-lg p-8 flex items-center justify-center">
            <div className="w-64 h-96 bg-black rounded-3xl p-2 shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-2xl"></div>
            </div>
          </div>

          {/* Side Images */}
          <div className="grid grid-cols-1 gap-4">
            {/* Back view */}
            <div className="bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg p-6 flex items-center justify-center h-48">
              <div className="w-24 h-40 bg-gradient-to-b from-teal-600 to-blue-700 rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-medium">nova</span>
              </div>
            </div>

            {/* Side view */}
            <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center h-48">
              <div className="w-40 h-8 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Product Overview Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Overview
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-4xl">
            The Nova X500 redefines smartphone technology with its edge-to-edge OLED display, lightning-fast octa-core processor, 
            and a revolutionary 108MP camera. Its sleek design and durable build make it the perfect companion for your daily 
            adventures.
          </p>
        </div>

        {/* Specifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Specifications
          </h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Left Column */}
              <div className="space-y-4 p-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Display</h3>
                  <p className="text-gray-900">6.8" OLED, 120Hz</p>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">RAM</h3>
                  <p className="text-gray-900">12GB</p>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Camera</h3>
                  <p className="text-gray-900">108MP + 12MP + 5MP</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Operating System</h3>
                  <p className="text-gray-900">Android 13</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 p-6 border-l border-gray-100">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Processor</h3>
                  <p className="text-gray-900">Octa-Core 3.2GHz</p>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Storage</h3>
                  <p className="text-gray-900">256GB</p>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Battery</h3>
                  <p className="text-gray-900">5000mAh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-2xl font-bold text-gray-900">Free shipping</p>
              <p className="text-sm text-gray-500">Ready to ship</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Weight: 185g</p>
              <p className="text-sm text-green-600 font-medium">Ready to ship</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 transition-colors duration-200"
            >
              Buy Now
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
