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

// Allowed channel rooms
const ALLOWED_CHANNELS = ['General', 'Tech Support'];

// Socket connection & room routing handlers
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // 1. Channel Join Handler
  socket.on('channel:join', (channelName) => {
    if (!ALLOWED_CHANNELS.includes(channelName)) {
      return;
    }

    // Leave any previously joined channel rooms
    ALLOWED_CHANNELS.forEach((ch) => {
      socket.leave(ch);
    });

    // Join the requested room
    socket.join(channelName);
    socket.currentChannel = channelName;
  });

  // 2. Channel-Scoped Chat Message Handler
  socket.on('chat:message', (payload) => {
    if (
      !payload ||
      !ALLOWED_CHANNELS.includes(payload.channel) ||
      typeof payload.text !== 'string' ||
      !payload.text.trim()
    ) {
      return;
    }

    const userName = (typeof payload.user === 'string' && payload.user.trim())
      ? payload.user.trim()
      : 'Anonymous';

    const messageData = {
      id: `${Date.now()}-${socket.id}`,
      channel: payload.channel,
      user: userName,
      text: payload.text.trim()
    };

    // Emit ONLY to clients in the specified channel room
    io.to(payload.channel).emit('chat:message', messageData);
  });

  // 3. Channel-Scoped Real-Time Typing Indicator Handler
  socket.on('user:typing', (payload) => {
    if (!payload || !ALLOWED_CHANNELS.includes(payload.channel) || typeof payload.user !== 'string') {
      return;
    }

    const typingData = {
      channel: payload.channel,
      user: payload.user.trim() || 'Anonymous',
      isTyping: Boolean(payload.isTyping)
    };

    // Broadcast typing state ONLY to other clients in the same channel room
    socket.to(payload.channel).emit('user:typing', typingData);
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

// Start HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});