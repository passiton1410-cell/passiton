import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email, fullName: user.fullName, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  const res = NextResponse.json({ success: true });
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
}
