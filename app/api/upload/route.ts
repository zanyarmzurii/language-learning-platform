import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json(
        { error: "هیچ فایلێک نەنێردراوە" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes: any = {
      video: ["video/mp4", "video/webm", "video/ogg"],
      pdf: ["application/pdf"],
      word: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      ppt: [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ],
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      voice: ["audio/mpeg", "audio/wav", "audio/ogg"],
    };

    if (type && allowedTypes[type] && !allowedTypes[type].includes(file.type)) {
      return NextResponse.json(
        { error: `جۆری فایلەکە ڕێگەپێدراو نییە بۆ ${type}` },
        { status: 400 }
      );
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "قەبارەی فایلەکە زیاترە لە ٥٠٠ مێگابایت" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = file.name.split(".").pop();
    const filename = `${uuidv4()}.${extension}`;

    // Save to public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, filename);

    // Create directory if not exists
    const fs = require("fs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json(
      {
        message: "فایلەکە بە سەرکەوتوویی ئەپلۆد کرا",
        url,
        filename,
        size: file.size,
        type: file.type,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە ئەپلۆدکردنی فایل" },
      { status: 500 }
    );
  }
}
