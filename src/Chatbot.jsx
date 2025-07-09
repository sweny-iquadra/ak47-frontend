
import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi there! I'm your AI assistant. How can I help you today?",
      sender: 'AI Assistant'
    },
    {
      id: 2,
      type: 'user',
      text: "I'm looking for a new laptop.",
      sender: 'User'
    },
    {
      id: 3,
      type: 'ai',
      text: "Great! What are you planning to use the laptop for?",
      sender: 'AI Assistant'
    },
    {
      id: 4,
      type: 'user',
      text: "Mostly for work and some light gaming.",
      sender: 'User'
    },
    {
      id: 5,
      type: 'ai',
      text: "Got it. Do you have a preferred screen size or budget?",
      sender: 'AI Assistant'
    },
    {
      id: 6,
      type: 'user',
      text: "Around 15 inches and a budget of $1500.",
      sender: 'User'
    },
    {
      id: 7,
      type: 'ai',
      text: "Okay, I'll find some options that fit your criteria. Please wait a moment.",
      sender: 'AI Assistant'
    },
    {
      id: 8,
      type: 'ai',
      text: "Here are a few laptops that match your requirements:",
      sender: 'AI Assistant'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [filters, setFilters] = useState({
    brand: 'Any',
    screenSize: 'Any',
    processor: 'Any',
    ram: 'Any',
    storage: 'Any',
    graphicsCard: 'Any',
    priceRange: [0, 1500]
  });

  const [products] = useState([
    {
      id: 1,
      name: 'TechPro X15',
      specs: '15.5 inch, Intel Core i7, 16GB RAM, 512GB SSD, NVIDIA GeForce RTX 3060',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      name: 'UltraBook Pro 15',
      specs: '15.6 inch, AMD Ryzen 7, 16GB RAM, 512GB SSD, AMD Radeon RX 6600M',
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      name: 'ZenithBook 15',
      specs: '15.6 inch, Intel Core i5, 16GB RAM, 512GB SSD, Intel Iris Xe Graphics',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputMessage,
        sender: 'User'
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          text: "I understand your request. Let me help you find the best options.",
          sender: 'AI Assistant'
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900">■ AK-47</div>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Products
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                About Us
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Contact
              </a>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </nav>

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

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Chat with us</h2>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0">
                    {message.type === 'user' ? (
                      <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-900">U</span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">AI</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-900'}`}>
                    <div className="text-xs text-gray-600 mb-1">{message.sender}</div>
                    <div className="text-sm">{message.text}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Product Results */}
            <div className="space-y-4 mt-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex space-x-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.specs}</p>
                      <button className="text-blue-600 text-sm hover:underline">View Product</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t p-4">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button 
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
          
          <div className="space-y-6">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select 
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option>Any</option>
                <option>Apple</option>
                <option>Dell</option>
                <option>HP</option>
                <option>Lenovo</option>
                <option>ASUS</option>
              </select>
            </div>

            {/* Screen Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Screen Size</label>
              <select 
                value={filters.screenSize}
                onChange={(e) => handleFilterChange('screenSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option>Any</option>
                <option>13 inch</option>
                <option>14 inch</option>
                <option>15 inch</option>
                <option>16 inch</option>
                <option>17 inch</option>
              </select>
            </div>

            {/* Processor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Processor</label>
              <select 
                value={filters.processor}
                onChange={(e) => handleFilterChange('processor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option>Any</option>
                <option>Intel Core i3</option>
                <option>Intel Core i5</option>
                <option>Intel Core i7</option>
                <option>Intel Core i9</option>
                <option>AMD Ryzen 5</option>
                <option>AMD Ryzen 7</option>
              </select>
            </div>

            {/* RAM Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RAM</label>
              <select 
                value={filters.ram}
                onChange={(e) => handleFilterChange('ram', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option>Any</option>
                <option>8GB</option>
                <option>16GB</option>
                <option>32GB</option>
                <option>64GB</option>
              </select>
            </div>

            {/* Storage Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Storage</label>
              <select 
                value={filters.storage}
                onChange={(e) => handleFilterChange('storage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option>Any</option>
                <option>256GB SSD</option>
                <option>512GB SSD</option>
                <option>1TB SSD</option>
                <option>2TB SSD</option>
              </select>
            </div>

            {/* Graphics Card Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Graphics Card</label>
              <select 
                value={filters.graphicsCard}
                onChange={(e) => handleFilterChange('graphicsCard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option>Any</option>
                <option>Integrated</option>
                <option>NVIDIA GTX 1650</option>
                <option>NVIDIA RTX 3060</option>
                <option>NVIDIA RTX 4060</option>
                <option>AMD Radeon RX 6600M</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="3000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>$0</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FDE047;
          cursor: pointer;
          border: 2px solid #374151;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FDE047;
          cursor: pointer;
          border: 2px solid #374151;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
