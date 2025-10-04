import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, username, password, fullName, collegeIdUrl } = await req.json();
  const hashed = await bcrypt.hash(password, 10);

  try {
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const user = await User.create({
      email,
      username,
      password: hashed,
      fullName,
      collegeIdUrl,
      verified: false,
    });

    // ✅ Create JWT token and set cookie
    const token = jwt.sign(
      { userId: user._id, email: user.email, fullName: user.fullName, username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({ message: 'User created', user });

    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
