import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    // Check if current user is admin
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    await connectToDatabase();

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all pending products with user details
    const pendingProducts = await Product.find({
      approvalStatus: 'pending'
    })
    .populate('userId', 'fullName username email collegeName city state')
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json({
      products: pendingProducts.map(product => ({
        _id: product._id,
        title: product.title,
        price: product.price,
        category: product.category,
        images: product.images,
        image: product.image,
        college: product.college,
        city: product.city,
        state: product.state,
        email: product.email,
        phone: product.phone,
        createdAt: product.createdAt,
        approvalStatus: product.approvalStatus,
        user: product.userId
      }))
    });

  } catch (error) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json({ error: 'Failed to fetch pending products' }, { status: 500 });
  }
}