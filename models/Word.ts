import mongoose, { Schema, Document } from "mongoose";

export interface IWord extends Document {
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: string;
  language: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  example: string;
  exampleTranslation: string;
  imageUrl?: string;
  audioUrl?: string;
  synonyms: string[];
  antonyms: string[];
  usageCount: number;
  masteredBy: mongoose.Types.ObjectId[];
}

const WordSchema = new Schema<IWord>(
  {
    word: {
      type: String,
      required: true,
      index: true,
    },
    translation: {
      type: String,
      required: true,
    },
    pronunciation: {
      type: String,
      required: true,
    },
    partOfSpeech: {
      type: String,
      enum: ["noun", "verb", "adjective", "adverb", "preposition", "conjunction"],
      required: true,
    },
    language: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    example: {
      type: String,
      required: true,
    },
    exampleTranslation: {
      type: String,
      required: true,
    },
    imageUrl: String,
    audioUrl: String,
    synonyms: [String],
    antonyms: [String],
    usageCount: {
      type: Number,
      default: 0,
    },
    masteredBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient search
WordSchema.index({ language: 1, category: 1, difficulty: 1 });
WordSchema.index({ word: "text", translation: "text" });

export default mongoose.models.Word || mongoose.model<IWord>("Word", WordSchema);
