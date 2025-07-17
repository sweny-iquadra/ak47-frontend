import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from './Logo';
import { chatAPI, isAuthenticated, getCurrentUser } from '../utils/api';

const Chatbot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [requiresLogin, setRequiresLogin] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keep input focused after messages are added or loading changes
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [messages, loading]);

  // Initialize chat session when component mounts or searchQuery changes
  useEffect(() => {
    // Restore chat state if present in location.state
    if (location.state?.chatSession) {
      const { sessionId, messages, products, filters } = location.state.chatSession;
      setSessionId(sessionId || null);
      setMessages(messages || []);
      setProducts(products || []);
      setFilters(filters || {});
      setRequiresLogin(false);
      return;
    }
    const initializeChat = async () => {
      try {
        setLoading(true);
        setError(null);
        let category = 'general';
        if (location.state?.searchQuery) {
          category = location.state.searchQuery.toLowerCase().trim();
        }
        const sessionResponse = await chatAPI.startSession(category);
        setSessionId(sessionResponse.session_id);
        setMessages([
          {
            sender: 'bot',
            text: sessionResponse.message,
            step: sessionResponse.step || null
          }
        ]);
        setProducts(sessionResponse.products || []);
        setFilters(sessionResponse.filters || {});
        setRequiresLogin(!!sessionResponse.requires_login);
        
        // Store session info for logo click detection
        localStorage.setItem('recentChatSession', 'true');
        sessionStorage.setItem('chatSessionId', sessionResponse.session_id);
        localStorage.setItem('lastChatTime', new Date().toISOString());
        
        // If there's a search query, send it as the first message
        if (location.state?.searchQuery) {
          const searchQuery = location.state.searchQuery;
          setMessages(prev => [
            ...prev,
            { sender: 'user', text: searchQuery }
          ]);
          const messageResponse = await chatAPI.sendMessage(sessionResponse.session_id, searchQuery);
          handleMessageResponse(messageResponse);
        }
      } catch (err) {
        setError(err.message || 'Failed to start chat session.');
        setMessages([
          {
            sender: 'bot',
            text: 'Sorry, I encountered an error. Please try again.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    initializeChat();
    // eslint-disable-next-line
  }, [location.state?.searchQuery]);

  // Helper function to handle message responses
  const handleMessageResponse = (response) => {
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: response.message,
        step: response.step || null
      }
    ]);
    if (response.session_id) setSessionId(response.session_id);
    setProducts(response.products || []);
    setFilters(response.filters || {});
    setRequiresLogin(!!response.requires_login);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sessionId) return;
    setError(null);
    const userMsg = { sender: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);
    try {
      const response = await chatAPI.sendMessage(sessionId, userMsg.text);
      handleMessageResponse(response);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: err.message || 'Something went wrong.' }
      ]);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleViewProduct = (productId) => {
    if (!isAuthenticated()) {
      alert('Please log in to view product details.');
      navigate('/login', {
        state: {
          from: '/chat',
          chatSession: {
            sessionId,
            messages,
            products,
            filters,
            searchQuery: location.state?.searchQuery || null
          }
        }
      });
      return;
    }
    navigate(`/product/${Number(productId)}`);
  };

  const handleLoginPrompt = () => {
    navigate('/login', {
      state: {
        from: '/chat',
        chatSession: {
          sessionId,
          messages,
          products,
          filters,
          searchQuery: location.state?.searchQuery || null
        }
      }
    });
  };

  const handleLogoClick = () => {
    const hasRecentChat = localStorage.getItem('recentChatSession') ||
      sessionStorage.getItem('chatSessionId') ||
      localStorage.getItem('lastChatTime');
    if (hasRecentChat) {
      navigate('/chat');
    } else {
      navigate('/');
    }
  };
  const avatarUrl = user && user.avatar ? user.avatar : null;
  const avatarLetter = user && user.full_name
    ? user.full_name[0].toUpperCase()
    : (user && user.username ? user.username[0].toUpperCase() : 'U');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
                  className="text-amber-600 hover:text-amber-700 px-4 py-2 rounded font-medium border border-amber-600 hover:bg-amber-50 transition-colors duration-200"
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
                      <div className="px-4 py-2 text-gray-700 font-semibold border-b">
                        {user && user.full_name ? user.full_name : user && user.username ? user.username : 'User'}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {/* Profile Icon */}
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
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
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Chat with us</h1>
            {sessionId && (
              <p className="text-sm text-gray-600 mt-1">Session ID: {sessionId}</p>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                  {msg.sender === 'bot' ? '🤖' : '👤'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{msg.sender === 'bot' ? 'AI Assistant' : 'You'}</span>
                    {msg.step && (
                      <span className="text-xs text-gray-500">({msg.step})</span>
                    )}
                  </div>
                  <div className={`inline-block px-4 py-2 rounded-lg max-w-md ${msg.sender === 'user' ? 'bg-amber-400 text-black ml-auto' : 'bg-gray-100 text-gray-900'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {/* Product Recommendations */}
            {products.length > 0 && (
              <div className="space-y-4 mt-6">
                {!isAuthenticated() && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm2 8a1 1 0 10-2 0v-4a1 1 0 112 0v4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <strong>Login required:</strong> You need to be logged in to view product details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center space-x-4">
                    <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                      {product.image_url && (
                        <img src={Array.isArray(product.image_url) ? product.image_url[0] : product.image_url} alt={product.name} className="w-16 h-12 object-cover rounded" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <button 
                        onClick={() => handleViewProduct(product.id)}
                        className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 text-sm font-medium transition-colors duration-200"
                      >View Product</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Filters UI (if present) */}
            {filters && Object.keys(filters).length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Filters</h2>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(filters).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        className="border rounded px-2 py-1"
                        value={value}
                        onChange={e => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Message Input */}
          <div className="bg-white border-t p-4">
            {error && (
              <div
                className="mb-2 text-red-600 font-medium animate-pulse"
                aria-live="assertive"
                role="alert"
              >
                {error}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
                <span role="img" aria-label="User">👤</span>
              </div>
              <input
                type="text"
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-500"
                value={message}
                onChange={e => setMessage(e.target.value)}
                disabled={loading || requiresLogin}
                ref={inputRef}
                aria-invalid={!!error}
                aria-describedby={error ? 'chatbot-error' : undefined}
                autoFocus
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !message.trim() || requiresLogin}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
            {requiresLogin && (
              <div className="mt-2 text-center">
                <button
                  onClick={handleLoginPrompt}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors duration-200"
                >
                  Login to Continue Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 