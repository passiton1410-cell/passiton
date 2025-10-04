import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, newPassword } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  return NextResponse.json({ success: true });
}
