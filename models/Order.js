import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Price at time of order
  status: { type: String, default: 'pending' }
});

const OrderSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_address: { type: String, required: true },
  items: [OrderItemSchema],
  total_amount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
