import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import { getUserFromRequest } from "@/lib/auth";

// POST - Buy activation key
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
    const { paymentMethod, senderName, senderPhone, amount = 50000 } = body;

    if (!paymentMethod || !senderName || !senderPhone) {
      return NextResponse.json(
        { error: "هەموو زانیارییەکان پێویستن" },
        { status: 400 }
      );
    }

    // Create payment for activation key
    const payment = await Payment.create({
      userId: user.userId,
      amount,
      currency: "IQD",
      paymentMethod,
      senderName,
      senderPhone,
      status: "pending",
      notes: "کڕینی کلیلی چالاککردنەوەی مامۆستا",
    });

    const accountNumbers = {
      FIB: "+964 750 604 5491",
      FastPay: "+964 750 604 5491",
    };

    return NextResponse.json(
      {
        message: "داواکاری کڕینی کلیلی چالاککردنەوە تۆمار کرا",
        payment: {
          id: payment._id,
          amount: payment.amount,
          accountNumber: accountNumbers[paymentMethod],
          instructions: `
بۆ چالاککردنی هەژماری مامۆستا:
١. پارەی ${amount} دینار بنێرە بۆ ${paymentMethod}: ${accountNumbers[paymentMethod]}
٢. دوای ناردنی پارەکە، کلیلی چالاککردنەوە دەنێردرێت بۆ ئیمەیڵەکەت
٣. کلیلی چالاککردنەوە: TEACHER-2024-ACTIVATE
          `,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Buy Key Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}

// GET - Check key status
export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json(
        { error: "تکایە یەکەم جار بچۆ ژوورەوە" },
        { status: 401 }
      );
    }

    const teacher = await User.findById(user.userId).select(
      "+teacherActivationKey"
    );

    return NextResponse.json({
      isActivated: teacher?.teacherStatus === "active",
      status: teacher?.teacherStatus || "none",
    });
  } catch (error: any) {
    console.error("Key Status Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
