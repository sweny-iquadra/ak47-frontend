import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HERO_CONTENT, FEATURES } from '../constants';
import { Header, SearchBar, FeatureCard } from '../components';
import Logo from '../components/Logo';
import { chatAPI, isAuthenticated, getCurrentUser } from '../utils/api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CombinedLandingChatbot = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingRecentConversations, setLoadingRecentConversations] = useState(false);
  const [hasAttemptedLoadRecent, setHasAttemptedLoadRecent] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keep input focused after messages are added or loading changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, loading]);

  // Load recent conversations when user is logged in and no active chat
  useEffect(() => {
    if (isAuthenticated() && !chatStarted && !loading && !loadingRecentConversations && messages.length === 0 && !hasAttemptedLoadRecent) {
      console.log('🔄 Triggering loadRecentConversations:', {
        isAuthenticated: isAuthenticated(),
        chatStarted,
        loading,
        loadingRecentConversations,
        messagesLength: messages.length,
        hasAttemptedLoadRecent
      });
      loadRecentConversations();
    }
  }, [loggedIn, chatStarted, loading, loadingRecentConversations, messages.length, hasAttemptedLoadRecent]);

  // Check for session linking after login
  useEffect(() => {
    const checkForSessionLinking = () => {
      const currentLoggedIn = isAuthenticated();
      const currentUser = getCurrentUser();

      if (currentLoggedIn !== loggedIn) {
        setLoggedIn(currentLoggedIn);
        setUser(currentUser);

        // If user just logged in
        if (currentLoggedIn) {
          console.log('🔄 User logged in, checking for session linking...');

          // If there's an active session, link it and preserve current conversation
          if (sessionId && messages.length > 0) {
            console.log('🔗 Linking active session to user and preserving current conversation...');
            handleSessionLinkedAndPreserve(sessionId);
          } else if (sessionId) {
            // Active session but no messages, just link it
            console.log('🔗 Linking active session to user...');
            handleSessionLinked(sessionId);
          } else {
            // No active session, load most recent session
            console.log('📋 No active session, loading most recent session...');
            loadRecentConversations();
          }
        }
      }
    };

    // Check immediately and set up interval
    checkForSessionLinking();
    const interval = setInterval(checkForSessionLinking, 1000);

    return () => clearInterval(interval);
  }, [loggedIn, sessionId, messages.length]);

  const handleSearch = async (query) => {
    setLoading(true);
    setHasAttemptedLoadRecent(false); // Reset flag when starting new chat
    try {
      const sessionResponse = await chatAPI.startSession(query);
      setSessionId(sessionResponse.session_id);
      setMessages([
        {
          sender: 'bot',
          text: sessionResponse.message,
          step: sessionResponse.step || null
        }
      ]);
      setProducts(sessionResponse.products || []);
      setFilters(sessionResponse.filters || sessionResponse.search_criteria || {});
      setRequiresLogin(!!sessionResponse.requires_login);
      setChatStarted(true);
    } catch (error) {
      setError(error.message || 'Failed to start chat session.');
    } finally {
      setLoading(false);
    }
  };

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
    // Preserve existing filters if new ones aren't provided in response
    setFilters(prev => response.filters || prev || {});
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

      // Update messages and products, but preserve existing filters
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
      // Preserve existing filters if new ones aren't provided
      setFilters(prev => response.filters || prev || {});
      setRequiresLogin(!!response.requires_login);

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

  const handleViewProduct = async (productId) => {
    if (!isAuthenticated()) {
      handleLoginPrompt();
      return;
    }
    try {
      if (!productId) {
        alert("Product ID is missing!");
        return;
      }
      const token = localStorage.getItem("token");
      const apiUrl = `${API_BASE_URL}/products/${productId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401) {
          alert("Please log in to view this product.");
          return;
        }
        throw new Error("Failed to fetch product");
      }
      const product = await response.json();
      navigate(`/product-details/${product.id}`, { state: { product } });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginPrompt = () => {
    navigate('/login', {
      state: {
        from: '/chat',
        chatSession: {
          messages,
          session_id: sessionId,
          products,
          filters,
        }
      }
    });
  };

  const handleLogoClick = () => {
    setChatStarted(false);
    setSessionId(null);
    setMessages([]);
    setProducts([]);
    setFilters({});
    setRequiresLogin(false);
    setError(null);
    setHasAttemptedLoadRecent(false);
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
    setChatStarted(false);
    setSessionId(null);
    setMessages([]);
    setProducts([]);
    setFilters({});
    setRequiresLogin(false);
    setError(null);
    setHasAttemptedLoadRecent(false); // Reset this so automatic loading works after re-login
  };

  // Load recent conversations for the logged-in user
  const loadRecentConversations = async () => {
    if (!isAuthenticated()) return;

    try {
      setLoadingRecentConversations(true);
      console.log('🔍 Fetching recent sessions...');
      const recentSessions = await chatAPI.getRecentConversations();
      console.log('📋 Recent sessions:', recentSessions);

      if (recentSessions && recentSessions.length > 0) {
        // Get the most recent session
        const mostRecentSession = recentSessions[0];
        console.log('🎯 Most recent session:', mostRecentSession);

        // Check if the most recent session is different from current session
        if (sessionId && sessionId !== mostRecentSession.session_id) {
          console.log('🔄 Different session detected, loading most recent session data...');
        }

        // Load ALL conversation history for the most recent session
        console.log('📝 Loading ALL conversation history for session:', mostRecentSession.session_id);
        const conversationHistory = await chatAPI.loadConversationHistory(mostRecentSession.session_id);
        console.log('💬 Complete conversation history:', conversationHistory);

        // Load ALL products associated with this session
        console.log('🛍️ Loading ALL products for session:', mostRecentSession.session_id);
        let sessionProducts = [];
        try {
          sessionProducts = await chatAPI.getSessionProducts(mostRecentSession.session_id);
          console.log('📦 All session products:', sessionProducts);
        } catch (productError) {
          console.warn('⚠️ Failed to load products for session:', productError);
          // Continue without products if they fail to load
        }

        if (conversationHistory && conversationHistory.length > 0) {
          // Convert ALL conversation history to messages format
          const loadedMessages = conversationHistory.map(conv => ({
            sender: conv.message_type === 'user' ? 'user' : 'bot',
            text: conv.content,
            step: conv.conversation_metadata?.step || null
          }));

          console.log('🔄 Converted ALL messages:', loadedMessages);

          setMessages(loadedMessages);
          setSessionId(mostRecentSession.session_id);
          setChatStarted(true);

          // Set ALL products if any were found
          if (sessionProducts && sessionProducts.length > 0) {
            setProducts(sessionProducts);
            console.log('✅ Loaded ALL products from most recent session:', sessionProducts.length, 'products');
          }

          // Load session criteria and filters if available
          if (mostRecentSession.search_criteria) {
            setFilters(mostRecentSession.search_criteria);
          }

          console.log('✅ Loaded complete most recent session:', {
            sessionId: mostRecentSession.session_id,
            totalMessages: loadedMessages.length,
            totalProducts: sessionProducts ? sessionProducts.length : 0
          });
        } else {
          console.log('ℹ️ No conversation history found for most recent session');
        }
      } else {
        console.log('ℹ️ No recent sessions found for user');
      }
    } catch (error) {
      console.error('❌ Error loading recent conversations:', error);
      setError('Failed to load recent conversations');
    } finally {
      setLoadingRecentConversations(false);
      setHasAttemptedLoadRecent(true); // Set flag after attempting to load
    }
  };

  // Handle successful session linking and load recent conversations
  const handleSessionLinked = async (sessionId) => {
    if (!sessionId) return;

    try {
      const linkResult = await chatAPI.linkSessionToUser(sessionId);

      if (linkResult.success) {
        console.log('✅ Session linked successfully, loading most recent conversations...');
        // Load most recent conversations after linking session
        await loadRecentConversations();
      } else {
        console.error('❌ Failed to link session:', linkResult.error);
        setError('Failed to link session to user');
      }
    } catch (error) {
      console.error('❌ Error in session linking process:', error);
      setError('Failed to complete session linking');
    }
  };

  // Handle successful session linking while preserving current conversation
  const handleSessionLinkedAndPreserve = async (sessionId) => {
    if (!sessionId) return;

    try {
      const linkResult = await chatAPI.linkSessionToUser(sessionId);

      if (linkResult.success) {
        console.log('✅ Session linked successfully, preserving current conversation...');
        // Preserve current messages and session, don't reload from database
        setSessionId(sessionId);
        setChatStarted(true);
        console.log('✅ Current conversation preserved. Chat will continue from last message.');
      } else {
        console.error('❌ Failed to link session:', linkResult.error);
        setError('Failed to link session to user');
      }
    } catch (error) {
      console.error('❌ Error in session linking process:', error);
      setError('Failed to complete session linking');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start">
        {!chatStarted && (
          <div className="w-full max-w-2xl mt-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{HERO_CONTENT.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{HERO_CONTENT.subtitle}</p>
            </div>

            {/* Show loading indicator for recent conversations */}
            {isAuthenticated() && loadingRecentConversations && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-lg">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading your recent conversations...
                </div>
              </div>
            )}

            <SearchBar
              onSearch={handleSearch}
              placeholder="Hi! What can I help you find today?"
              loading={loading}
            />
            <section className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {FEATURES.map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    icon={<span />}
                    title={feature.title}
                    description={feature.description}
                    iconColor={feature.iconColor}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
        {chatStarted && (
          <div className="w-full max-w-4xl mt-8">
            {/* Main Chat Area */}
            <div className="bg-white rounded-xl shadow-lg flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => {
                  // Check if this is a new session (for complete chat history)
                  const isNewSession = idx > 0 && msg.sessionId && msg.sessionId !== messages[idx - 1].sessionId;

                  return (
                    <div key={idx}>
                      {/* Show session break if this is a new session */}
                      {isNewSession && (
                        <div className="flex items-center my-6">
                          <div className="flex-1 border-t border-gray-300"></div>
                          <div className="px-4 py-2 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
                            New Session
                          </div>
                          <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                      )}

                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                          {msg.sender === 'bot' ? '🤖' : '👤'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{msg.sender === 'bot' ? 'AI Assistant' : 'You'}</span>
                            {msg.step && (
                              <span className="text-xs text-gray-500">({msg.step})</span>
                            )}
                            {msg.timestamp && (
                              <span className="text-xs text-gray-400">
                                {new Date(msg.timestamp).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className={`inline-block px-4 py-2 rounded-lg max-w-md ${msg.sender === 'user' ? 'bg-amber-400 text-black ml-auto' : 'bg-gray-100 text-gray-900'}`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
                {/* Product Recommendations */}
                {products.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {/* 3. Show warning if not logged in, but do not block product loading */}
                    {!isAuthenticated() && (
                      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4 flex items-center">
                        <svg className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm2 8a1 1 0 10-2 0v-4a1 1 0 112 0v4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-yellow-800 font-medium">To view product you need to login.</span>
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
                            onClick={() => {
                              if (!isAuthenticated()) {
                                handleLoginPrompt();
                              } else {
                                handleViewProduct(product.id);
                              }
                            }}
                            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 text-sm font-medium transition-colors duration-200"
                          >View Product</button>
                        </div>
                      </div>
                    ))}
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
        )}
      </main>
    </div>
  );
};

export default CombinedLandingChatbot;