import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { College } from '@/models/College';
import { searchColleges as searchStaticColleges } from '@/lib/indian-colleges';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ colleges: [] });
    }

    await connectToDatabase();

    // Search static colleges list
    const staticColleges = searchStaticColleges(query);

    // Search dynamic colleges from database
    const dynamicColleges = await College.find({
      name: { $regex: query, $options: 'i' }
    })
    .sort({ usageCount: -1, createdAt: -1 }) // Sort by usage count first, then by newest
    .limit(10)
    .select('name')
    .lean();

    // Combine results and remove duplicates
    const combinedResults = [
      ...staticColleges.slice(0, 8), // Take first 8 static results
      ...dynamicColleges.map(college => college.name)
    ];

    // Remove duplicates and limit to 10 total results
    const uniqueColleges = Array.from(new Set(combinedResults)).slice(0, 10);

    return NextResponse.json({
      colleges: uniqueColleges,
      hasResults: uniqueColleges.length > 0
    });

  } catch (error) {
    console.error('Error searching colleges:', error);
    return NextResponse.json({
      colleges: [],
      hasResults: false,
      error: 'Failed to search colleges'
    }, { status: 500 });
  }
}