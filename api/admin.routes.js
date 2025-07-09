import express from 'express';
import Campaign from './campaign.model.js';
import User from './user.model.js';

export default function(io, createNotification) {
  const router = express.Router();

  // Get all campaigns for admin review
  router.get('/campaigns', async (req, res) => {
    try {
      const campaigns = await Campaign.find().populate('owner');
      res.json(campaigns);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Approve a campaign
  router.patch('/campaigns/:id/approve', async (req, res) => {
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        { status: 'approved', approvedAt: new Date() },
        { new: true }
      ).populate('owner');
      
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      
      // Notify campaign owner about approval
      if (campaign.owner) {
        await createNotification(
          campaign.owner._id,
          `Great news! Your campaign "${campaign.title}" has been approved and is now live!`,
          'campaign_approved',
          campaign._id
        );
      }
      
      // Emit real-time update
      io.emit('campaignApproved', {
        campaignId: campaign._id,
        title: campaign.title
      });
      
      res.json(campaign);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reject a campaign
  router.patch('/campaigns/:id/reject', async (req, res) => {
    try {
      const { reason } = req.body;
      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        { 
          status: 'rejected', 
          rejectionReason: reason,
          rejectedAt: new Date()
        },
        { new: true }
      ).populate('owner');
      
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      
      // Notify campaign owner about rejection
      if (campaign.owner) {
        await createNotification(
          campaign.owner._id,
          `Your campaign "${campaign.title}" was not approved. Reason: ${reason || 'Please review our guidelines and try again.'}`,
          'campaign_rejected',
          campaign._id
        );
      }
      
      // Emit real-time update
      io.emit('campaignRejected', {
        campaignId: campaign._id,
        title: campaign.title,
        reason
      });
      
      res.json(campaign);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Send admin notification to user
  router.post('/notify-user', async (req, res) => {
    try {
      const { userId, message, type = 'admin' } = req.body;
      
      if (!userId || !message) {
        return res.status(400).json({ error: 'User ID and message are required' });
      }
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await createNotification(
        userId,
        `Admin message: ${message}`,
        type
      );
      
      res.json({ message: 'Notification sent successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Broadcast notification to all users
  router.post('/broadcast', async (req, res) => {
    try {
      const { message, type = 'admin' } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const users = await User.find({});
      
      // Create notifications for all users
      const notifications = users.map(user => 
        createNotification(user._id, `Announcement: ${message}`, type)
      );
      
      await Promise.all(notifications);
      
      // Emit to all connected clients
      io.emit('broadcast', {
        message: `Announcement: ${message}`,
        type
      });
      
      res.json({ message: `Broadcast sent to ${users.length} users` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all users
  router.get('/users', async (req, res) => {
    try {
      const users = await User.find({}).select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

