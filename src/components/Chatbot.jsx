import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Chatbot = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [filters, setFilters] = useState({
    brand: 'Any',
    screenSize: 'Any',
    processor: 'Any',
    ram: 'Any',
    storage: 'Any',
    graphicsCard: 'Any'
  });

  // Sample chat messages
  const [messages] = useState([
    {
      id: 1,
      sender: 'AI Assistant',
      text: "Hi there! I'm your AI assistant. How can I help you today?",
      avatar: '🤖'
    },
    {
      id: 2,
      sender: 'User',
      text: "I'm looking for a new laptop.",
      avatar: '👤'
    },
    {
      id: 3,
      sender: 'AI Assistant',
      text: "Great! What are you planning to use the laptop for?",
      avatar: '🤖'
    },
    {
      id: 4,
      sender: 'User',
      text: "Mostly for work and some light gaming.",
      avatar: '👤'
    },
    {
      id: 5,
      sender: 'AI Assistant',
      text: "Got it. Do you have a preferred screen size or budget?",
      avatar: '🤖'
    },
    {
      id: 6,
      sender: 'User',
      text: "Around 15 inches and a budget of $1500.",
      avatar: '👤'
    },
    {
      id: 7,
      sender: 'AI Assistant',
      text: "Okay, I'll find some options that fit your criteria. Please wait a moment.",
      avatar: '🤖'
    },
    {
      id: 8,
      sender: 'AI Assistant',
      text: "Here are a few laptops that match your requirements:",
      avatar: '🤖'
    }
  ]);

  // Sample product recommendations
  const [products] = useState([
    {
      id: 1,
      name: 'TechPro X15',
      specs: '15.6 inch, Intel Core i7, 16GB RAM, 512GB SSD, NVIDIA GeForce RTX 3060',
      image: '/api/placeholder/120/80',
      action: 'View Product'
    },
    {
      id: 2,
      name: 'UltraBook Pro 15',
      specs: '15.6 inch, AMD Ryzen 7, 16GB RAM, 512GB SSD, AMD Radeon RX 6600M',
      image: '/api/placeholder/120/80',
      action: 'View Product'
    },
    {
      id: 3,
      name: 'ZenithBook 15',
      specs: '15.6 inch, Intel Core i5, 16GB RAM, 512GB SSD, Intel Iris Xe Graphics',
      image: '/api/placeholder/120/80',
      action: 'View Product'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: Connect to backend API
      /*
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            filters: filters,
            priceRange: priceRange
          }),
        });
        const data = await response.json();
        // Handle response and update messages
      } catch (error) {
        console.error('Error sending message:', error);
      }
      */
      setMessage('');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    // TODO: Apply filters and refresh results
    /*
    try {
      const response = await fetch('/api/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: filters,
          priceRange: priceRange
        }),
      });
      const data = await response.json();
      // Handle filtered results
    } catch (error) {
      console.error('Error applying filters:', error);
    }
    */
    console.log('Applying filters:', filters, 'Price range:', priceRange);
  };

  const handleViewProduct = (productId) => {
    // TODO: Implement authentication check
    // const isLoggedIn = checkUserAuthentication(); // Replace with your actual authentication check
    const isLoggedIn = true; // Comment out authentication check for now

    if (isLoggedIn) {
      navigate(`/product/${productId}`);
    } else {
      // Redirect to login or signup page
      navigate('/login'); // Or /signup, depending on your preference
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Logo size="default" showText={true} />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Chat with us</h1>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{msg.sender}</span>
                  </div>
                  <div className={`inline-block px-4 py-2 rounded-lg max-w-md ${
                    msg.sender === 'User' 
                      ? 'bg-amber-400 text-black ml-auto' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {msg.text}
                  </div>
                </div>
                {msg.sender === 'User' && (
                  <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-lg">
                    👤
                  </div>
                )}
              </div>
            ))}

            {/* Product Recommendations */}
            <div className="space-y-4 mt-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center space-x-4">
                  <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <div className="w-16 h-12 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.specs}</p>
                    <button 
                      onClick={() => handleViewProduct(product.id)}
                      className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 text-sm font-medium transition-colors duration-200"
                    >
                      {product.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
                👤
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Filters Sidebar */}
        <div className="w-80 bg-white border-l p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>

          {/* Filter Dropdowns */}
          <div className="space-y-4">
            {Object.entries({
              brand: 'Brand',
              screenSize: 'Screen Size', 
              processor: 'Processor',
              ram: 'RAM',
              storage: 'Storage',
              graphicsCard: 'Graphics Card'
            }).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <select
                  value={filters[key]}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent appearance-none bg-white"
                >
                  <option value="Any">Any</option>
                  {key === 'brand' && (
                    <>
                      <option value="Apple">Apple</option>
                      <option value="Dell">Dell</option>
                      <option value="HP">HP</option>
                      <option value="Lenovo">Lenovo</option>
                    </>
                  )}
                  {key === 'screenSize' && (
                    <>
                      <option value="13 inch">13 inch</option>
                      <option value="15 inch">15 inch</option>
                      <option value="17 inch">17 inch</option>
                    </>
                  )}
                  {key === 'processor' && (
                    <>
                      <option value="Intel i5">Intel i5</option>
                      <option value="Intel i7">Intel i7</option>
                      <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                      <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                    </>
                  )}
                </select>
              </div>
            ))}

            {/* Price Range Slider */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="px-3">
                <input
                  type="range"
                  min="0"
                  max="3000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={applyFilters}
              className="w-full mt-6 bg-amber-400 text-black font-medium py-3 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;