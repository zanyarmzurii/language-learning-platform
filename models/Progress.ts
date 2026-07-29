import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  language: string;
  wordsLearned: number;
  totalWords: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  averageScore: number;
  streak: number;
  lastActiveDate: Date;
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
  level: number;
  xp: number;
  nextLevelXp: number;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    language: {
      type: String,
      required: true,
    },
    wordsLearned: {
      type: Number,
      default: 0,
    },
    totalWords: {
      type: Number,
      default: 1000,
    },
    quizzesCompleted: {
      type: Number,
      default: 0,
    },
    totalQuizzes: {
      type: Number,
      default: 100,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
    },
    dailyProgress: [
      {
        date: String,
        wordsLearned: Number,
        quizzesTaken: Number,
        timeSpent: Number,
        score: Number,
      },
    ],
    achievements: [
      {
        name: String,
        description: String,
        icon: String,
        earnedAt: Date,
      },
    ],
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
    nextLevelXp: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);
