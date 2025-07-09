
const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware  
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    /\.replit\.dev$/,
    /\.repl\.co$/
  ],
  credentials: true
}));
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', port: PORT });
});

// Test OpenAI API key endpoint
app.get('/api/test-key', (req, res) => {
  const hasKey = !!process.env.OPENAI_API_KEY;
  const keyLength = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0;
  res.json({ 
    hasKey, 
    keyLength,
    keyStart: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) + '...' : 'Not set'
  });
});

// Chat endpoint for OpenAI integration
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        response: "I'm sorry, the AI service is not properly configured. Please check the server configuration.",
        showFilters: false,
        products: []
      });
    }

    // Build conversation context
    const systemPrompt = `You are an AI shopping assistant for AK-47 AI Assistant. Your role is to help users find products by understanding their needs and preferences. 

When a user expresses interest in a product (using words like "looking for", "need", "want", "searching for"), you should:
1. Ask clarifying questions about their requirements
2. Provide helpful product recommendations
3. Format your response as a JSON object with these fields:
   - response: Your conversational response
   - showFilters: true if user is looking for products, false otherwise
   - products: Array of product objects with name and specs (if applicable)

Be conversational, helpful, and focus on understanding the user's specific needs. If they're looking for laptops, phones, or other electronics, provide specific recommendations with technical specs.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Try to parse JSON response, fallback to plain text
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      // If not JSON, create a structured response
      const showFilters = message.toLowerCase().includes('looking for') || 
                         message.toLowerCase().includes('need') || 
                         message.toLowerCase().includes('want') ||
                         message.toLowerCase().includes('searching for');
      
      parsedResponse = {
        response: aiResponse,
        showFilters: showFilters,
        products: []
      };
    }

    // Add sample products for laptop queries
    if (message.toLowerCase().includes('laptop') && parsedResponse.products.length === 0) {
      parsedResponse.products = [
        {
          name: 'TechPro X15',
          specs: '15.6-inch, Intel Core i7, 16GB RAM, 512GB SSD, NVIDIA GeForce RTX 3060'
        },
        {
          name: 'UltraBook Pro 15',
          specs: '15.6-inch, AMD Ryzen 7, 16GB RAM, 512GB SSD, AMD Radeon RX 6600M'
        },
        {
          name: 'ZenithBook 15',
          specs: '15.6-inch, Intel Core i5, 16GB RAM, 512GB SSD, Intel Iris Xe Graphics'
        }
      ];
    }

    res.json(parsedResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      response: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      showFilters: false,
      products: []
    });
  }
});

// API routes should come first, then serve React app for all other routes
app.get('*', (req, res) => {
  // Only serve React app for non-API routes
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
