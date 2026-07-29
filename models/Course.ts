import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  teacherId: mongoose.Types.ObjectId;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  currency: string;
  activationKey?: string;
  isActive: boolean;
  isApproved: boolean;
  thumbnail?: string;
  totalStudents: number;
  rating: number;
  reviews: Array<{
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  content: Array<{
    type: "video" | "pdf" | "word" | "ppt" | "image" | "voice";
    title: string;
    url: string;
    duration?: number;
    order: number;
    isFree: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "ناونیشانی خول پێویستە"],
      trim: true,
      maxlength: [100, "ناونیشان نابێت زیاتر لە ١٠٠ پیت بێت"],
    },
    description: {
      type: String,
      required: [true, "باسکردنی خول پێویستە"],
      maxlength: [1000, "باسکردن نابێت زیاتر لە ١٠٠٠ پیت بێت"],
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: {
      type: String,
      required: [true, "زمان پێویستە"],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    price: {
      type: Number,
      required: [true, "نرخی خول پێویستە"],
      min: [0, "نرخ نابێت کەمتر لە ٠ بێت"],
    },
    currency: {
      type: String,
      default: "IQD",
      enum: ["IQD", "USD"],
    },
    activationKey: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: "/images/default-course.png",
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    content: [
      {
        type: {
          type: String,
          enum: ["video", "pdf", "word", "ppt", "image", "voice"],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        duration: Number,
        order: {
          type: Number,
          required: true,
        },
        isFree: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
