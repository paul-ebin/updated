import express from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  quantity: z.coerce.number().min(0, 'Quantity must be positive').int(),
  category: z.string().optional(),
  image_url: z.string().optional().or(z.literal('')),
});

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ seller_id: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const validationResult = productSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.format() });
    }

    const newProduct = await Product.create({
      seller_id: req.user.id,
      ...validationResult.data,
      description: validationResult.data.description || '',
      category: validationResult.data.category || '',
      image_url: validationResult.data.image_url || ''
    });

    res.status(201).json({ message: 'Product created', productId: newProduct._id });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller_id: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const validationResult = productSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.format() });
    }

    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, seller_id: req.user.id },
      { ...validationResult.data },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, seller_id: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
