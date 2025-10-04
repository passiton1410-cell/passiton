import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Opportunity } from '@/models/Opportunity';

export async function DELETE(req: NextRequest) {
  try {
    // Check if current user is admin
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    // Get opportunity ID from request body
    const { opportunityId } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    // Find the opportunity to delete
    const opportunityToDelete = await Opportunity.findById(opportunityId);
    if (!opportunityToDelete) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Get opportunity owner details for response
    const opportunityOwner = await User.findById(opportunityToDelete.userId);
    const ownerName = opportunityOwner ? opportunityOwner.fullName : 'Unknown User';

    // Delete the opportunity
    await Opportunity.findByIdAndDelete(opportunityId);

    return NextResponse.json({
      success: true,
      message: `Opportunity "${opportunityToDelete.title}" by ${ownerName} has been permanently deleted`
    });

  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json({
      error: 'Failed to delete opportunity'
    }, { status: 500 });
  }
}