import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quiz from "@/models/Quiz";
import Progress from "@/models/Progress";
import { getUserFromRequest } from "@/lib/auth";

// GET - Get user's quizzes
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

    const quizzes = await Quiz.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ quizzes }, { status: 200 });
  } catch (error: any) {
    console.error("Get Quizzes Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}

// POST - Submit quiz answers
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
    const { quizId, answers, timeSpent } = body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return NextResponse.json(
        { error: "کویز نەدۆزرایەوە" },
        { status: 404 }
      );
    }

    // Grade quiz
    let score = 0;
    quiz.questions.forEach((q: any, index: number) => {
      q.userAnswer = answers[index];
      q.isCorrect = q.userAnswer === q.correctAnswer;
      if (q.isCorrect) score++;
    });

    quiz.score = (score / quiz.totalQuestions) * 100;
    quiz.timeSpent = timeSpent;
    quiz.completed = true;
    await quiz.save();

    // Update progress
    let progress = await Progress.findOne({ userId: user.userId });
    if (!progress) {
      progress = await Progress.create({
        userId: user.userId,
        language: quiz.language,
      });
    }

    progress.quizzesCompleted += 1;
    progress.averageScore =
      (progress.averageScore * (progress.quizzesCompleted - 1) + quiz.score) /
      progress.quizzesCompleted;
    progress.xp += score * 10;
    progress.totalTimeSpent += timeSpent;

    // Check level up
    if (progress.xp >= progress.nextLevelXp) {
      progress.level += 1;
      progress.xp -= progress.nextLevelXp;
      progress.nextLevelXp = Math.floor(progress.nextLevelXp * 1.5);
    }

    // Update streak
    const today = new Date().toISOString().split("T")[0];
    const lastActive = progress.lastActiveDate.toISOString().split("T")[0];

    if (lastActive === today) {
      // Already active today
    } else if (
      lastActive ===
      new Date(Date.now() - 86400000).toISOString().split("T")[0]
    ) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }

    progress.lastActiveDate = new Date();

    // Add daily progress
    progress.dailyProgress.push({
      date: today,
      wordsLearned: 0,
      quizzesTaken: 1,
      timeSpent,
      score: quiz.score,
    });

    await progress.save();

    return NextResponse.json(
      {
        message: "کویزەکە تەواو بوو",
        quiz: {
          id: quiz._id,
          score: quiz.score,
          questions: quiz.questions,
        },
        progress: {
          level: progress.level,
          xp: progress.xp,
          streak: progress.streak,
          averageScore: progress.averageScore,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Submit Quiz Error:", error);
    return NextResponse.json(
      { error: "هەڵەیەک ڕوویدا لە سێرڤەر" },
      { status: 500 }
    );
  }
}
