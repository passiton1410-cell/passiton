import mongoose, { Schema } from 'mongoose';

const OpportunitySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true }, // suggested: jobs, internship, teaching, coaching, mentorship, other
  company: { type: String, required: true },
  location: { type: String, required: true }, // remote, hybrid, on-site location
  city: { type: String, required: true },
  state: { type: String, required: true },
  college: { type: String, required: true }, // poster's college
  email: { type: String, required: true }, // contact email
  phone: { type: String, required: true }, // contact phone
  requirements: { type: String }, // optional field for requirements/qualifications
  deadline: { type: Date }, // application deadline
  salary: { type: String }, // optional salary/stipend info
  duration: { type: String }, // optional duration (e.g., "3 months", "full-time")
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  active: { type: Boolean, default: true }, // similar to 'sold' in Product
  createdAt: { type: Date, default: Date.now },
});

export const Opportunity =
  mongoose.models.Opportunity || mongoose.model('Opportunity', OpportunitySchema);