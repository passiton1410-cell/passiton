import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product';

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

    // Get product ID from request body
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Find the product to delete
    const productToDelete = await Product.findById(productId);
    if (!productToDelete) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get product owner details for response
    const productOwner = await User.findById(productToDelete.userId);
    const ownerName = productOwner ? productOwner.fullName : 'Unknown User';

    // Delete the product
    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: `Product "${productToDelete.title}" by ${ownerName} has been permanently deleted`
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({
      error: 'Failed to delete product'
    }, { status: 500 });
  }
}