require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Body parser middleware
app.use(express.json());

// Custom request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString();
  console.log(`[${req.method}] ${req.originalUrl} - ${timestamp}`);
  next();
});

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'The Data Hub API is running'
  });
});

// Mock login authentication endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }

  if (username === 'raushan' && password === 'test123') {
    return res.status(200).json({
      message: 'Login successful',
      token: 'mock-jwt-token-xyz123'
    });
  }

  return res.status(401).json({
    message: 'Invalid credentials'
  });
});

// Resource routes
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Fallback error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});