import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || typeof q !== "string") {
    return NextResponse.json({ message: 'Missing search term' }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const safeQuery = escapeRegex(q.trim());
    const regex = new RegExp(`.*${safeQuery}.*`, 'i');

const products = await Product.find({
  // TEMPORARILY REMOVING SOLD FILTER FOR DEBUGGING
  $or: [
    { title: regex },
    { category: regex },
    { college: regex },
  ],
  // sold: { $ne: true } // COMMENTED OUT TO SEE ALL PRODUCTS
})
.select("title image images price college category email phone sold city state")
.sort({ createdAt: -1 })
.limit(50);



    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
