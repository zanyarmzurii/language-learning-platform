import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "IQD"): string {
  return new Intl.NumberFormat("ar-IQ", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ckb", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getPlanPrice(
  plan: string,
  duration: string,
  currency: string = "IQD"
): number {
  const prices: any = {
    IQD: {
      plus: { "1month": 10000, "3months": 25000, "6months": 45000, "1year": 80000 },
      premium: { "1month": 25000, "3months": 65000, "6months": 120000, "1year": 200000 },
      family: { "1month": 50000, "3months": 130000, "6months": 240000, "1year": 400000 },
      business: { "1month": 100000, "3months": 270000, "6months": 500000, "1year": 900000 },
    },
    USD: {
      plus: { "1month": 5, "3months": 12, "6months": 22, "1year": 40 },
      premium: { "1month": 12, "3months": 30, "6months": 55, "1year": 100 },
      family: { "1month": 25, "3months": 65, "6months": 120, "1year": 200 },
      business: { "1month": 50, "3months": 135, "6months": 250, "1year": 450 },
    },
  };

  return prices[currency]?.[plan]?.[duration] || 0;
}
