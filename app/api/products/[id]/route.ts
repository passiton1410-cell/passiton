import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format before querying database
    if (!isValidObjectId(id)) {
      console.log(`Invalid ObjectId format: "${id}"`);
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findById(id)
      .select("title image images price college category email phone sold city state description createdAt")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.error("Error fetching product:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}