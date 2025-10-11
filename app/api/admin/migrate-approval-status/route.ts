import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
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

    // Update all products without approvalStatus to 'approved'
    const productUpdateResult = await Product.updateMany(
      { approvalStatus: { $exists: false } },
      {
        $set: {
          approvalStatus: 'approved',
          approvedBy: currentUser._id,
          approvedAt: new Date()
        }
      }
    );

    // Update all opportunities without approvalStatus to 'approved'
    const opportunityUpdateResult = await Opportunity.updateMany(
      { approvalStatus: { $exists: false } },
      {
        $set: {
          approvalStatus: 'approved',
          approvedBy: currentUser._id,
          approvedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      results: {
        productsUpdated: productUpdateResult.modifiedCount,
        opportunitiesUpdated: opportunityUpdateResult.modifiedCount
      }
    });

  } catch (error) {
    console.error('Error migrating approval status:', error);
    return NextResponse.json({
      error: 'Failed to migrate approval status'
    }, { status: 500 });
  }
}