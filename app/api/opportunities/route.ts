import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Opportunity } from '@/models/Opportunity';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const opportunities = await Opportunity.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      opportunities
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}