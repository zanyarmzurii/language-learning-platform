import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const { status } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "ڕەوشی پارەدان پێویستە (approved/rejected)" },
        { status: 400 }
      );
    }

    const payment = await Payment.findById(params.id);

    if (!payment) {
      return NextResponse.json(
        { error: "پارەدان نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    payment.status = status;
    payment.approvedBy = adminUser.userId;
    await payment.save();

    // If approved, update user plan
    if (status === "approved") {
      const user = await User.findById(payment.userId);

      if (user && payment.planType && payment.duration) {
        user.planType = payment.planType;

        // Calculate expiry
        const durations: any = {
          "1month": 30,
          "3months": 90,
          "6months": 180,
          "1year": 365,
        };

        const days = durations[payment.duration] || 30;
        user.planExpiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        await user.save();
      }
    }

    return NextResponse.json(
      {
        message: `پارەدان ${status === "approved" ? "پەسەند" : "ڕەت"} کرا`,
        payment: {
          id: payment._id,
          status: payment.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Payment Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
