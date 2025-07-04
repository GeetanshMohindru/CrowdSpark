import express from 'express';
const router = express.Router();

// Trending campaigns
router.get('/trending', (req, res) => {
  res.json([{ id: 1, title: 'Trending Campaign (placeholder)' }]);
});

// Latest campaigns
router.get('/latest', (req, res) => {
  res.json([{ id: 2, title: 'Latest Campaign (placeholder)' }]);
});

// Search campaigns
router.get('/search', (req, res) => {
  const q = req.query.q || '';
  res.json([{ id: 3, title: `Search result for "${q}" (placeholder)` }]);
});

export default router; 