import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Total Products
    const totalProducts = await Product.countDocuments({ seller_id: sellerId });

    // Orders involving this seller
    const orders = await Order.find({ 'items.seller_id': sellerId });
    const totalOrders = orders.length;

    // Total Revenue & Low Stock
    let totalRevenue = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.seller_id.toString() === sellerId && item.status !== 'Pending') {
          totalRevenue += (item.price * item.quantity);
        }
      });
    });

    // Low Stock Alerts
    const lowStockItems = await Product.find({ seller_id: sellerId, quantity: { $lte: 5 } })
      .limit(5)
      .select('name quantity');

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockItems: lowStockItems.map(item => ({
        id: item._id, // match previous API which returned 'id'
        name: item.name,
        quantity: item.quantity
      })),
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
