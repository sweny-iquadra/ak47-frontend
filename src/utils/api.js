// API utility functions for connecting to FastAPI backend

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle FastAPI error responses
      if (data.detail) {
        if (typeof data.detail === 'string') {
          throw new Error(data.detail);
        } else if (Array.isArray(data.detail)) {
          const errorMessages = data.detail.map(err => err.msg).join(', ');
          throw new Error(errorMessages);
        } else {
          throw new Error('Request failed');
        }
      } else {
        throw new Error(data.message || 'Request failed');
      }
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Login user
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Google OAuth login
  googleLogin: async () => {
    window.location.href = `${API_BASE_URL}/auth/google-login`;
  }
};

// Chat API functions
export const chatAPI = {
  // Start a new chat session
  startSession: async (category) => {
    return apiCall('/chat/start-session', {
      method: 'POST',
      body: JSON.stringify({ category })
    });
  },

  // Send a message
  sendMessage: async (sessionId, message) => {
    return apiCall('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, message })
    });
  },

  // Get conversation history
  getConversationHistory: async (sessionId) => {
    return apiCall(`/conversations/${sessionId}`);
  },

  // Get search sessions
  getSearchSessions: async () => {
    return apiCall('/search-sessions');
  },

  // Link a chat session to the logged-in user
  linkSessionToUser: async (sessionId) => {
    const token = localStorage.getItem("token");
    if (!token || !sessionId) {
      console.error("Missing token or sessionId");
      return;
    }

    try {
      const apiUrl = `${API_BASE_URL}/chat/link-session`;
      console.log(apiUrl);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🛡️ Auth header
        },
        body: JSON.stringify({ session_id: sessionId }), // 📦 Payload
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Failed to link session:", data);
        return { success: false, error: data };
      } else {
        console.log("✅ Session linked:", data);
        return { success: true, data };
      }
    } catch (error) {
      console.error("🚨 Error linking session:", error);
      return { success: false, error: error.message };
    }
  },

  // Get recent conversations for the logged-in user
  getRecentConversations: async () => {
    return apiCall('/search-sessions');
  },

  // Load conversation history for a specific session
  loadConversationHistory: async (sessionId) => {
    return apiCall(`/conversations/${sessionId}`);
  },

  // Get products for a specific session
  getSessionProducts: async (sessionId) => {
    return apiCall(`/sessions/${sessionId}/products`);
  }
};

// Product API functions
export const productAPI = {
  // Search products
  searchProducts: async (query, category, minPrice = null, maxPrice = null) => {
    const params = new URLSearchParams({
      query,
      category,
      ...(minPrice && { min_price: minPrice }),
      ...(maxPrice && { max_price: maxPrice })
    });

    return apiCall(`/products/search?${params}`);
  },

  // Get product details
  getProduct: async (productId) => {
    return apiCall(`/products/${productId}`);
  }
};

// Order API functions
export const orderAPI = {
  // Create a new order
  createOrder: async (orderData) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  // Get user orders
  getOrders: async () => {
    return apiCall('/orders');
  },

  // Get specific order
  getOrder: async (orderId) => {
    return apiCall(`/orders/${orderId}`);
  }
};

// Payment API functions
export const paymentAPI = {
  // Create payment intent
  createPaymentIntent: async (amount, orderId) => {
    return apiCall('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, order_id: orderId })
    });
  }
};

// User management functions
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    return apiCall('/auth/profile');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  // Logout user
  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST'
    });
  }
};

// Utility functions
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const googleLogin = () => {
  window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/google-login`;
};

export default {
  authAPI,
  chatAPI,
  productAPI,
  orderAPI,
  paymentAPI,
  userAPI,
  isAuthenticated,
  getCurrentUser,
  clearAuth
}; 