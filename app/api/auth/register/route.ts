import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, role, phone } = body;

    // Validate
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "ناو، ئیمەیڵ و وشەی نهێنی پێویستن" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "ئەم ئیمەیڵە پێشتر بەکارهاتووە" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      phone,
      teacherStatus: role === "teacher" ? "pending" : undefined,
    });

    return NextResponse.json(
      {
        message: "بە سەرکەوتوویی تۆمار کرا",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
