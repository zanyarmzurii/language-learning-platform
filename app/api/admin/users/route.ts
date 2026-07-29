import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
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

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const filter: any = {};
    if (role) filter.role = role;
    if (status) filter.teacherStatus = status;

    const users = await User.find(filter)
      .select("-password -teacherActivationKey")
      .sort({ createdAt: -1 });

    const stats = {
      total: users.length,
      students: users.filter((u) => u.role === "student").length,
      teachers: users.filter((u) => u.role === "teacher").length,
      active: users.filter((u) => u.teacherStatus === "active").length,
      pending: users.filter((u) => u.teacherStatus === "pending").length,
    };

    return NextResponse.json({ users, stats }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Users Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
