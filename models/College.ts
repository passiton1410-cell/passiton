import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  usageCount: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

// Index for faster searching
CollegeSchema.index({ name: 'text' });

export const College = mongoose.models.College || mongoose.model('College', CollegeSchema);