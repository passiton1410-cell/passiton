import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// 🛡️ In-memory rate limiter
const rateLimitMap = new Map<string, number>(); // userId => timestamp

export async function POST(req: Request) {
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

  const userId = (payload as any).userId;

  // ✅ Rate limit check (30 sec)
  const now = Date.now();
  const lastRequestTime = rateLimitMap.get(userId);
  if (lastRequestTime && now - lastRequestTime < 30 * 1000) {
    const waitTime = Math.ceil((30 * 1000 - (now - lastRequestTime)) / 1000);
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${waitTime} sec.` },
      { status: 429 }
    );
  }
  rateLimitMap.set(userId, now);

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // ✅ Check product count for this user
  const existingProductsCount = await Product.countDocuments({ userId });
  if (existingProductsCount >= 20) {
    return NextResponse.json(
      { error: 'You can only upload up to 20 products.' },
      { status: 403 }
    );
  }

  const data = await req.json();
  const { title, price, category, image, phone, college } = data;

  // ✅ Backend validation
  if (!title || title.trim().length < 3) {
    return NextResponse.json({ error: 'Title must be at least 3 characters long.' }, { status: 400 });
  }

  const numericPrice = parseInt(price);
  if (isNaN(numericPrice) || numericPrice < 10 || numericPrice > 50000) {
    return NextResponse.json({ error: 'Price must be between ₹10 and ₹50,000.' }, { status: 400 });
  }

  if (!/^\d{10}$/.test(phone)) {
    return NextResponse.json({ error: 'Phone number must be 10 digits.' }, { status: 400 });
  }

  if (!category || !image || !college) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const product = await Product.create({
    title: title.trim(),
    price: numericPrice,
    category,
    image,
    phone,
    college,
    city: user.city,      // Auto-fetch from user profile
    state: user.state,    // Auto-fetch from user profile
    email: user.email,
    userId: user._id,
  });

  return NextResponse.json({ success: true, product });
}

// GET endpoint to fetch all public products (for general listings)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const { searchParams } = url;
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const category = searchParams.get('category');

    // Build query object
    const query: any = {
      sold: { $ne: true }, // Only show unsold products in public listings
    };

    // Add filters if provided (flexible matching)
    if (state && state.trim()) {
      query.state = { $regex: new RegExp(state.trim(), "i") };
    }

    if (city && city.trim()) {
      query.city = { $regex: new RegExp(city.trim(), "i") };
    }

    if (category && category.trim()) {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    const products = await Product.find(query)
      .select("title image price college category email phone sold city state")
      .sort({ createdAt: -1 })
      .limit(50); // Limit to 50 products for performance

    console.log('All products query:', query);
    console.log(`Searching for - State: "${state}", City: "${city}", Category: "${category}"`);
    console.log(`Found ${products.length} total products`);

    // Debug: Show sample of actual state/city values when no results
    if (products.length === 0 && (state || city)) {
      const sampleProducts = await Product.find({ sold: { $ne: true } }).select("state city category").limit(5);
      console.log('Sample state/city values in database:', sampleProducts.map(p => ({ state: p.state, city: p.city, category: p.category })));
    }

    return NextResponse.json({ products });
  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
