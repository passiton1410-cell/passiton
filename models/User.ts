import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  collegeIdUrl: { type: String, required: true }, // new
  verified: { type: Boolean, default: false },     // new
  role: { type: String, default: 'user' }, // user or admin - changeable from database
  createdAt: { type: Date, default: Date.now },
  mobile: { type: String },                  // new -> optional, editable via card
  collegeName: { type: String },
  state: { type: String, required: true },   // Indian state
  city: { type: String, required: true },    // Indian city
  pincode: { type: String },                 // Pincode
  personalEmail: { type: String },           // optional personal email
  personalId: { type: String },              // optional personal ID
});


export const User = mongoose.models.User || mongoose.model('User', UserSchema);
