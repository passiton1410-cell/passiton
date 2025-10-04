import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
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

    // Get all users (excluding passwords)
    const users = await User.find({}, {
      password: 0 // Exclude password field
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      users: users.map(user => ({
        _id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt,
        collegeName: user.collegeName
      }))
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}