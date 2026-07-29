import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  userId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  language: string;
  level: string;
  topic: string;
  questions: Array<{
    question: string;
    type: "multiple_choice" | "fill_blank" | "translation" | "listening";
    options?: string[];
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
    audioUrl?: string;
    imageUrl?: string;
    explanation: string;
    timeTaken?: number;
  }>;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  isAIGenerated: boolean;
  completed: boolean;
  createdAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    language: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        type: {
          type: String,
          enum: ["multiple_choice", "fill_blank", "translation", "listening"],
          required: true,
        },
        options: [String],
        correctAnswer: { type: String, required: true },
        userAnswer: String,
        isCorrect: Boolean,
        audioUrl: String,
        imageUrl: String,
        explanation: { type: String, required: true },
        timeTaken: Number,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    isAIGenerated: {
      type: Boolean,
      default: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
