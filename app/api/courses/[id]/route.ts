import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { getUserFromRequest } from "@/lib/auth";

// GET - هێنانی تایبەتمەندییەکانی خولێک
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const course = await Course.findById(params.id)
      .populate("teacherId", "name avatar bio totalStudents totalCourses")
      .populate("reviews.userId", "name avatar");

    if (!course) {
      return NextResponse.json(
        { error: "خولەکە نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    return NextResponse.json({ course }, { status: 200 });
  } catch (error: any) {
    console.error("Get Course Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}

// PUT - نوێکردنەوەی خول
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json(
        { error: "دەسەڵاتی تەواوت نییە" },
        { status: 401 }
      );
    }

    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json(
        { error: "خولەکە نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    // Check ownership
    if (course.teacherId.toString() !== user.userId && user.role !== "admin") {
      return NextResponse.json(
        { error: "تەنها خاوەنی خول یان ئەدمین دەتوانێت دەستکاری بکات" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updatedCourse = await Course.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      {
        message: "خولەکە بە سەرکەوتوویی نوێ کرایەوە",
        course: updatedCourse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Course Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}

// DELETE - سڕینەوەی خول
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json(
        { error: "دەسەڵاتی تەواوت نییە" },
        { status: 401 }
      );
    }

    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json(
        { error: "خولەکە نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    if (course.teacherId.toString() !== user.userId && user.role !== "admin") {
      return NextResponse.json(
        { error: "تەنها خاوەنی خول یان ئەدمین دەتوانێت بیسڕێتەوە" },
        { status: 403 }
      );
    }

    await Course.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "خولەکە بە سەرکەوتوویی سڕایەوە" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Course Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
