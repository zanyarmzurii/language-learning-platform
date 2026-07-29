import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { getUserFromRequest } from "@/lib/auth";

// POST - Add review
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
    const { courseId, rating, comment } = body;

    if (!courseId || !rating || !comment) {
      return NextResponse.json(
        { error: "خول، هەڵسەنگاندن و کۆمێنت پێویستن" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "هەڵسەنگاندن دەبێت لە نێوان ١ بۆ ٥ بێت" },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { error: "خول نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(
      (r: any) => r.userId.toString() === user.userId
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.createdAt = new Date();
    } else {
      // Add new review
      course.reviews.push({
        userId: user.userId,
        rating,
        comment,
        createdAt: new Date(),
      });
    }

    // Recalculate average rating
    const totalRating = course.reviews.reduce(
      (sum: number, r: any) => sum + r.rating,
      0
    );
    course.rating = totalRating / course.reviews.length;

    await course.save();

    return NextResponse.json(
      {
        message: "هەڵسەنگاندن بە سەرکەوتوویی زیاد کرا",
        rating: course.rating,
        totalReviews: course.reviews.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Add Review Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}

// GET - Get reviews for a course
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "ناسنامەی خول پێویستە" },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId)
      .populate("reviews.userId", "name avatar")
      .select("reviews rating");

    if (!course) {
      return NextResponse.json(
        { error: "خول نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        reviews: course.reviews,
        averageRating: course.rating,
        totalReviews: course.reviews.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get Reviews Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
