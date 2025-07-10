
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware  
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    /\.replit\.dev$/,
    /\.repl\.co$/,
    process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : null
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, req.body);
  next();
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', port: PORT });
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
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`API test endpoint: http://0.0.0.0:${PORT}/api/test-key`);
});
