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

    // Get filtering parameters from URL
    const { searchParams } = new URL(req.url);
    const college = searchParams.get('college');
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const search = searchParams.get('search');

    // Build filter query
    let filterQuery: any = {};

    if (college && college !== 'all') {
      filterQuery.collegeName = { $regex: college, $options: 'i' };
    }

    if (state && state !== 'all') {
      filterQuery.state = state;
    }

    if (city && city !== 'all') {
      filterQuery.city = city;
    }

    if (search) {
      filterQuery.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get filtered users (excluding passwords)
    const users = await User.find(filterQuery, {
      password: 0 // Exclude password field
    }).sort({ createdAt: -1 });

    // Get unique values for filters
    const allUsers = await User.find({}, { collegeName: 1, state: 1, city: 1 });
    const colleges = [...new Set(allUsers.map(u => u.collegeName).filter(Boolean))].sort();
    const states = [...new Set(allUsers.map(u => u.state).filter(Boolean))].sort();
    const cities = [...new Set(allUsers.map(u => u.city).filter(Boolean))].sort();

    return NextResponse.json({
      users: users.map(user => ({
        _id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt,
        collegeName: user.collegeName,
        state: user.state,
        city: user.city,
        collegeIdUrl: user.collegeIdUrl
      })),
      filters: {
        colleges,
        states,
        cities
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}