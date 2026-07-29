import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

// GET - هێنانی هەموو خولەکان
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language");
    const level = searchParams.get("level");
    const teacherId = searchParams.get("teacherId");
    const approved = searchParams.get("approved");

    const filter: any = {};

    if (language) filter.language = language;
    if (level) filter.level = level;
    if (teacherId) filter.teacherId = teacherId;
    if (approved) filter.isApproved = approved === "true";

    const courses = await Course.find(filter)
      .populate("teacherId", "name avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error: any) {
    console.error("Get Courses Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}

// POST - دروستکردنی خولی نوێ
export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "teacher") {
      return NextResponse.json(
        { error: "تەنها مامۆستا دەتوانێت خول دروست بکات" },
        { status: 403 }
      );
    }

    // Check if teacher is active
    const teacher = await User.findById(user.userId);
    if (teacher?.teacherStatus !== "active") {
      return NextResponse.json(
        {
          error:
            "هەژماری مامۆستاکەت چالاک نەکراوە. تکایە کلیلی چالاککردنەوە بکڕە",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, language, level, price, currency, thumbnail } =
      body;

    if (!title || !description || !language || !level || !price) {
      return NextResponse.json(
        { error: "هەموو خانە پێویستەکان پڕ بکەرەوە" },
        { status: 400 }
      );
    }

    const course = await Course.create({
      title,
      description,
      teacherId: user.userId,
      language,
      level,
      price,
      currency: currency || "IQD",
      thumbnail: thumbnail || "/images/default-course.png",
      isActive: true,
      isApproved: false, // دەبێت ئەدمین پەسەند بکات
    });

    // Update teacher stats
    await User.findByIdAndUpdate(user.userId, {
      $inc: { totalCourses: 1 },
    });

    return NextResponse.json(
      {
        message: "خولەکە بە سەرکەوتوویی دروست کرا و چاوەڕێی پەسەندکردنە",
        course: {
          id: course._id,
          title: course.title,
          status: "چاوەڕوان",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Course Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
