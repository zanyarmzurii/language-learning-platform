import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest, hashPassword } from "@/lib/auth";

// GET - Get user profile
export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json(
        { error: "تکایە یەکەم جار بچۆ ژوورەوە" },
        { status: 401 }
      );
    }

    const profile = await User.findById(user.userId)
      .select("-password -teacherActivationKey");

    if (!profile) {
      return NextResponse.json(
        { error: "پرۆفایل نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error: any) {
    console.error("Get Profile Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}

// PUT - Update profile
export async function PUT(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json(
        { error: "تکایە یەکەم جار بچۆ ژوورەوە" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, avatar, currentPassword, newPassword } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;

    // Handle password change
    if (currentPassword && newPassword) {
      const existingUser = await User.findById(user.userId).select("+password");
      const { comparePassword } = await import("@/lib/auth");
      const isMatch = await comparePassword(currentPassword, existingUser.password);

      if (!isMatch) {
        return NextResponse.json(
          { error: "وشەی نهێنی ئێستا هەڵەیە" },
          { status: 400 }
        );
      }

      updateData.password = await hashPassword(newPassword);
    }

    const updatedUser = await User.findByIdAndUpdate(user.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -teacherActivationKey");

    return NextResponse.json(
      {
        message: "پرۆفایل بە سەرکەوتوویی نوێ کرایەوە",
        profile: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
