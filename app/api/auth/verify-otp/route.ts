import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Otp } from '@/models/Otp';
import { College } from '@/models/College';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function POST(req: Request) {
  await connectToDatabase();

  const { email, password, otp, fullName, username, collegeIdUrl, state, city, collegeName } = await req.json();

  // 1. Validate OTP
  const existingOtp = await Otp.findOne({ email });
  if (!existingOtp || existingOtp.otp !== otp || existingOtp.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }

  // 2. Check if user already exists by email
  const alreadyUser = await User.findOne({ email });
  if (alreadyUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // 3. Ensure required fields
  if (!fullName || !username || !collegeIdUrl || !state || !city || !collegeName) {
    return NextResponse.json({ error: 'Full name, username, college, state, city, and ID are required' }, { status: 400 });
  }

  // 4. Ensure username is unique
  const takenUsername = await User.findOne({ username });
  if (takenUsername) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
  }

  // 5. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 6. Create user
  const newUser = await User.create({
    email,
    password: hashedPassword,
    fullName,
    username,
    collegeIdUrl,
    collegeName,
    state,
    city,
    verified: true,
  });

  // 6.5. Link any colleges added without user reference to this user
  try {
    // Find colleges that match the user's college name and don't have an addedBy reference
    const collegeToLink = await College.findOne({
      name: { $regex: new RegExp(`^${collegeName}$`, 'i') },
      addedBy: null
    });

    if (collegeToLink) {
      // Link the college to the new user
      collegeToLink.addedBy = newUser._id;
      await collegeToLink.save();
    }
  } catch (error) {
    // Don't fail signup if college linking fails
    console.error('Error linking college to user:', error);
  }

  // 7. Delete OTP
  await Otp.deleteOne({ email });

  // 8. Generate JWT token
  const token = jwt.sign(
    {
      userId: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      username: newUser.username,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 9. Send response with token cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
