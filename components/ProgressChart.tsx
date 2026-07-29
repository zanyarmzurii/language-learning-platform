"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

interface ProgressChartProps {
  progress: {
    level: number;
    xp: number;
    nextLevelXp: number;
    streak: number;
    wordsLearned: number;
    totalWords: number;
    quizzesCompleted: number;
    averageScore: number;
    totalTimeSpent: number;
    dailyProgress: Array<{
      date: string;
      wordsLearned: number;
      quizzesTaken: number;
      timeSpent: number;
      score: number;
    }>;
    achievements: Array<{
      name: string;
      description: string;
      icon: string;
      earnedAt: Date;
    }>;
  };
}

export default function ProgressChart({ progress }: ProgressChartProps) {
  const xpPercent = (progress.xp / progress.nextLevelXp) * 100;
  const hoursSpent = Math.floor(progress.totalTimeSpent / 3600);
  const minutesSpent = Math.floor((progress.totalTimeSpent % 3600) / 60);

  return (
    <div className="space-y-6">
      {/* Level & XP */}
      <Card>
        <CardHeader>
          <CardTitle>ئاست و ئەزموون</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-purple-600">
              Level {progress.level}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{progress.xp} XP</span>
                <span>{progress.nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="text-center text-2xl">
            🔥 {progress.streak} ڕۆژ
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-green-600">
              {progress.wordsLearned}
            </div>
            <div className="text-gray-600">وشەی فێربوو</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600">
              {progress.quizzesCompleted}
            </div>
            <div className="text-gray-600">کویزی تەواوکراو</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-yellow-600">
              {progress.averageScore.toFixed(0)}%
            </div>
            <div className="text-gray-600">تێکڕای نمرە</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-purple-600">
              {hoursSpent}h {minutesSpent}m
            </div>
            <div className="text-gray-600">کاتی فێربوون</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {progress.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🏆 دەستکەوتەکان</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {progress.achievements.map((achievement, i) => (
                <div key={i} className="text-center p-4">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-semibold text-sm">
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
