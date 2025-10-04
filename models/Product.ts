import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true }, // suggested: electronics, furniture, clothing, stationary, other
  image: { type: String, required: true },
  college: { type: String, required: true },
  city: { type: String, required: true }, // location info
  state: { type: String, required: true }, // location info
  email: { type: String, required: true }, // ✅ new
  phone: { type: String, required: true }, // ✅ new
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  sold: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);
