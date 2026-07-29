import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
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
    const status = searchParams.get("status");

    const filter: any = {};
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate("userId", "name email phone")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    const stats = {
      total: payments.length,
      pending: payments.filter((p) => p.status === "pending").length,
      approved: payments.filter((p) => p.status === "approved").length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      approvedAmount: payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + p.amount, 0),
    };

    return NextResponse.json({ payments, stats }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Payments Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
