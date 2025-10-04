import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs"; // disable edge to use formdata & cloudinary

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "File must be an image" },
      { status: 400 }
    );
  }
  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "pass-it-on" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json(result);
  } catch (err) {
    //console.error("Upload Error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
