import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';

export async function POST(req: NextRequest) {
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

    const { productId, action, rejectionReason } = await req.json();

    if (!productId || !action) {
      return NextResponse.json({ error: 'Product ID and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product is in pending status
    if (product.approvalStatus !== 'pending') {
      return NextResponse.json({
        error: `Product is already ${product.approvalStatus}`
      }, { status: 400 });
    }

    // Update product based on action
    if (action === 'approve') {
      product.approvalStatus = 'approved';
      product.approvedBy = currentUser._id;
      product.approvedAt = new Date();
      product.rejectionReason = undefined; // Clear any previous rejection reason
    } else if (action === 'reject') {
      // If rejected, delete the product entirely
      await Product.findByIdAndDelete(productId);
      return NextResponse.json({
        success: true,
        message: 'Product rejected and deleted successfully'
      });
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: `Product ${action}ed successfully`,
      product: {
        _id: product._id,
        title: product.title,
        approvalStatus: product.approvalStatus
      }
    });

  } catch (error) {
    console.error(`Error ${action}ing product:`, error);
    return NextResponse.json({
      error: `Failed to ${action} product`
    }, { status: 500 });
  }
}