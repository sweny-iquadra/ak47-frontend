
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';

const ProductDetails = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Logo size="default" showText={true} />
            </div>

            {/* Navigation Links - Home and Chatbot */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                to="/chat"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Chatbot
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Search icon */}
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* Wishlist icon */}
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              {/* Cart icon */}
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </button>
              
              {/* Profile */}
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
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

        {/* Pricing Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pricing
          </h2>
          <p className="text-gray-600 mb-6">
            The Nova X500 is available for $799.99. Price may vary depending on retailer promotions and discounts.
          </p>
          
          <button
            onClick={handleBuyNow}
            className="w-full max-w-sm bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Buy Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
