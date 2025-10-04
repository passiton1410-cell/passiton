import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Otp } from '@/models/Otp';

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, otp } = await req.json();

  const existingOtp = await Otp.findOne({ email });

  if (
    !existingOtp ||
    existingOtp.otp !== otp ||
    existingOtp.expiresAt < new Date()
  ) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }

  // Mark OTP as used by deleting it
  await Otp.deleteOne({ email });

  return NextResponse.json({ success: true });
}
