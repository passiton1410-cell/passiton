import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let userId = '';
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-ignore
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { productId, sold } = await req.json();
  const product = await Product.findOne({ _id: productId, userId });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  product.sold = sold;
  await product.save();

  return NextResponse.json({ success: true });
}