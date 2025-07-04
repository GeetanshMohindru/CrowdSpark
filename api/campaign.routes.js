import express from 'express';
import Campaign from './campaign.model.js';
// import Stripe from 'stripe';
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || '',
//   key_secret: process.env.RAZORPAY_KEY_SECRET || '',
// });

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');

export default function(io) {
  const router = express.Router();

  // Create a new campaign
  router.post('/', async (req, res) => {
    try {
      const campaign = new Campaign(req.body);
      await campaign.save();
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

  // Contribute to a campaign
  router.post('/:id/contribute', async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      campaign.fundsRaised += amount;
      await campaign.save();
      io.emit('funded', { campaignId: campaign._id, fundsRaised: campaign.fundsRaised });
      res.json(campaign);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
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