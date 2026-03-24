import mongoose from 'mongoose';
import Seller from './models/Seller.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://paulcodes07:paul@cluster0.ttgtuvn.mongodb.net/';

async function checkSellers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const sellers = await Seller.find({}, 'name email');
    console.log('Found Sellers:', sellers);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkSellers();
