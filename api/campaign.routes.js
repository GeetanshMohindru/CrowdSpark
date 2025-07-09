import express from 'express';
import Campaign from './campaign.model.js';
// import Stripe from 'stripe';
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || '',
//   key_secret: process.env.RAZORPAY_KEY_SECRET || '',
// });

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');

export default function(io, createNotification) {
  const router = express.Router();

  // Create a new campaign with description validation
  router.post('/', async (req, res) => {
    try {
      const { title, description, ...otherFields } = req.body;
      
      // Check if description is provided and meets minimum requirements
      if (!description || description.trim().length < 50) {
        return res.status(400).json({ 
          error: 'Please provide a detailed description (minimum 50 characters) to help potential backers understand your campaign better.',
          requiresDescription: true
        });
      }
      
      const campaign = new Campaign({ title, description, ...otherFields });
      await campaign.save();
      
      // Notify campaign owner about successful creation
      if (campaign.owner) {
        await createNotification(
          campaign.owner,
          `Your campaign "${title}" has been created successfully and is pending review.`,
          'info',
          campaign._id
        );
      }
      
      res.status(201).json(campaign);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Get all campaigns
  router.get('/', async (req, res) => {
    try {
      const campaigns = await Campaign.find().populate('owner');
      res.json(campaigns);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get single campaign
  router.get('/:id', async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id).populate('owner');
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      res.json(campaign);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Contribute to a campaign
  router.post('/:id/contribute', async (req, res) => {
    try {
      const { amount, contributorId, contributorName } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      
      const campaign = await Campaign.findById(req.params.id).populate('owner');
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      
      campaign.fundsRaised += amount;
      await campaign.save();
      
      // Emit real-time update to all clients
      io.emit('campaignFunded', { 
        campaignId: campaign._id, 
        fundsRaised: campaign.fundsRaised,
        amount: amount,
        contributorName: contributorName || 'Anonymous'
      });
      
      // Notify campaign owner about the funding
      if (campaign.owner) {
        await createNotification(
          campaign.owner._id,
          `Your campaign "${campaign.title}" received ₹${amount} from ${contributorName || 'an anonymous backer'}!`,
          'funding',
          campaign._id
        );
      }
      
      // Notify contributor about successful contribution
      if (contributorId) {
        await createNotification(
          contributorId,
          `Thank you for contributing ₹${amount} to "${campaign.title}"!`,
          'info',
          campaign._id
        );
      }
      
      res.json(campaign);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add comment to campaign
  router.post('/:id/comments', async (req, res) => {
    try {
      const { comment, commenterId, commenterName } = req.body;
      if (!comment || comment.trim().length === 0) {
        return res.status(400).json({ error: 'Comment cannot be empty' });
      }
      
      const campaign = await Campaign.findById(req.params.id).populate('owner');
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      
      const newComment = {
        user: commenterId,
        name: commenterName || 'Anonymous',
        comment: comment.trim(),
        createdAt: new Date()
      };
      
      campaign.comments = campaign.comments || [];
      campaign.comments.push(newComment);
      await campaign.save();
      
      // Emit real-time update to all clients
      io.emit('campaignComment', {
        campaignId: campaign._id,
        comment: newComment
      });
      
      // Notify campaign owner about the comment
      if (campaign.owner && commenterId !== campaign.owner._id.toString()) {
        await createNotification(
          campaign.owner._id,
          `${commenterName || 'Someone'} commented on your campaign "${campaign.title}": "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`,
          'comment',
          campaign._id
        );
      }
      
      res.json(newComment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get campaign comments
  router.get('/:id/comments', async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      res.json(campaign.comments || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Validate campaign description endpoint
  router.post('/validate-description', (req, res) => {
    const { description } = req.body;
    
    if (!description || description.trim().length < 50) {
      return res.json({
        valid: false,
        message: 'Please provide a detailed description (minimum 50 characters) to help potential backers understand your campaign better. Include information about your goals, how the funds will be used, and what makes your campaign special.',
        suggestions: [
          'Explain what your campaign is about',
          'Describe how the funds will be used',
          'Share your story and motivation',
          'Mention any rewards or benefits for backers',
          'Include timeline and milestones'
        ]
      });
    }
    
    return res.json({
      valid: true,
      message: 'Great! Your description looks good.'
    });
  });

  // Comment out Stripe PaymentIntent endpoint
  // router.post('/:id/stripe-intent', async (req, res) => {
  //   try {
  //     const { amount } = req.body;
  //     if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  //     const paymentIntent = await stripe.paymentIntents.create({
  //       amount: Math.round(amount * 100), // Stripe expects paise/cents
  //       currency: 'inr',
  //       metadata: { campaignId: req.params.id },
  //     });
  //     res.json({ clientSecret: paymentIntent.client_secret });
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });

  // Comment out Razorpay Order endpoint
  // router.post('/:id/razorpay-order', async (req, res) => {
  //   try {
  //     const { amount } = req.body;
  //     if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  //     const order = await razorpay.orders.create({
  //       amount: Math.round(amount * 100), // Razorpay expects paise
  //       currency: 'INR',
  //       receipt: `campaign_${req.params.id}_${Date.now()}`,
  //       notes: { campaignId: req.params.id },
  //     });
  //     res.json(order);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });

  return router;
}

