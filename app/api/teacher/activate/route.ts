import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
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
    const { activationKey } = body;

    if (!activationKey) {
      return NextResponse.json(
        { error: "کلیلی چالاککردنەوە پێویستە" },
        { status: 400 }
      );
    }

    // Find teacher
    const teacher = await User.findById(user.userId);

    if (!teacher) {
      return NextResponse.json(
        { error: "مامۆستا نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    if (teacher.role !== "teacher") {
      return NextResponse.json(
        { error: "تەنها مامۆستا دەتوانێت هەژماری چالاک بکات" },
        { status: 403 }
      );
    }

    if (teacher.teacherStatus === "active") {
      return NextResponse.json(
        { error: "هەژمارەکەت پێشتر چالاک کراوە" },
        { status: 400 }
      );
    }

    // Check activation key (in production, validate against purchased keys)
    const validKeys = [
      "TEACHER-2024-ACTIVATE",
      "KURDILEARN-TEACHER",
      "BADINI-TEACHER-KEY",
    ];

    if (!validKeys.includes(activationKey)) {
      return NextResponse.json(
        { error: "کلیلی چالاککردنەوە هەڵەیە یان بەکارهاتووە" },
        { status: 400 }
      );
    }

    // Activate teacher
    teacher.teacherStatus = "active";
    teacher.teacherActivationKey = activationKey;
    await teacher.save();

    return NextResponse.json(
      {
        message: "هەژماری مامۆستاکەت بە سەرکەوتوویی چالاک کرا! 🎉",
        teacher: {
          id: teacher._id,
          name: teacher.name,
          status: teacher.teacherStatus,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Teacher Activation Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
