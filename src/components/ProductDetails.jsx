
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { isAuthenticated, getCurrentUser } from '../utils/api';

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const product = location.state?.product;

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0v2a1 1 0 001 1h1m-4-3h.01M21 13h-.01" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">No product data available</p>
        </div>
      </div>
    );
  }

  const handleBuyNow = () => {
    const url = product.product_url;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLogoClick = () => {
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

  // Helper for dynamic specifications
  const getSpecs = () => {
    if (product.specifications && typeof product.specifications === 'object') {
      return Array.isArray(product.specifications)
        ? product.specifications
        : Object.entries(product.specifications).map(([key, value]) => ({ key, value }));
    }
    const specKeys = [
      "display", "ram", "camera", "operating_system", "processor", "storage", "battery", "weight"
    ];
    return specKeys
      .filter((key) => product[key])
      .map((key) => ({ key, value: product[key] }));
  };
  const specs = getSpecs();

  // Helper for images
  const mainImage = product.image_url || null;
  const sideImages = product.images?.slice(1, 3) || [];

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
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Breadcrumb */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li>
                  <Link to="/" className="hover:text-blue-600 transition-colors duration-200 font-medium">
                    Home
                  </Link>
                </li>
                {product.category && (
                  <li className="flex items-center">
                    <svg className="flex-shrink-0 h-4 w-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="hover:text-blue-600 transition-colors duration-200">{product.category}</span>
                  </li>
                )}
                {product.subcategory && (
                  <li className="flex items-center">
                    <svg className="flex-shrink-0 h-4 w-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-600 font-medium">{product.subcategory}</span>
                  </li>
                )}
              </ol>
            </nav>
          </div>

          <div className="p-8">
            {/* Product Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                {product.name || product.title || "Product Details"}
              </h1>
              {product.description && (
                <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">{product.description}</p>
              )}
            </div>

            {/* Product Images Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Main Image */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-3xl p-8 flex items-center justify-center min-h-[400px] shadow-lg">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.name || "Product"}
                      className="max-w-full max-h-80 object-contain rounded-2xl shadow-2xl"
                    />
                  ) : (
                    <div className="w-64 h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-gray-500 shadow-lg">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="font-medium">No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Side Images */}
              <div className="grid grid-cols-1 gap-6">
                {sideImages.length > 0 ? (
                  sideImages.map((img, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 flex items-center justify-center h-48 shadow-md">
                      <img src={img} alt={`Product view ${idx + 2}`} className="max-h-36 object-contain rounded-xl" />
                    </div>
                  ))
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 flex items-center justify-center h-48 shadow-md">
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No Additional Images</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            {specs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {specs.map((spec, idx) => (
                      <div key={idx} className={`p-6 ${idx % 2 === 0 ? 'bg-blue-50/50' : 'bg-white/50'} border-b border-gray-100 last:border-b-0`}>
                        <h3 className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                          {spec.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-gray-800 font-medium">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Attributes Section */}
            {product.attributes && typeof product.attributes === 'object' && Object.keys(product.attributes).length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Features</h2>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {Object.entries(product.attributes).map(([key, value], idx) => (
                      <div key={idx} className={`p-6 ${idx % 2 === 0 ? 'bg-indigo-50/50' : 'bg-white/50'} border-b border-gray-100 last:border-b-0`}>
                        <h3 className="text-sm font-semibold text-indigo-600 mb-2 uppercase tracking-wide">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-gray-800 font-medium">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pricing and Action */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  {product.price ? (
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ${product.price}
                    </p>
                  ) : (
                    <p className="text-4xl font-bold text-gray-600">Price Available on Store</p>
                  )}
                  <div className="space-y-2">
                    {product.shipping_info && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="font-medium">{product.shipping_info}</span>
                      </div>
                    )}
                    {typeof product.taxes === 'number' && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>Tax: ${product.taxes.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-right space-y-2">
                    {product.weight && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9h6l-3 9z" />
                        </svg>
                        <span className="font-medium">Weight: {product.weight}</span>
                      </div>
                    )}
                    {product.availability ? (
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{product.availability}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Check availability on store</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
