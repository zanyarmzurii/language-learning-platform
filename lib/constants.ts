export const APP_NAME = "KurdiLearn";
export const APP_DESCRIPTION = "پلاتفۆرمی فێربوونی زمان بە زیرەکی دەستکرد";

export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
  OWNER: "owner",
} as const;

export const PLAN_TYPES = {
  FREE: "free",
  PLUS: "plus",
  PREMIUM: "premium",
  FAMILY: "family",
  BUSINESS: "business",
} as const;

export const PAYMENT_METHODS = {
  FIB: "FIB",
  FASTPAY: "FastPay",
} as const;

export const LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export const FILE_TYPES = {
  VIDEO: "video",
  PDF: "pdf",
  WORD: "word",
  PPT: "ppt",
  IMAGE: "image",
  VOICE: "voice",
} as const;

export const PAYMENT_NUMBERS = {
  FIB: "+964 750 604 5491",
  FASTPAY: "+964 750 604 5491",
} as const;

export const ACTIVATION_KEY_PRICE = 50000; // IQD

export const PLAN_PRICES: any = {
  IQD: {
    plus: { "1month": 10000, "3months": 25000, "6months": 45000, "1year": 80000 },
    premium: { "1month": 25000, "3months": 65000, "6months": 120000, "1year": 200000 },
    family: { "1month": 50000, "3months": 130000, "6months": 240000, "1year": 400000 },
    business: { "1month": 100000, "3months": 270000, "6months": 500000, "1year": 900000 },
  },
};
