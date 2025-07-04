import express from 'express';
import { auth } from './auth.routes.js';

const router = express.Router();

router.get('/owner', auth, (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Forbidden' });
  res.json({ message: 'Owner dashboard (placeholder)' });
});

router.get('/backer', auth, (req, res) => {
  if (req.user.role !== 'backer') return res.status(403).json({ error: 'Forbidden' });
  res.json({ message: 'Backer dashboard (placeholder)' });
});

router.get('/admin', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  res.json({ message: 'Admin dashboard (placeholder)' });
});

export default router; 