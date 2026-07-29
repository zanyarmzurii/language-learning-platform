import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin" | "owner";
  phone?: string;
  avatar?: string;
  planType: "free" | "plus" | "premium" | "family" | "business";
  planExpiryDate?: Date;
  teacherStatus?: "pending" | "active" | "rejected";
  teacherActivationKey?: string;
  totalStudents?: number;
  totalCourses?: number;
  totalEarnings?: number;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "ناو پێویستە"],
      trim: true,
      maxlength: [50, "ناو نابێت زیاتر لە ٥٠ پیت بێت"],
    },
    email: {
      type: String,
      required: [true, "ئیمەیڵ پێویستە"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "ئیمەیڵێکی دروست بنووسە"],
    },
    password: {
      type: String,
      required: [true, "وشەی نهێنی پێویستە"],
      minlength: [6, "وشەی نهێنی نابێت کەمتر لە ٦ پیت بێت"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin", "owner"],
      default: "student",
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "/images/default-avatar.png",
    },
    planType: {
      type: String,
      enum: ["free", "plus", "premium", "family", "business"],
      default: "free",
    },
    planExpiryDate: {
      type: Date,
    },
    teacherStatus: {
      type: String,
      enum: ["pending", "active", "rejected"],
    },
    teacherActivationKey: {
      type: String,
      select: false,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    totalCourses: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
