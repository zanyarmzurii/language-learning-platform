import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { generateVocabulary } from "@/lib/openai";

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
    const { language, category, count = 10 } = body;

    if (!language || !category) {
      return NextResponse.json(
        { error: "زمان و کاتیگۆری پێویستن" },
        { status: 400 }
      );
    }

    const words = await generateVocabulary(language, category, count);

    return NextResponse.json(
      {
        message: "وشەکان دروست کران",
        words,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Vocabulary Generation Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە دروستکردنی وشە" },
      { status: 500 }
    );
  }
}
