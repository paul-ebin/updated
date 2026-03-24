import express from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();
router.use(requireAuth);

const statusSchema = z.object({
  status: z.enum(['Pending', 'Shipped', 'Delivered']),
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller_id': req.user.id })
      .populate('items.product_id', 'name image_url')
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => item.seller_id.toString() === req.user.id);
      const items = sellerItems.map(item => ({
        item_id: item._id.toString(),
        product_id: item.product_id._id.toString(),
        product_name: item.product_id.name,
        image_url: item.product_id.image_url,
        quantity: item.quantity,
        item_price: item.price,
        item_status: item.status,
      }));

      const sellerTotal = items.reduce((sum, item) => sum + (item.item_price * item.quantity), 0);

      return {
        order_id: order._id.toString(),
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_address: order.customer_address,
        order_date: order.createdAt,
        seller_total: sellerTotal,
        items
      };
    }).filter(o => o.items.length > 0);

    res.json(formattedOrders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const validationResult = statusSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { status } = validationResult.data;
    const order = await Order.findOne({ 'items._id': req.params.id, 'items.seller_id': req.user.id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    const item = order.items.id(req.params.id);
    item.status = status;
    await order.save();

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
