import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
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
    const { amount, planType, duration, courseId, senderName, senderPhone } =
      body;

    if (!amount || !senderName || !senderPhone) {
      return NextResponse.json(
        { error: "هەموو خانە پێویستەکان پڕ بکەرەوە" },
        { status: 400 }
      );
    }

    const payment = await Payment.create({
      userId: user.userId,
      courseId: courseId || undefined,
      planType: planType || undefined,
      duration: duration || undefined,
      amount,
      currency: "IQD",
      paymentMethod: "FastPay",
      senderName,
      senderPhone,
      status: "pending",
    });

    const fastpayNumber = process.env.FASTPAY_NUMBER || "+964 750 604 5491";
    const fastpayName = process.env.FASTPAY_NAME || "KurdiLearn Platform";

    return NextResponse.json(
      {
        message: "تکایە پارەکە بنێرە بۆ ئەم ژمارەیە",
        payment: {
          id: payment._id,
          amount: payment.amount,
          fastpayNumber: fastpayNumber,
          fastpayName: fastpayName,
          instructions: `
١. بڕۆ بۆ ئەپلیکەیشنی FastPay
٢. پارەی ${amount} دینار بنێرە بۆ ژمارەی ${fastpayNumber}
٣. ناوی وەرگر: ${fastpayName}
٤. دوای ناردنی پارەکە، ئەم زانیاریانە بنێرە:
   - ژمارەی مامەڵەکە (Transaction ID)
   - وێنەی سکرین شەتی پارەدانەکە
٥. چاوەڕێی پشتڕاستکردنەوە بکە (١-٢٤ کاتژمێر)
          `,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("FastPay Payment Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
