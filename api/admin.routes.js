import express from 'express';
import { auth } from './auth.routes.js';
const router = express.Router();

// List users
router.get('/users', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  res.json([{ id: 1, name: 'User (placeholder)' }]);
});

// List campaigns
router.get('/campaigns', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  res.json([{ id: 1, title: 'Campaign (placeholder)' }]);
});

export default router; 