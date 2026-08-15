const express = require('express');
const postsRouter = require('./routes/posts');

const app = express();
const PORT = 5000;

// Body parser middleware for JSON payloads
app.use(express.json());

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'The Data Hub API is running'
  });
});

// Mount resource routes
app.use('/posts', postsRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Basic fallback error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});