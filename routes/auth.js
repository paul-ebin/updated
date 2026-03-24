import express from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { signToken } from '../lib/auth.js';
import Seller from '../models/Seller.js';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  store_name: z.string().min(2, "Store name must be at least 2 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

router.post('/register', async (req, res) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.format() });
    }

    const { name, email, password, store_name } = validationResult.data;

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(409).json({ message: 'Seller with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      store_name
    });

    res.status(201).json({ message: 'Seller registered successfully', sellerId: newSeller._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.format() });
    }

    const { email, password } = validationResult.data;
    const seller = await Seller.findOne({ email });

    if (!seller || !(await bcrypt.compare(password, seller.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = await signToken({
      id: seller._id.toString(),
      name: seller.name,
      email: seller.email,
      store_name: seller.store_name
    });

    res.cookie('seller_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('seller_token');
  res.status(200).json({ message: 'Logged out' });
});

export default router;
