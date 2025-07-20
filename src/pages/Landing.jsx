
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_CONTENT, FEATURES } from '../constants';
import { Header, SearchBar, FeatureCard } from '../components';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      {!chatStarted ? (
        // Welcome Screen
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {HERO_CONTENT.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {HERO_CONTENT.subtitle}
              </p>
            </div>

            {/* Loading indicator for recent conversations */}
            {isAuthenticated() && loadingRecentConversations && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-blue-700 rounded-full shadow-lg border border-blue-100">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading your recent conversations...
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-12">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Hi! What can I help you find today?"
                loading={loading}
              />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <div key={feature.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        // Chat Interface
        <main className="flex-1 flex flex-col h-screen">
          <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-6">
            {/* Chat Container */}
            <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 flex flex-col overflow-hidden">
              
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">AI Shopping Assistant</h2>
                    <p className="text-white/80 text-sm">Online • Ready to help</p>
                  </div>
                </div>
                <button
                  onClick={handleLogoClick}
                  className="text-white/80 hover:text-white transition-colors duration-200"
                  aria-label="Start new conversation"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => {
                  const isNewSession = idx > 0 && msg.sessionId && msg.sessionId !== messages[idx - 1].sessionId;

                  return (
                    <div key={idx}>
                      {/* Session Break */}
                      {isNewSession && (
                        <div className="flex items-center my-8">
                          <div className="flex-1 border-t border-gray-200"></div>
                          <div className="px-4 py-2 bg-gray-100 rounded-full text-xs text-gray-500 font-medium">
                            New Session
                          </div>
                          <div className="flex-1 border-t border-gray-200"></div>
                        </div>
                      )}

                      {/* Message */}
                      <div className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === 'bot' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                            : 'bg-gradient-to-r from-amber-400 to-orange-500'
                        }`}>
                          {msg.sender === 'bot' ? (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        
                        <div className={`flex-1 max-w-md ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {msg.sender === 'bot' ? 'AI Assistant' : 'You'}
                            </span>
                            {msg.step && (
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                {msg.step}
                              </span>
                            )}
                          </div>
                          <div className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />

                {/* Product Recommendations */}
                {products.length > 0 && (
                  <div className="space-y-4 mt-8">
                    {!isAuthenticated() && (
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                          <svg className="h-6 w-6 text-yellow-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm2 8a1 1 0 10-2 0v-4a1 1 0 112 0v4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-yellow-800 font-medium">Login required to view product details</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {product.image_url ? (
                                <img 
                                  src={Array.isArray(product.image_url) ? product.image_url[0] : product.image_url} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{product.name}</h3>
                              <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>
                              <button
                                onClick={() => {
                                  if (!isAuthenticated()) {
                                    handleLoginPrompt();
                                  } else {
                                    handleViewProduct(product.id);
                                  }
                                }}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                View Product
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4 bg-white/50 backdrop-blur-sm">
                {error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 bg-white shadow-sm"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      disabled={loading || requiresLogin}
                      ref={inputRef}
                      placeholder="Type your message..."
                    />
                    {message.trim() && (
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                        disabled={loading || !message.trim() || requiresLogin}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    )}
                  </div>
                </form>

                {requiresLogin && (
                  <div className="mt-3 text-center">
                    <button
                      onClick={handleLoginPrompt}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-amber-600 hover:to-orange-600 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Login to Continue Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default CombinedLandingChatbot;
