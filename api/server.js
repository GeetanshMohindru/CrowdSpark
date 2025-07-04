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
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || '',
//   key_secret: process.env.RAZORPAY_KEY_SECRET || '',
// });

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic API route
app.get('/', (req, res) => {
  res.send('CrowdSpark API is running');
});

app.get('/api/notifications', async (req, res) => {
  const notifications = await Notification.find().populate('user');
  res.json(notifications);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api/campaigns', campaignRoutes(io));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/admin', adminRoutes);

export { app, server, io }; 