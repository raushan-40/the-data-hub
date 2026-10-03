require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const uploadsRouter = require('./routes/uploads');

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server wrapping Express
const server = http.createServer(app);

// Connect to MongoDB Atlas
connectDB();

// CORS Middleware for Express HTTP routes
app.use(cors({
  origin: true,
  credentials: true
}));

// Initialize Socket.io attached to the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket connection & real-time messaging handler
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Listen for incoming chat messages
  socket.on('chat:message', (payload) => {
    // Validate payload to prevent empty or malformed data
    if (!payload || typeof payload.text !== 'string' || !payload.text.trim()) {
      return;
    }

    const messageData = {
      id: `${Date.now()}-${socket.id}`,
      text: payload.text.trim()
    };

    // Broadcast message to ALL connected clients
    io.emit('chat:message', messageData);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

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
app.use('/uploads', uploadsRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Fallback error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start HTTP server (Express + Socket.io share this server)
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});