import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
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

    // Get user ID from request body
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === currentUser._id.toString()) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Find the user to delete
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deletion of other admin users (safety measure)
    if (userToDelete.role === 'admin') {
      return NextResponse.json({ error: 'Cannot delete other admin users' }, { status: 403 });
    }

    // Delete all user's products
    await Product.deleteMany({ userId });

    // Delete all user's opportunities
    await Opportunity.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: `User ${userToDelete.fullName} and all their listings have been permanently deleted`
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({
      error: 'Failed to delete user'
    }, { status: 500 });
  }
}