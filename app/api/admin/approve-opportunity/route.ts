import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Opportunity } from '@/models/Opportunity';

export async function POST(req: NextRequest) {
  try {
    // Check if current user is admin
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    await connectToDatabase();

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { opportunityId, action, rejectionReason } = await req.json();

    if (!opportunityId || !action) {
      return NextResponse.json({ error: 'Opportunity ID and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 });
    }

    // Find the opportunity
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Check if opportunity is in pending status
    if (opportunity.approvalStatus !== 'pending') {
      return NextResponse.json({
        error: `Opportunity is already ${opportunity.approvalStatus}`
      }, { status: 400 });
    }

    // Update opportunity based on action
    if (action === 'approve') {
      opportunity.approvalStatus = 'approved';
      opportunity.approvedBy = currentUser._id;
      opportunity.approvedAt = new Date();
      opportunity.rejectionReason = undefined; // Clear any previous rejection reason
    } else if (action === 'reject') {
      // If rejected, delete the opportunity entirely
      await Opportunity.findByIdAndDelete(opportunityId);
      return NextResponse.json({
        success: true,
        message: 'Opportunity rejected and deleted successfully'
      });
    }

    await opportunity.save();

    return NextResponse.json({
      success: true,
      message: `Opportunity ${action}ed successfully`,
      opportunity: {
        _id: opportunity._id,
        title: opportunity.title,
        approvalStatus: opportunity.approvalStatus
      }
    });

  } catch (error) {
    console.error(`Error ${action}ing opportunity:`, error);
    return NextResponse.json({
      error: `Failed to ${action} opportunity`
    }, { status: 500 });
  }
}