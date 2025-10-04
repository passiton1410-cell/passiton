import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import jwt from 'jsonwebtoken';

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as any;
      userId = decoded.userId;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Get product ID from request body
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Find the product and verify ownership
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if the product belongs to the authenticated user
    if (product.userId.toString() !== userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this product' }, { status: 403 });
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}