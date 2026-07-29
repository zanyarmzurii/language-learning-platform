import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quiz from "@/models/Quiz";
import { getUserFromRequest } from "@/lib/auth";
import { generateQuiz } from "@/lib/openai";

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
    const { language, level, topic, count = 5 } = body;

    if (!language || !level || !topic) {
      return NextResponse.json(
        { error: "زمان، ئاست و بابەت پێویستن" },
        { status: 400 }
      );
    }

    // Generate quiz using AI
    const questions = await generateQuiz(language, level, topic, count);

    // Save to database
    const quiz = await Quiz.create({
      userId: user.userId,
      language,
      level,
      topic,
      questions,
      totalQuestions: questions.length,
      isAIGenerated: true,
    });

    return NextResponse.json(
      {
        message: "کویزی زیرەک دروست کرا",
        quiz: {
          id: quiz._id,
          language: quiz.language,
          level: quiz.level,
          topic: quiz.topic,
          questions: quiz.questions,
          totalQuestions: quiz.totalQuestions,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("AI Quiz Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە دروستکردنی کویز" },
      { status: 500 }
    );
  }
}
