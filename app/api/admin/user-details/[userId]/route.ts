import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { Opportunity } from '@/models/Opportunity';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
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

    const adminUser = await User.findById((payload as any).userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { userId } = params;

    // Get user details
    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's products and opportunities
    const [products, opportunities] = await Promise.all([
      Product.find({ userId }).sort({ createdAt: -1 }).lean(),
      Opportunity.find({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    const userDetails = {
      user,
      products,
      opportunities,
      stats: {
        totalProducts: products.length,
        activeProducts: products.filter(p => !p.sold).length,
        soldProducts: products.filter(p => p.sold).length,
        totalOpportunities: opportunities.length,
        activeOpportunities: opportunities.filter(o => o.active).length,
        inactiveOpportunities: opportunities.filter(o => !o.active).length,
      }
    };

    return NextResponse.json({ userDetails });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}