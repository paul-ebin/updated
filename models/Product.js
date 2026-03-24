import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, default: '' },
  image_url: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
