
import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi there! I'm your AI shopping assistant. What product are you looking for today?",
      sender: 'AI Assistant'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [detectedCategory, setDetectedCategory] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dynamic filter configurations based on product categories
  const filterConfigs = {
    laptop: {
      brand: ['Any', 'Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI'],
      screenSize: ['Any', '13 inch', '14 inch', '15 inch', '16 inch', '17 inch'],
      processor: ['Any', 'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'],
      ram: ['Any', '8GB', '16GB', '32GB', '64GB'],
      storage: ['Any', '256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD'],
      graphicsCard: ['Any', 'Integrated', 'NVIDIA GTX 1650', 'NVIDIA RTX 3060', 'NVIDIA RTX 4060', 'AMD Radeon RX 6600M'],
      priceRange: [0, 3000]
    },
    smartphone: {
      brand: ['Any', 'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei'],
      screenSize: ['Any', '5.5 inch', '6.1 inch', '6.4 inch', '6.7 inch', '6.9 inch'],
      storage: ['Any', '64GB', '128GB', '256GB', '512GB', '1TB'],
      ram: ['Any', '4GB', '6GB', '8GB', '12GB', '16GB'],
      camera: ['Any', 'Single', 'Dual', 'Triple', 'Quad'],
      operatingSystem: ['Any', 'iOS', 'Android'],
      priceRange: [0, 1500]
    },
    headphones: {
      brand: ['Any', 'Sony', 'Bose', 'Apple', 'Sennheiser', 'Audio-Technica', 'Beats'],
      type: ['Any', 'Over-ear', 'On-ear', 'In-ear', 'Wireless', 'Wired'],
      features: ['Any', 'Noise Cancelling', 'Wireless', 'Gaming', 'Sports'],
      priceRange: [0, 500]
    },
    tv: {
      brand: ['Any', 'Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Panasonic'],
      screenSize: ['Any', '32 inch', '43 inch', '50 inch', '55 inch', '65 inch', '75 inch', '85 inch'],
      resolution: ['Any', 'HD', 'Full HD', '4K', '8K'],
      smartFeatures: ['Any', 'Smart TV', 'Android TV', 'webOS', 'Tizen'],
      priceRange: [0, 2000]
    }
  };

  const [filters, setFilters] = useState({});

  const detectProductCategory = (text) => {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes('laptop') || lowercaseText.includes('computer') || lowercaseText.includes('notebook')) {
      return 'laptop';
    } else if (lowercaseText.includes('phone') || lowercaseText.includes('smartphone') || lowercaseText.includes('mobile')) {
      return 'smartphone';
    } else if (lowercaseText.includes('headphone') || lowercaseText.includes('earphone') || lowercaseText.includes('earbuds') || lowercaseText.includes('audio')) {
      return 'headphones';
    } else if (lowercaseText.includes('tv') || lowercaseText.includes('television') || lowercaseText.includes('monitor')) {
      return 'tv';
    }
    
    return '';
  };

  const initializeFilters = (category) => {
    if (filterConfigs[category]) {
      const initialFilters = {};
      Object.keys(filterConfigs[category]).forEach(key => {
        if (key === 'priceRange') {
          initialFilters[key] = filterConfigs[category][key];
        } else {
          initialFilters[key] = 'Any';
        }
      });
      setFilters(initialFilters);
      setCurrentFilters(filterConfigs[category]);
      setDetectedCategory(category);
    }
  };

  const callOpenAI = async (userMessage, category = '') => {
    try {
      const systemPrompt = category 
        ? `You are a helpful AI shopping assistant specializing in ${category}. Help users find the perfect ${category} based on their needs. Be concise, friendly, and ask relevant questions about specifications, budget, and use cases. When discussing products, mention specific features and price ranges.`
        : "You are a helpful AI shopping assistant. Help users find products they're looking for. Ask about their needs, budget, and preferences. Be concise and friendly.";

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return "I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      const userMessage = {
        id: Date.now() + Math.random(),
        type: 'user',
        text: inputMessage,
        sender: 'User'
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Detect product category and initialize filters if needed
      const category = detectProductCategory(inputMessage);
      if (category && !currentFilters) {
        initializeFilters(category);
      }
      
      const messageToSend = inputMessage;
      setInputMessage('');
      
      try {
        const aiResponse = await callOpenAI(messageToSend, detectedCategory);
        
        const aiMessage = {
          id: Date.now() + Math.random(),
          type: 'ai',
          text: aiResponse,
          sender: 'AI Assistant'
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage = {
          id: Date.now() + Math.random(),
          type: 'ai',
          text: "I apologize, but I'm experiencing technical difficulties. Please try again.",
          sender: 'AI Assistant'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (filterType, value) => {
    const updatedFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(updatedFilters);

    // Generate AI response based on filter changes
    if (filterType === 'priceRange') {
      setIsLoading(true);
      const priceMessage = `I'm looking for ${detectedCategory} under $${value[1]}. Can you show me some options?`;
      
      try {
        const aiResponse = await callOpenAI(priceMessage, detectedCategory);
        const aiMessage = {
          id: Date.now() + Math.random(),
          type: 'ai',
          text: aiResponse,
          sender: 'AI Assistant'
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error getting AI response for filter change:', error);
      }
      
      setIsLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    setIsLoading(true);
    
    const filterSummary = Object.entries(filters)
      .filter(([key, value]) => value !== 'Any' && value !== undefined)
      .map(([key, value]) => {
        if (key === 'priceRange') {
          return `budget under $${value[1]}`;
        }
        return `${key}: ${value}`;
      })
      .join(', ');

    const filterMessage = `Based on my preferences: ${filterSummary}, can you recommend some ${detectedCategory} options?`;
    
    try {
      const aiResponse = await callOpenAI(filterMessage, detectedCategory);
      const aiMessage = {
        id: Date.now() + Math.random(),
        type: 'ai',
        text: aiResponse,
        sender: 'AI Assistant'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900">■ AK-47</div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home
              </button>
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Products
              </button>
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                About Us
              </button>
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Contact
              </button>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </nav>

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

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Chat with us</h2>
            {detectedCategory && (
              <p className="text-sm text-gray-600 mt-1">Currently helping you find: {detectedCategory}</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
                  
                  <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-900'}`}>
                    <div className="text-xs text-gray-600 mb-1">{message.sender}</div>
                    <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">AI</span>
                  </div>
                  <div className="bg-gray-200 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">AI Assistant</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white border-t p-4">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Filters Sidebar */}
        {currentFilters && (
          <div className="w-full lg:w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Filters for {detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1)}
            </h3>
            
            <div className="space-y-6">
              {Object.entries(currentFilters).map(([filterKey, filterOptions]) => (
                <div key={filterKey}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {filterKey.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  
                  {filterKey === 'priceRange' ? (
                    <div className="px-2">
                      <input
                        type="range"
                        min={filterOptions[0]}
                        max={filterOptions[1]}
                        value={filters[filterKey] ? filters[filterKey][1] : filterOptions[1]}
                        onChange={(e) => handleFilterChange(filterKey, [filterOptions[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>${filterOptions[0]}</span>
                        <span>${filters[filterKey] ? filters[filterKey][1] : filterOptions[1]}</span>
                      </div>
                    </div>
                  ) : (
                    <select 
                      value={filters[filterKey] || 'Any'}
                      onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      {filterOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              <button 
                onClick={handleApplyFilters}
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Finding Products...' : 'Apply Filters'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
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
