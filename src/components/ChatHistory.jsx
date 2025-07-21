
import React, { useState, useEffect } from 'react';
import { chatAPI } from '../utils/api';

const ChatHistory = ({ onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionsAndConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch all sessions for the user
        const sessionList = await chatAPI.getRecentConversations();
        // 2. For each session, fetch its conversations
        const sessionsWithConvos = await Promise.all(
          sessionList.map(async (session) => {
            const convos = await chatAPI.loadConversationHistory(session.session_id);
            // Debug: log the structure of convos
            if (convos && convos.length > 0) {
              console.log('Session', session.session_id, 'convos sample:', convos[0]);
            }
            // Generate a title: use category + first user message or fallback
            let title = session.product_category ? session.product_category : 'Chat Session';
            const firstUserMsg = convos.find(msg => msg.message_type === 'user');
            if (firstUserMsg && firstUserMsg.content) {
              const msgText = firstUserMsg.content;
              title += ': ' + msgText.slice(0, 40) + (msgText.length > 40 ? '...' : '');
            }
            // Preview: first user message or bot message
            let preview = '';
            if (firstUserMsg && firstUserMsg.content) preview = firstUserMsg.content;
            else if (convos[0] && convos[0].content) preview = convos[0].content;
            // Date/time
            const createdAt = session.created_at || (convos[0] && convos[0].created_at);
            // Category
            const category = session.product_category || 'General';
            return {
              id: session.session_id,
              title,
              date: createdAt ? new Date(createdAt).toISOString().slice(0, 10) : '',
              time: createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
              preview,
              category,
              messages: convos.map(msg => ({
                sender: msg.message_type === 'user' ? 'user' : 'bot',
                text: msg.content || '',
                timestamp: msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
              }))
            };
          })
        );
        // 3. Sort sessions by date descending
        sessionsWithConvos.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
        setSessions(sessionsWithConvos);
      } catch (err) {
        setError('Failed to load chat history.');
      }
      setLoading(false);
    };
    fetchSessionsAndConversations();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': 'bg-blue-100 text-blue-800',
      'Clothing': 'bg-purple-100 text-purple-800',
      'Home & Kitchen': 'bg-green-100 text-green-800',
      'Sports & Fitness': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (selectedSession) {
    // Sort messages by timestamp (if available)
    const sortedMessages = [...selectedSession.messages].sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return new Date('1970-01-01T' + a.timestamp) - new Date('1970-01-01T' + b.timestamp);
    });
    return (
      <div className="space-y-6">
        {/* Header with back button and session metadata */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedSession(null)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedSession.title}</h2>
              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                <span>{selectedSession.date} at {selectedSession.time}</span>
                <span>•</span>
                <span className="capitalize">{selectedSession.category}</span>
                <span>•</span>
                <span>{sortedMessages.length} messages</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedSession.category)}`}>{selectedSession.category}</span>
        </div>

        {/* Chatbot-style conversation UI */}
        <div className="flex flex-col space-y-6 max-h-[32rem] overflow-y-auto px-2 py-4">
          {sortedMessages.map((msg, idx) => (
            <div key={idx} className={`flex items-start space-x-4 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg ${msg.sender === 'bot'
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
                  <span className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                    {msg.sender === 'bot' ? (
                      <>
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-bold">A³</span>
                      </>
                    ) : (
                      'You'
                    )}
                  </span>
                </div>
                <div className={`inline-block px-6 py-4 rounded-2xl shadow-sm ${msg.sender === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-gray-50 text-gray-900 border border-gray-100'
                  }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                  {msg.timestamp && (
                    <div className="text-xs text-gray-400 mt-2 text-right">{msg.timestamp}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Chat History</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{sessions.length} conversations</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {session.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{session.preview}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(session.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{session.messages.length} messages</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(session.category)}`}>
                    {session.category}
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
          <p className="text-gray-600">Start chatting to see your history here.</p>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
