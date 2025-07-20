
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        {!chatStarted && (
          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-3xl text-center">
              {/* AI Assistant Welcome */}
              <div className="mb-12 space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Meet A³, Your AI Assistant
                </h1>
                
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  {HERO_CONTENT.subtitle}
                </p>

                {/* Loading indicator for recent conversations */}
                {isAuthenticated() && loadingRecentConversations && (
                  <div className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading your conversation history...
                  </div>
                )}
              </div>

              {/* Enhanced Search Bar */}
              <div className="mb-16">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="What would you like to find today?"
                  loading={loading}
                />
              </div>

              {/* Simplified Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {FEATURES.map((feature) => (
                  <div key={feature.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      feature.iconColor === 'blue' ? 'from-blue-500 to-blue-600' :
                      feature.iconColor === 'green' ? 'from-emerald-500 to-emerald-600' :
                      'from-purple-500 to-purple-600'
                    } flex items-center justify-center mb-4 mx-auto`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {feature.iconColor === 'blue' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        ) : feature.iconColor === 'green' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        )}
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {chatStarted && (
          <div className="flex-1 flex flex-col px-4 py-6">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
              {/* Chat Container */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 flex flex-col flex-1 overflow-hidden">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((msg, idx) => {
                    const isNewSession = idx > 0 && msg.sessionId && msg.sessionId !== messages[idx - 1].sessionId;

                    return (
                      <div key={idx}>
                        {isNewSession && (
                          <div className="flex items-center my-8">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <div className="px-4 py-2 bg-gray-100 rounded-full text-xs text-gray-500 font-medium">
                              New Conversation
                            </div>
                            <div className="flex-1 border-t border-gray-200"></div>
                          </div>
                        )}

                        <div className={`flex items-start space-x-4 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg ${
                            msg.sender === 'bot' 
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                              : 'bg-gradient-to-br from-amber-500 to-orange-600'
                          }`}>
                            {msg.sender === 'bot' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                          </div>

                          {/* Message Content */}
                          <div className={`flex-1 max-w-xl ${msg.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-semibold text-gray-700">
                                {msg.sender === 'bot' ? 'AI Assistant' : 'You'}
                              </span>
                              {msg.step && (
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                  {msg.step}
                                </span>
                              )}
                            </div>
                            
                            <div className={`inline-block px-6 py-4 rounded-2xl shadow-sm ${
                              msg.sender === 'user' 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                                : 'bg-gray-50 text-gray-900 border border-gray-100'
                            }`}>
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />

                  {/* Product Recommendations */}
                  {products.length > 0 && (
                    <div className="space-y-4 mt-8">
                      {!isAuthenticated() && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm2 8a1 1 0 10-2 0v-4a1 1 0 112 0v4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-amber-800 font-medium">Login required to view product details</span>
                        </div>
                      )}
                      
                      <div className="grid gap-4">
                        {products.map((product) => (
                          <div key={product.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center space-x-6">
                              <div className="w-24 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                                {product.image_url ? (
                                  <img 
                                    src={Array.isArray(product.image_url) ? product.image_url[0] : product.image_url} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover rounded-xl" 
                                  />
                                ) : (
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                
                                <button
                                  onClick={() => {
                                    if (!isAuthenticated()) {
                                      handleLoginPrompt();
                                    } else {
                                      handleViewProduct(product.id);
                                    }
                                  }}
                                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                  View Details
                                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                  </svg>
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
                <div className="border-t border-gray-100 p-6 bg-white/50 backdrop-blur-sm">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 shadow-sm"
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          disabled={loading || requiresLogin}
                          ref={inputRef}
                          placeholder="Type your message..."
                        />
                        {loading && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                      disabled={loading || !message.trim() || requiresLogin}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>

                  {requiresLogin && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={handleLoginPrompt}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login to Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CombinedLandingChatbot;
