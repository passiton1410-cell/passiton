import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    // Get token from cookies
    const cookies = req.headers.get('cookie');
    if (!cookies) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tokenMatch = cookies.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const token = tokenMatch[1];

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { termsAccepted } = await req.json();

    if (!termsAccepted) {
      return NextResponse.json({ error: 'Terms acceptance is required' }, { status: 400 });
    }

    // Update user's terms acceptance status
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.termsAccepted = true;
    user.termsAcceptedDate = new Date();
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Terms accepted successfully'
    });

  } catch (error) {
    console.error('Error accepting terms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}