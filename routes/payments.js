import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Payment from '../models/Payment.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find({ seller_id: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
