import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
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
    const { paymentId, transactionId } = body;

    if (!paymentId || !transactionId) {
      return NextResponse.json(
        { error: "ژمارەی پارەدان و مامەڵە پێویستن" },
        { status: 400 }
      );
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return NextResponse.json(
        { error: "پارەدان نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    if (payment.userId.toString() !== user.userId) {
      return NextResponse.json(
        { error: "دەسەڵاتی تەواوت نییە" },
        { status: 403 }
      );
    }

    payment.transactionId = transactionId;
    await payment.save();

    return NextResponse.json({
      message:
        "ژمارەی مامەڵەکە تۆمار کرا. چاوەڕێی پشتڕاستکردنەوە بکە.",
      payment: {
        id: payment._id,
        status: payment.status,
      },
    });
  } catch (error: any) {
    console.error("Verify Payment Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
