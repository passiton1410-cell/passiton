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

    // Prevent admin from changing their own role
    if (currentUser._id.toString() === userId) {
      return NextResponse.json({
        error: 'You cannot change your own role. Ask another admin to change it for you.'
      }, { status: 403 });
    }

    // Get the target user to check current role
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Count current admins
    const adminCount = await User.countDocuments({ role: 'admin' });

    // If trying to demote an admin to user, ensure at least 1 admin remains
    if (targetUser.role === 'admin' && newRole === 'user' && adminCount <= 1) {
      return NextResponse.json({
        error: 'Cannot demote the last admin. There must be at least 1 admin account.'
      }, { status: 400 });
    }

    // If trying to promote a user to admin, ensure maximum 5 admins
    if (targetUser.role === 'user' && newRole === 'admin' && adminCount >= 5) {
      return NextResponse.json({
        error: 'Cannot promote to admin. Maximum of 5 admin accounts allowed.'
      }, { status: 400 });
    }

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
      message: `User role updated to ${newRole}. User needs to logout and login again for changes to take effect.`,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role
      },
      requiresReauth: true
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}