
import React, { useState, useRef, useEffect } from 'react';

const Chatbot = ({ initialQuery = '', onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi there! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    brand: 'Any',
    screenSize: 'Any',
    processor: 'Any',
    ram: 'Any',
    storage: 'Any',
    graphicsCard: 'Any',
    priceRange: [0, 1500]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const callOpenAI = async (userMessage, conversationHistory) => {
    try {
      // In Replit, when running in parallel, the server runs on the same domain but different internal routing
      // We can use relative URLs since both services are served through the same domain
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: conversationHistory
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return {
        response: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        showFilters: false,
        products: []
      };
    }
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Create conversation history for context
    const conversationHistory = messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const aiResponse = await callOpenAI(messageText, conversationHistory);
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: aiResponse.response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);

    // Show filters if AI determines user is looking for products
    if (aiResponse.showFilters) {
      setShowFilters(true);
    }

    // Update products if any are returned
    if (aiResponse.products && aiResponse.products.length > 0) {
      setProducts(aiResponse.products);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const applyFilters = () => {
    // This would typically filter products based on selected criteria
    console.log('Applying filters:', filters);
  };

  const filterOptions = {
    brand: ['Any', 'Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'],
    screenSize: ['Any', '13"', '14"', '15"', '16"', '17"'],
    processor: ['Any', 'Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 5', 'AMD Ryzen 7'],
    ram: ['Any', '4GB', '8GB', '16GB', '32GB', '64GB'],
    storage: ['Any', '256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD'],
    graphicsCard: ['Any', 'Integrated', 'NVIDIA GTX', 'NVIDIA RTX', 'AMD Radeon']
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-5/6 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Chat with us</h2>
              <p className="text-sm text-gray-600">AI Assistant</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={`message-${message.id}-${message.timestamp.getTime()}-${index}`} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-medium">
                  {message.type === 'bot' ? 'AI' : 'U'}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">
                    {message.type === 'bot' ? 'AI Assistant' : 'User'}
                  </div>
                  <div className={`inline-block p-3 rounded-lg max-w-xs ${
                    message.type === 'user' 
                      ? 'bg-amber-500 text-white ml-auto' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-medium">
                  AI
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">AI Assistant</div>
                  <div className="inline-block p-3 rounded-lg bg-gray-100 text-gray-800">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Results */}
            {products.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="font-semibold text-gray-800">Here are some options that match your requirements:</h3>
                {products.map((product, index) => (
                  <div key={`product-${index}-${product.name.replace(/\s+/g, '-')}`} className="border rounded-lg p-4 flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.specs}</p>
                      <button className="text-amber-600 text-sm font-medium mt-2 hover:text-amber-700">
                        View Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 bg-gray-50 border-l p-6">
            <h3 className="text-lg font-semibold mb-6">Filters</h3>
            
            <div className="space-y-6">
              {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <select
                    value={filters[key]}
                    onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="w-full mt-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
