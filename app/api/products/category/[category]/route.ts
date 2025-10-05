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

    // Build query object
    const query: any = {
      category: { $regex: new RegExp(`^${category}$`, "i") },
      sold: { $ne: true }, // Only show unsold products in public listings
    };

    // Add state filter if provided (flexible matching)
    if (state && state.trim()) {
      query.state = { $regex: new RegExp(state.trim(), "i") };
    }

    // Add city filter if provided (flexible matching)
    if (city && city.trim()) {
      query.city = { $regex: new RegExp(city.trim(), "i") };
    }

    const products = await Product.find(query)
      .select("title image price college category email phone sold city state")
      .sort({ createdAt: -1 });

    console.log(`Category ${category} query:`, query);
    console.log(`Searching for - State: "${state}", City: "${city}"`);
    console.log(`Found ${products.length} products for category ${category}`);

    // Debug: Show sample of actual state/city values in database
    if (products.length === 0 && (state || city)) {
      const allProductsInCategory = await Product.find({
        category: { $regex: new RegExp(`^${category}$`, "i") },
        sold: { $ne: true }
      }).select("state city").limit(5);
      console.log('Sample state/city values in database:', allProductsInCategory.map(p => ({ state: p.state, city: p.city })));
    }

    return NextResponse.json({ products });
  } catch (err) {
    //console.error('Error fetching products:', err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
