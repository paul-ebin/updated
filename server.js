import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectToDatabase from './lib/mongodb.js';

// Load routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import dashboardRoutes from './routes/dashboard.js';
import paymentRoutes from './routes/payments.js';
import uploadRoutes from './routes/upload.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files (Uploaded Images)
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Connect DB
connectToDatabase().then(() => {
  console.log('MongoDB connected successfully via Mongoose.');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// API Routes
app.use('/api/seller', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Express Server is running.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
