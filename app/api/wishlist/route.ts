// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Wishlist } from '@/models/Wishlist';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { item, phone, details } = await req.json();

  if (!item || !phone) {
    return NextResponse.json(
      { error: 'Item name and phone number are required' },
      { status: 400 }
    );
  }

  try {
    const wish = await Wishlist.create({ item, phone, details });
    return NextResponse.json({ success: true, wish });
  } catch (error) {
    //console.error('Error saving wish:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
