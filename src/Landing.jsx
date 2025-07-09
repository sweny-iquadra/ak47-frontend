
import React from 'react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900">AK-47</div>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Shop
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Contact
              </a>
            </nav>

            {/* Search and Profile */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="relative h-96 md:h-[500px] lg:h-[600px]">
          {/* Background Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-200">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Welcome to AK-47
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 opacity-90">
                Your personal AI shopping assistant. Ask me anything!
              </p>
              
              {/* Search Bar */}
              <div className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      className="w-full px-6 py-4 text-lg border-0 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg shadow-lg transition duration-200 transform hover:scale-105">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation Menu (hidden by default) */}
      <div className="md:hidden hidden bg-white border-t">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Home
          </a>
          <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Shop
          </a>
          <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            About
          </a>
          <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
