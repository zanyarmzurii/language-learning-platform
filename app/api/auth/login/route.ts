import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    // Validate
    if (!email || !password) {
      return NextResponse.json(
        { error: "ئیمەیڵ و وشەی نهێنی پێویستن" },
        { status: 400 }
      );
    }

    // Find user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "ئیمەیڵ یان وشەی نهێنی هەڵەیە" },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "ئیمەیڵ یان وشەی نهێنی هەڵەیە" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role);

    // Create response
    const response = NextResponse.json(
      {
        message: "بە سەرکەوتوویی چوویتە ژوورەوە",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          planType: user.planType,
        },
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
