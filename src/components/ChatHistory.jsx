
import React, { useState, useEffect } from 'react';

const ChatHistory = ({ onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock chat history data
  const mockSessions = [
    {
      id: 'session_1',
      title: 'Looking for Gaming Laptops',
      date: '2024-01-15',
      time: '14:30',
      preview: 'I need a gaming laptop under $1500...',
      category: 'Electronics',
      messages: [
        { sender: 'user', text: 'I need a gaming laptop under $1500', timestamp: '14:30' },
        { sender: 'bot', text: 'I can help you find the perfect gaming laptop! What games do you primarily play?', timestamp: '14:31' },
        { sender: 'user', text: 'Mostly FPS games like Call of Duty and some AAA titles', timestamp: '14:32' },
        { sender: 'bot', text: 'Great! For FPS and AAA games, you\'ll want a laptop with at least GTX 1660 Ti or RTX 3060. Here are some excellent options under $1500:', timestamp: '14:33' },
        { sender: 'user', text: 'The ASUS ROG Strix looks interesting. Can you tell me more?', timestamp: '14:35' },
        { sender: 'bot', text: 'The ASUS ROG Strix G15 is an excellent choice! It features AMD Ryzen 7, RTX 3060, 16GB RAM, and a 144Hz display. Perfect for competitive gaming.', timestamp: '14:36' }
      ]
    },
    {
      id: 'session_2',
      title: 'Winter Clothing Shopping',
      date: '2024-01-14',
      time: '16:45',
      preview: 'I need warm winter jackets...',
      category: 'Clothing',
      messages: [
        { sender: 'user', text: 'I need warm winter jackets for cold weather', timestamp: '16:45' },
        { sender: 'bot', text: 'I\'d be happy to help you find warm winter jackets! What\'s your budget and preferred style?', timestamp: '16:46' },
        { sender: 'user', text: 'Budget is around $200-300, prefer something stylish but functional', timestamp: '16:47' },
        { sender: 'bot', text: 'Perfect! Here are some excellent winter jackets that balance style and warmth in your budget range:', timestamp: '16:48' }
      ]
    },
    {
      id: 'session_3',
      title: 'Smart Home Devices',
      date: '2024-01-13',
      time: '10:15',
      preview: 'Looking for smart speakers and lights...',
      category: 'Electronics',
      messages: [
        { sender: 'user', text: 'Looking for smart speakers and lights for my new apartment', timestamp: '10:15' },
        { sender: 'bot', text: 'Exciting! Smart home devices can really enhance your living space. What\'s the size of your apartment?', timestamp: '10:16' },
        { sender: 'user', text: 'It\'s a 2-bedroom apartment, about 1000 sq ft', timestamp: '10:17' },
        { sender: 'bot', text: 'For a 1000 sq ft apartment, I recommend starting with 2-3 smart speakers and smart bulbs for main areas. Here are my top recommendations:', timestamp: '10:18' }
      ]
    },
    {
      id: 'session_4',
      title: 'Kitchen Appliances',
      date: '2024-01-12',
      time: '09:20',
      preview: 'Need recommendations for kitchen appliances...',
      category: 'Home & Kitchen',
      messages: [
        { sender: 'user', text: 'Need recommendations for kitchen appliances for my new home', timestamp: '09:20' },
        { sender: 'bot', text: 'Congratulations on your new home! What kitchen appliances are you looking to purchase?', timestamp: '09:21' },
        { sender: 'user', text: 'Mainly a refrigerator, microwave, and coffee maker', timestamp: '09:22' },
        { sender: 'bot', text: 'Great choices! Let me help you find the best appliances for your needs and budget. What\'s your total budget for these three items?', timestamp: '09:23' }
      ]
    },
    {
      id: 'session_5',
      title: 'Fitness Equipment',
      date: '2024-01-11',
      time: '18:30',
      preview: 'Home gym setup recommendations...',
      category: 'Sports & Fitness',
      messages: [
        { sender: 'user', text: 'Home gym setup recommendations for small space', timestamp: '18:30' },
        { sender: 'bot', text: 'Perfect timing for New Year fitness goals! What type of workouts do you prefer?', timestamp: '18:31' },
        { sender: 'user', text: 'Cardio and strength training, but space is limited', timestamp: '18:32' },
        { sender: 'bot', text: 'For small spaces, I recommend versatile equipment that serves multiple purposes. Here are some space-efficient options:', timestamp: '18:33' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
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
    return (
      <div className="space-y-6">
        {/* Header with back button */}
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
              <p className="text-sm text-gray-500">
                {formatDate(selectedSession.date)} at {selectedSession.time}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedSession.category)}`}>
            {selectedSession.category}
          </span>
        </div>

        {/* Chat messages */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {selectedSession.messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start space-x-3 max-w-2xl">
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                } ${msg.sender === 'user' ? 'rounded-br-lg' : 'rounded-bl-lg'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
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
