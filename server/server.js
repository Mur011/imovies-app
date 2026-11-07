const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

// Initialize App & Server
const app = express();
const server = http.createServer(app);

// Allowed Origins for Local & Production Deployment
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

// Dynamic CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

// Socket.io with Production CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Body Parser Middleware
app.use(express.json());

// Rate Limiter Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later.'
});
app.use('/api', apiLimiter);

// Import Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully.'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Real-Time Seat Synchronization via Socket.io
// Real-Time Seat Synchronization via Socket.io
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Join a specific show room
  socket.on('joinShow', (showId) => {
    socket.join(showId);
  });

  // Seat lock broadcast
  socket.on('selectSeat', ({ showId, seatNumber, userId }) => {
    socket.to(showId).emit('seatLocked', { seatNumber, userId });
  });

  // Seat release broadcast
  socket.on('releaseSeat', ({ showId, seatNumber }) => {
    socket.to(showId).emit('seatReleased', { seatNumber });
  });

  // Seat permanent booking broadcast
  socket.on('bookSeats', ({ showId, seatNumbers }) => {
    socket.to(showId).emit('seatsBooked', { seatNumbers });
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Server Listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));