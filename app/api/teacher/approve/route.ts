import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

// GET - Get pending teachers
export async function GET(req: Request) {
  try {
    await connectDB();

    const adminUser = await getUserFromRequest(req as any);
    if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "owner")) {
      return NextResponse.json(
        { error: "دەسەڵاتی تەواوت نییە" },
        { status: 403 }
      );
    }

    const pendingTeachers = await User.find({
      role: "teacher",
      teacherStatus: "pending",
    }).sort({ createdAt: -1 });

    return NextResponse.json({ teachers: pendingTeachers }, { status: 200 });
  } catch (error: any) {
    console.error("Get Pending Teachers Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}

// PUT - Approve or reject teacher
export async function PUT(req: Request) {
  try {
    await connectDB();

    const adminUser = await getUserFromRequest(req as any);
    if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "owner")) {
      return NextResponse.json(
        { error: "دەسەڵاتی تەواوت نییە" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { teacherId, action, activationKey } = body;

    if (!teacherId || !action) {
      return NextResponse.json(
        { error: "ناسنامەی مامۆستا و کردار پێویستن" },
        { status: 400 }
      );
    }

    const teacher = await User.findById(teacherId);

    if (!teacher) {
      return NextResponse.json(
        { error: "مامۆستا نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      teacher.teacherStatus = "active";
      teacher.teacherActivationKey =
        activationKey || `TEACHER-${Date.now()}`;
      await teacher.save();

      return NextResponse.json({
        message: "مامۆستا بە سەرکەوتوویی پەسەند کرا",
        teacher: {
          id: teacher._id,
          name: teacher.name,
          status: teacher.teacherStatus,
          activationKey: teacher.teacherActivationKey,
        },
      });
    } else if (action === "reject") {
      teacher.teacherStatus = "rejected";
      await teacher.save();

      return NextResponse.json({
        message: "داواکاری مامۆستا ڕەتکرایەوە",
      });
    }

    return NextResponse.json(
      { error: "کردارێکی دروست دیاری بکە" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Approve Teacher Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
