import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const category = decodeURIComponent(parts[parts.length - 1] || "").trim();

    if (!category) {
      return NextResponse.json({ error: "Category missing" }, { status: 400 });
    }

    // Get query parameters for filtering
    const { searchParams } = url;
    const state = searchParams.get('state');
    const city = searchParams.get('city');

    // Build query object - TEMPORARILY REMOVING SOLD FILTER FOR DEBUGGING
    const query: any = {
      category: { $regex: new RegExp(`^${category}$`, "i") },
      // sold: { $ne: true }, // COMMENTED OUT TO SEE ALL PRODUCTS
    };

    // Only add filters if user has actually selected something meaningful
    if (state && state.trim() && state.trim() !== 'all' && state.trim() !== '') {
      query.state = { $regex: new RegExp(state.trim(), "i") };
    }

    if (city && city.trim() && city.trim() !== 'all' && city.trim() !== '') {
      query.city = { $regex: new RegExp(city.trim(), "i") };
    }

    const products = await Product.find(query)
      .select("title image price college category email phone sold city state")
      .sort({ createdAt: -1 });

    console.log(`🔍 DEBUG: Category "${category}" - Found ${products.length} products`);
    console.log('🔍 DEBUG: Sample products:', products.slice(0, 2).map(p => ({
      title: p.title,
      category: p.category,
      sold: p.sold
    })));

    return NextResponse.json({ products });
  } catch (err) {
    //console.error('Error fetching products:', err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
