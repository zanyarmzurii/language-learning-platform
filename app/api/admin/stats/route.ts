import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Payment from "@/models/Payment";
import Quiz from "@/models/Quiz";
import { getUserFromRequest } from "@/lib/auth";

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

    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      activeTeachers,
      totalCourses,
      approvedCourses,
      totalPayments,
      pendingPayments,
      approvedPayments,
      totalRevenue,
      totalQuizzes,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      User.countDocuments({ role: "teacher", teacherStatus: "active" }),
      Course.countDocuments(),
      Course.countDocuments({ isApproved: true }),
      Payment.countDocuments(),
      Payment.countDocuments({ status: "pending" }),
      Payment.countDocuments({ status: "approved" }),
      Payment.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Quiz.countDocuments(),
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    const stats = {
      users: {
        total: totalUsers,
        students: totalStudents,
        teachers: totalTeachers,
        activeTeachers,
      },
      courses: {
        total: totalCourses,
        approved: approvedCourses,
        pending: totalCourses - approvedCourses,
      },
      payments: {
        total: totalPayments,
        pending: pendingPayments,
        approved: approvedPayments,
        totalRevenue: revenue,
      },
      quizzes: totalQuizzes,
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
