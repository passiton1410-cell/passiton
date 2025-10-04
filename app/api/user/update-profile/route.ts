// /app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = decoded._id || decoded.userId;
  const { fullName, username, collegeIdUrl, mobile, collegeName } =
    await req.json();

  if (!fullName && !username && !collegeIdUrl && !mobile && !collegeName) {
    return NextResponse.json(
      { error: "No updates provided" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  if (username) {
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullName && { fullName }),
        ...(username && { username }),
        ...(collegeIdUrl && { collegeIdUrl }),
        ...(mobile && { mobile }),
        ...(collegeName && { collegeName }),
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated",
      user: {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        collegeIdUrl: user.collegeIdUrl,
        mobile: user.mobile,
        collegeName: user.collegeName,
        verified: user.verified,
        userId: user._id,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
