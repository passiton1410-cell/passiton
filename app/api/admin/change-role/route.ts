import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
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

    // Get request data
    const { userId, newRole } = await req.json();

    if (!['user', 'admin'].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    await connectToDatabase();

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `User role updated to ${newRole}`,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}