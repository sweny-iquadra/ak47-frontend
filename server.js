
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', port: PORT });
});

// Chat endpoint for OpenAI integration
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    // Mock response for now - replace with actual OpenAI API call
    const mockResponse = {
      response: `I understand you're looking for "${message}". Let me help you find the perfect product!`,
      showFilters: message.toLowerCase().includes('looking for') || message.toLowerCase().includes('need') || message.toLowerCase().includes('want'),
      products: message.toLowerCase().includes('laptop') ? [
        {
          name: 'TechPro X15',
          specs: '15.6-inch, Intel Core i7, 16GB RAM, 512GB SSD, NVIDIA GeForce RTX 3060'
        },
        {
          name: 'UltraBook Pro 15',
          specs: '15.6-inch, AMD Ryzen 7, 16GB RAM, 512GB SSD, AMD Radeon RX 6600M'
        }
      ] : []
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json(mockResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
