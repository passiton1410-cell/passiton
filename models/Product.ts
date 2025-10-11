import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true }, // suggested: electronics, furniture, clothing, stationary, other
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr: string[]) {
        return arr.length >= 1 && arr.length <= 4;
      },
      message: 'Must have between 1 and 4 images'
    }
  },
  // Keep the old image field for backward compatibility during migration
  image: { type: String },
  college: { type: String, required: true },
  city: { type: String, required: true }, // location info
  state: { type: String, required: true }, // location info
  email: { type: String, required: true }, // ✅ new
  phone: { type: String, required: true }, // ✅ new
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  sold: { type: Boolean, default: false },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String }, // Optional reason for rejection
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Admin who approved/rejected
  approvedAt: { type: Date }, // When it was approved/rejected
  createdAt: { type: Date, default: Date.now },
});

export const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);
