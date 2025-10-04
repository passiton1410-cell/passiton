import { connectToDatabase } from '@/lib/db';
import { Opportunity } from '@/models/Opportunity';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = cookies();
    //@ts-ignore
    const token: string | undefined = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const userId = (payload as any).userId;

    // Fetch opportunities posted by this user
    const opportunities = await Opportunity.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error('Error fetching user opportunities:', error);
    return NextResponse.json({
      error: 'Internal server error',
      opportunities: []
    }, { status: 500 });
  }
}