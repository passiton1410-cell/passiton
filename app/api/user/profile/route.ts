import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
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
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        mobile: user.mobile,
        collegeName: user.collegeName,
        state: user.state,
        city: user.city,
        course: user.course,
        department: user.department,
        semester: user.semester,
        year: user.year,
        verified: user.verified,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}