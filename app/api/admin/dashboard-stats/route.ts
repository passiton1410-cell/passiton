import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { Opportunity } from '@/models/Opportunity';
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

    const user = await User.findById((payload as any).userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get dashboard statistics
    const [totalUsers, totalListings, totalOpportunities, activeListings, activeOpportunities] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Opportunity.countDocuments(),
      Product.countDocuments({ sold: false }),
      Opportunity.countDocuments({ active: true }),
    ]);

    const stats = {
      totalUsers,
      totalListings,
      totalOpportunities,
      activeListings,
      activeOpportunities,
      soldListings: totalListings - activeListings,
      inactiveOpportunities: totalOpportunities - activeOpportunities,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}