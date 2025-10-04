import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
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

    const params = await context.params;
    const { userId } = params;

    // Find the user and get their college ID URL
    const user = await User.findById(userId).select('collegeIdUrl fullName username');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.collegeIdUrl) {
      return NextResponse.json({ error: 'No college ID found for this user' }, { status: 404 });
    }

    // Redirect directly to the Cloudinary URL
    return NextResponse.redirect(user.collegeIdUrl, { status: 302 });

  } catch (error) {
    console.error('Error viewing college ID:', error);
    return NextResponse.json({
      error: 'Failed to view college ID'
    }, { status: 500 });
  }
}