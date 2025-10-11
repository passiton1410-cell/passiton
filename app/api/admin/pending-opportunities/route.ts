import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Opportunity } from '@/models/Opportunity';

export async function GET(req: NextRequest) {
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

    // Get all pending opportunities with user details
    const pendingOpportunities = await Opportunity.find({
      approvalStatus: 'pending'
    })
    .populate('userId', 'fullName username email collegeName city state')
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json({
      opportunities: pendingOpportunities.map(opportunity => ({
        _id: opportunity._id,
        title: opportunity.title,
        description: opportunity.description,
        type: opportunity.type,
        company: opportunity.company,
        location: opportunity.location,
        city: opportunity.city,
        state: opportunity.state,
        college: opportunity.college,
        email: opportunity.email,
        phone: opportunity.phone,
        requirements: opportunity.requirements,
        deadline: opportunity.deadline,
        salary: opportunity.salary,
        duration: opportunity.duration,
        createdAt: opportunity.createdAt,
        approvalStatus: opportunity.approvalStatus,
        user: opportunity.userId
      }))
    });

  } catch (error) {
    console.error('Error fetching pending opportunities:', error);
    return NextResponse.json({ error: 'Failed to fetch pending opportunities' }, { status: 500 });
  }
}