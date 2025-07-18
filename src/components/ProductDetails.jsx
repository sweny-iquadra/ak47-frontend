
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { isAuthenticated, getCurrentUser } from '../utils/api';

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const product = location.state?.product;
  console.log("product details ", product);
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">No product data available.</div>;
  }

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
    const url = product.product_url;
    window.open(url, "_blank", "noopener,noreferrer");
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

  // Optionally, filter out fields you don't want to show
  const hiddenFields = ["id", "created_at", "updated_at", "__v"];

  // Helper for dynamic specifications
  const getSpecs = () => {
    if (product.specifications && typeof product.specifications === 'object') {
      // If specifications is an object or array, return entries
      return Array.isArray(product.specifications)
        ? product.specifications
        : Object.entries(product.specifications).map(([key, value]) => ({ key, value }));
    }
    // Otherwise, try to infer specs from product fields
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
            {product.category && (
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="hover:text-gray-700">{product.category}</span>
              </li>
            )}
            {product.subcategory && (
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900">{product.subcategory}</span>
              </li>
            )}
          </ol>
        </nav>

        {/* Product Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {product.name || product.title || "Product Details"}
        </h1>

        {/* Product Overview */}
        {product.description && (
          <p className="text-gray-600 mb-8 max-w-4xl">{product.description}</p>
        )}

        {/* Product Images Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Image */}
          <div className="bg-gradient-to-br from-orange-200 to-pink-300 rounded-lg p-8 flex items-center justify-center">
            {mainImage ? (
              <img src={mainImage} alt={product.name || "Product"} className="w-64 h-96 object-cover rounded-3xl shadow-2xl" />
            ) : (
              <div className="w-64 h-96 bg-black rounded-3xl p-2 shadow-2xl flex items-center justify-center text-white">No Image</div>
            )}
          </div>

          {/* Side Images */}
          <div className="grid grid-cols-1 gap-4">
            {sideImages.length > 0 ? (
              sideImages.map((img, idx) => (
                <div key={idx} className="bg-gray-100 rounded-lg p-6 flex items-center justify-center h-48">
                  <img src={img} alt={`Product view ${idx + 2}`} className="h-40 object-cover rounded-xl" />
                </div>
              ))
            ) : (
              <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center h-48 text-gray-400">No Additional Images</div>
            )}
          </div>
        </div>

        {/* Product Overview Section */}
        {product.overview && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Overview</h2>
            <p className="text-gray-600 leading-relaxed max-w-4xl">{product.overview}</p>
          </div>
        )}

        {/* Specifications */}
        {specs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left Column */}
                <div className="space-y-4 p-6">
                  {specs.filter((_, i) => i % 2 === 0).map((spec, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">{spec.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                      <p className="text-gray-900">{spec.value}</p>
                    </div>
                  ))}
                </div>
                {/* Right Column */}
                <div className="space-y-4 p-6 border-l border-gray-100">
                  {specs.filter((_, i) => i % 2 === 1).map((spec, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">{spec.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                      <p className="text-gray-900">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attributes Section */}
        {product.attributes && typeof product.attributes === 'object' && Object.keys(product.attributes).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Attributes</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {Object.entries(product.attributes).map(([key, value], idx) => (
                  <div key={idx} className="border-b border-gray-100 p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p className="text-gray-900">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing and Action */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              {product.price ? (
                <p className="text-2xl font-bold text-gray-900">${product.price}</p>
              ) : (
                <p className="text-2xl font-bold text-gray-900">Price not available</p>
              )}
              {product.shipping_info ? (
                <p className="text-sm text-gray-500">{product.shipping_info}</p>
              ) : (
                <p className="text-sm text-gray-500">Shipping info not available</p>
              )}
              {typeof product.taxes === 'number' && (
                <p className="text-sm text-gray-500">Tax: ${product.taxes.toFixed(2)}</p>
              )}
            </div>
            <div className="text-right">
              {product.weight && <p className="text-sm text-gray-500">Weight: {product.weight}</p>}
              {product.availability ? (
                <p className="text-sm text-green-600 font-medium">{product.availability}</p>
              ) : (
                <p className="text-sm text-green-600 font-medium">Availability unknown</p>
              )}
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleBuyNow}
              className="bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors duration-200"
            >
              Buy Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
