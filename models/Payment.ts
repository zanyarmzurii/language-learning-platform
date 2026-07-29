import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  planType?: "plus" | "premium" | "family" | "business";
  duration?: "1month" | "3months" | "6months" | "1year";
  amount: number;
  currency: string;
  paymentMethod: "FIB" | "FastPay";
  senderName: string;
  senderPhone: string;
  transactionId?: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
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
    planType: {
      type: String,
      enum: ["plus", "premium", "family", "business"],
    },
    duration: {
      type: String,
      enum: ["1month", "3months", "6months", "1year"],
    },
    amount: {
      type: Number,
      required: [true, "بڕی پارە پێویستە"],
    },
    currency: {
      type: String,
      default: "IQD",
    },
    paymentMethod: {
      type: String,
      enum: ["FIB", "FastPay"],
      required: [true, "شێوازی پارەدان پێویستە"],
    },
    senderName: {
      type: String,
      required: [true, "ناوی نێرەر پێویستە"],
    },
    senderPhone: {
      type: String,
      required: [true, "ژمارەی مۆبایل پێویستە"],
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
