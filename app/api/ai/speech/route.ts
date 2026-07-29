import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { gradeSpeaking } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json(
        { error: "تکایە یەکەم جار بچۆ ژوورەوە" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { expectedText, spokenText } = body;

    if (!expectedText || !spokenText) {
      return NextResponse.json(
        { error: "دەقی چاوەڕوانکراو و دەقی وتە پێویستن" },
        { status: 400 }
      );
    }

    const result = await gradeSpeaking(expectedText, spokenText);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error: any) {
    console.error("Speech Evaluation Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە هەڵسەنگاندنی دەنگ" },
      { status: 500 }
    );
  }
}
