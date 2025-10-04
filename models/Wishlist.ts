// models/Wishlist.ts
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  item: { type: String, required: true },
  phone: { type: String, required: true },
  details: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Wishlist =
  mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
