import { NextResponse } from "next/server";
import Feedback from "@/models/Feedback";
import { connectToDatabase } from "@/lib/db";

// In-memory store to track last submission timestamps per IP
const submissionTimestamps = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("cf-connecting-ip") || // for Cloudflare
      request.headers.get("x-real-ip") || // for reverse proxies
      "unknown";

    const now = Date.now();
    const lastSubmission = submissionTimestamps.get(ip);

    if (lastSubmission && now - lastSubmission < 30_000) {
      return NextResponse.json(
        { error: "You're submitting too fast. Please wait a few seconds." },
        { status: 429 }
      );
    }

    const { name, email, message } = await request.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await connectToDatabase();

    const feedback = new Feedback({ name, email, message });
    await feedback.save();

    // Update the timestamp for this IP
    submissionTimestamps.set(ip, now);

    return NextResponse.json(
      { message: "Feedback saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    //console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
