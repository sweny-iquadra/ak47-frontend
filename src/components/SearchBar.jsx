
import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder, loading = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const quickPrompts = [
    "Find me wireless headphones under $100",
    "Show me the latest smartphones",
    "Looking for running shoes for women",
    "Help me find a laptop for gaming"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main Search Input */}
      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="w-full pl-14 pr-16 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
          />
          
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="absolute inset-y-0 right-0 mr-2 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Quick Action Prompts */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600 text-center font-medium">Try asking:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(prompt);
                onSearch(prompt);
              }}
              disabled={loading}
              className="text-left p-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/80 hover:shadow-md transition-all duration-200 text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>{prompt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
