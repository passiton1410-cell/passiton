import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { Opportunity } from '@/models/Opportunity';
import { User } from '@/models/User';

// GET - List all opportunities
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get all active opportunities with user details
    const opportunities = await Opportunity.find({ active: true })
      .populate('userId', 'fullName collegeName')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      opportunities: opportunities || []
    });

  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json({
      opportunities: [],
      error: 'Failed to fetch opportunities'
    }, { status: 500 });
  }
}

// POST - Create new opportunity
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as any;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const userId = decoded.userId;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get form data
    const formData = await req.json();
    const {
      title,
      description,
      type,
      company,
      location,
      city,
      state,
      college,
      email,
      phone,
      requirements,
      deadline,
      salary,
      duration
    } = formData;

    // Validate required fields
    if (!title || !description || !type || !company || !email) {
      return NextResponse.json({
        error: 'Title, description, type, company, and email are required'
      }, { status: 400 });
    }

    // Validate opportunity type
    const validTypes = ['jobs', 'internship', 'teaching', 'coaching', 'mentorship', 'other'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        error: 'Invalid opportunity type'
      }, { status: 400 });
    }

    // Create opportunity
    const newOpportunity = await Opportunity.create({
      title: title.trim(),
      description: description.trim(),
      type,
      company: company.trim(),
      location: location || 'on-site',
      city: city || user.city || '',
      state: state || user.state || '',
      college: college || user.collegeName || '',
      email: email.trim(),
      phone: phone?.trim() || '',
      requirements: requirements?.trim() || '',
      deadline: deadline || null,
      salary: salary?.trim() || '',
      duration: duration?.trim() || '',
      userId,
      active: true
    });

    return NextResponse.json({
      success: true,
      message: 'Opportunity posted successfully',
      opportunity: {
        id: newOpportunity._id,
        title: newOpportunity.title,
        company: newOpportunity.company,
        type: newOpportunity.type
      }
    });

  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json({
      error: 'Failed to create opportunity'
    }, { status: 500 });
  }
}