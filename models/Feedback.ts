import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

export default Feedback;
