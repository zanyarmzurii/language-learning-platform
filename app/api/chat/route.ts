import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

// In-memory store (بۆ پرۆدەکشن دەبێت Redis بەکاربهێنیت)
let messages: any[] = [];

// GET - هێنانی پەیامەکان
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const receiverId = searchParams.get("receiverId");

    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json(
        { error: "تکایە یەکەم جار بچۆ ژوورەوە" },
        { status: 401 }
      );
    }

    let filtered = messages;

    if (courseId) {
      filtered = filtered.filter((m) => m.courseId === courseId);
    }

    // Filter messages between two users
    filtered = filtered.filter(
      (m) =>
        (m.senderId === user.userId && m.receiverId === receiverId) ||
        (m.senderId === receiverId && m.receiverId === user.userId)
    );

    return NextResponse.json({ messages: filtered }, { status: 200 });
  } catch (error: any) {
    console.error("Get Messages Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}

// POST - ناردنی پەیامی نوێ
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
    const { receiverId, courseId, message, file } = body;

    if (!receiverId || !message) {
      return NextResponse.json(
        { error: "وەرگر و پەیام پێویستن" },
        { status: 400 }
      );
    }

    const newMessage = {
      id: Date.now().toString(),
      senderId: user.userId,
      receiverId,
      courseId: courseId || null,
      message,
      file: file || null,
      timestamp: new Date().toISOString(),
      read: false,
    };

    messages.push(newMessage);

    return NextResponse.json(
      {
        message: "پەیامەکە نێردرا",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Send Message Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
