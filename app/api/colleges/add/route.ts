import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { College } from '@/models/College';
import { User } from '@/models/User';
import { searchColleges as searchStaticColleges } from '@/lib/indian-colleges';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { collegeName } = await req.json();

    if (!collegeName || collegeName.trim().length < 3) {
      return NextResponse.json({
        error: 'College name must be at least 3 characters long'
      }, { status: 400 });
    }

    const trimmedCollegeName = collegeName.trim();

    // Check if college already exists in static list
    const staticColleges = searchStaticColleges(trimmedCollegeName);
    const exactMatch = staticColleges.find(college =>
      college.toLowerCase() === trimmedCollegeName.toLowerCase()
    );

    if (exactMatch) {
      return NextResponse.json({
        message: 'College already exists in our database',
        collegeName: exactMatch,
        existed: true
      });
    }

    // Check if college already exists in dynamic database
    const existingCollege = await College.findOne({
      name: { $regex: new RegExp(`^${trimmedCollegeName}$`, 'i') }
    });

    if (existingCollege) {
      // Increment usage count
      existingCollege.usageCount += 1;
      await existingCollege.save();

      return NextResponse.json({
        message: 'College already exists in our database',
        collegeName: existingCollege.name,
        existed: true
      });
    }

    // Get user ID from token (if available)
    let userId = null;
    const token = req.cookies.get('token')?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        userId = decoded.userId;
      } catch (error) {
        // Token is invalid, but we can still add the college without user reference
        console.log('Invalid token, adding college without user reference');
      }
    }

    // Create new college entry
    // If no user ID (signup process), leave addedBy as null and link it later during user creation
    const newCollege = new College({
      name: trimmedCollegeName,
      addedBy: userId, // Will be null for signup process, linked later
      verified: false,
      usageCount: 1
    });

    await newCollege.save();

    return NextResponse.json({
      message: 'College added successfully and will be available for other users',
      collegeName: newCollege.name,
      existed: false,
      id: newCollege._id
    });

  } catch (error) {
    console.error('Error adding college:', error);
    return NextResponse.json({
      error: 'Failed to add college'
    }, { status: 500 });
  }
}