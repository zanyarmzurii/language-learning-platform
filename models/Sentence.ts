import mongoose, { Schema, Document } from "mongoose";

export interface ISentence extends Document {
  sentence: string;
  translation: string;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  words: mongoose.Types.ObjectId[];
  grammarPoints: string[];
  audioUrl?: string;
  usageCount: number;
}

const SentenceSchema = new Schema<ISentence>(
  {
    sentence: {
      type: String,
      required: true,
      index: true,
    },
    translation: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    words: [
      {
        type: Schema.Types.ObjectId,
        ref: "Word",
      },
    ],
    grammarPoints: [String],
    audioUrl: String,
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

SentenceSchema.index({ language: 1, difficulty: 1 });
SentenceSchema.index({ sentence: "text", translation: "text" });

export default mongoose.models.Sentence ||
  mongoose.model<ISentence>("Sentence", SentenceSchema);
