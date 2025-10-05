import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    // Get all products with their categories
    const products = await Product.find({}).select("title category sold createdAt");

    // Get unique categories
    const categories = [...new Set(products.map(p => p.category))];

    // Count products per category
    const categoryStats = categories.map(cat => ({
      category: cat,
      total: products.filter(p => p.category === cat).length,
      unsold: products.filter(p => p.category === cat && p.sold !== true).length,
      sold: products.filter(p => p.category === cat && p.sold === true).length
    }));

    return NextResponse.json({
      totalProducts: products.length,
      uniqueCategories: categories,
      categoryStats,
      sampleProducts: products.slice(0, 5).map(p => ({
        title: p.title,
        category: p.category,
        sold: p.sold,
        createdAt: p.createdAt
      }))
    });
  } catch (err) {
    console.error('Debug categories API error:', err);
    return NextResponse.json(
      { error: "Failed to fetch category debug info" },
      { status: 500 }
    );
  }
}