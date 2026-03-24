import mongoose from 'mongoose';

const SellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  store_name: { type: String, required: true },
}, { timestamps: true });

// Check if model exists to avoid recompilation error in Next.js
export default mongoose.models.Seller || mongoose.model('Seller', SellerSchema);
