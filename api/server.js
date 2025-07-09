// Express server setup for CrowdSpark
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import Stripe from 'stripe';
// import Razorpay from 'razorpay';
import campaignRoutes from './campaign.routes.js';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import discoveryRoutes from './discovery.routes.js';
import adminRoutes from './admin.routes.js';
import Notification from './notification.model.js';
import User from './user.model.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crowdspark', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Stripe and Razorpay setup
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "");
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || '',
//   key_secret: process.env.RAZORPAY_KEY_SECRET || '',
// });

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Join user to their personal room for targeted notifications
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Helper function to create and emit notifications
const createNotification = async (userId, message, type = 'info', campaignId = null) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
      campaignId,
      read: false
    });
    await notification.save();
    
    // Emit to specific user
    io.to(`user_${userId}`).emit('notification', {
      _id: notification._id,
      message: notification.message,
      type: notification.type,
      campaignId: notification.campaignId,
      createdAt: notification.createdAt,
      read: false
    });
    
    // Also emit to all connected clients for general updates
    io.emit('newNotification', {
      userId,
      message,
      type,
      campaignId
    });
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Basic API route
app.get('/', (req, res) => {
  res.send('CrowdSpark API is running');
});

// Get notifications for a user
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read for a user
app.patch('/api/notifications/user/:userId/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.params.userId, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all notifications (admin)
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().populate('user').sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api/campaigns', campaignRoutes(io, createNotification));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/admin', adminRoutes(io, createNotification));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server, io, createNotification };

