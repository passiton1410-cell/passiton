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
  mobile: { type: String, required: true },   // new -> mandatory mobile number
  collegeName: { type: String, required: true }, // mandatory college name
  state: { type: String, required: true },   // Indian state
  city: { type: String, required: true },    // Indian city
  pincode: { type: String },                 // Pincode - optional
  course: { type: String, required: true },  // Academic course/program - mandatory
  department: { type: String, required: true }, // Academic department - mandatory
  semester: { type: String, required: true }, // Current semester - mandatory
  year: { type: String, required: true },    // Academic year - mandatory
  personalEmail: { type: String },           // optional personal email
  personalId: { type: String },              // optional personal ID
  termsAccepted: { type: Boolean, default: false }, // Terms & Conditions acceptance
  termsAcceptedDate: { type: Date },         // When terms were accepted
});


export const User = mongoose.models.User || mongoose.model('User', UserSchema);
