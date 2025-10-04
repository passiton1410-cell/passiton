import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
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

  const products = await Product.find({ userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}