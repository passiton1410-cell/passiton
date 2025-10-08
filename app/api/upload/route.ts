import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs"; // disable edge to use formdata & cloudinary

export async function POST(req: Request) {
  const formData = await req.formData();

  // Check if it's multiple files or single file
  const files = formData.getAll("files") as File[];
  const singleFile = formData.get("file") as File;

  let filesToProcess: File[] = [];

  if (files.length > 0) {
    // Multiple files upload
    filesToProcess = files;

    if (filesToProcess.length > 4) {
      return NextResponse.json({ error: "Maximum 4 images allowed" }, { status: 400 });
    }
    if (filesToProcess.length < 1) {
      return NextResponse.json({ error: "At least 1 image required" }, { status: 400 });
    }
  } else if (singleFile) {
    // Single file upload (backward compatibility)
    filesToProcess = [singleFile];
  } else {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  // Validate each file
  for (const file of filesToProcess) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "All files must be images" },
        { status: 400 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit per file
      return NextResponse.json({ error: "Each file must be under 5MB" }, { status: 400 });
    }
  }

  try {
    const uploadPromises = filesToProcess.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "pass-it-on" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    // Return different format based on upload type
    if (filesToProcess.length === 1) {
      // Single file - return same format as before for backward compatibility
      return NextResponse.json(results[0]);
    } else {
      // Multiple files - return array of results
      return NextResponse.json({
        success: true,
        images: results.map((result: any) => result.secure_url),
        count: results.length
      });
    }
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
