import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Progress from "@/models/Progress";
import { getUserFromRequest } from "@/lib/auth";

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

    let progress = await Progress.findOne({ userId: user.userId });

    if (!progress) {
      progress = await Progress.create({
        userId: user.userId,
        language: "English",
      });
    }

    // Check and update streak
    const today = new Date().toISOString().split("T")[0];
    const lastActive = progress.lastActiveDate.toISOString().split("T")[0];

    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      if (lastActive !== yesterday) {
        progress.streak = 0;
        await progress.save();
      }
    }

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error: any) {
    console.error("Get Progress Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
