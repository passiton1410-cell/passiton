import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get all unsold products with their location data
    const products = await Product.find({ sold: { $ne: true } })
      .select("title category state city college createdAt")
      .sort({ createdAt: -1 })
      .limit(20);

    // Get unique states and cities
    const allProducts = await Product.find({ sold: { $ne: true } }).select("state city");
    const states = [...new Set(allProducts.map(p => p.state).filter(Boolean))];
    const cities = [...new Set(allProducts.map(p => p.city).filter(Boolean))];

    return NextResponse.json({
      totalProducts: products.length,
      products: products.map(p => ({
        title: p.title,
        category: p.category,
        state: p.state,
        city: p.city,
        college: p.college,
        createdAt: p.createdAt
      })),
      uniqueStates: states.sort(),
      uniqueCities: cities.sort(),
      summary: {
        productsWithState: allProducts.filter(p => p.state).length,
        productsWithCity: allProducts.filter(p => p.city).length,
        productsWithoutLocation: allProducts.filter(p => !p.state || !p.city).length
      }
    });
  } catch (err) {
    console.error('Debug API error:', err);
    return NextResponse.json(
      { error: "Failed to fetch debug info" },
      { status: 500 }
    );
  }
}