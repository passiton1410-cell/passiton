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

    const products = await Product.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    })
      .select("title image price college category email phone sold")
      .sort({ createdAt: -1 });
      console.log(products)

    return NextResponse.json({ products });
  } catch (err) {
    //console.error('Error fetching products:', err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
