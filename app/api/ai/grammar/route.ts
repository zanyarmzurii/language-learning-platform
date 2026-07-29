import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { checkGrammar } from "@/lib/openai";

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
    const { text, language } = body;

    if (!text || !language) {
      return NextResponse.json(
        { error: "دەق و زمان پێویستن" },
        { status: 400 }
      );
    }

    const result = await checkGrammar(text, language);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error: any) {
    console.error("Grammar Check Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە پشکنینی ڕێزمان" },
      { status: 500 }
    );
  }
}
