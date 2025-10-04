import { connectToDatabase } from '@/lib/db';
import { Opportunity } from '@/models/Opportunity';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
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
    const { opportunityId } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    // Check if the opportunity exists and belongs to the user
    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    if (opportunity.userId.toString() !== userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this opportunity' }, { status: 403 });
    }

    // Delete the opportunity
    await Opportunity.findByIdAndDelete(opportunityId);

    return NextResponse.json({ success: true, message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}