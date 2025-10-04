import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded._id || decoded.userId;

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ loggedIn: false });

    return NextResponse.json({
      loggedIn: true,
      user: {
        userId: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        collegeIdUrl: user.collegeIdUrl,
        verified: user.verified,
        role: user.role,
        collegeName: user.collegeName,
        mobile: user.mobile,
      },
    });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
