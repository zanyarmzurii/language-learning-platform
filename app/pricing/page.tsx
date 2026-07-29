import Navbar from "@/components/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getPlanPrice } from "@/lib/utils";

const plans = [
  {
    name: "خۆرایی",
    type: "free",
    price: "٠",
    features: [
      "دەستگەیشتن بە ١٠٠٠ وشە",
      "٥ خولی خۆرایی",
      "کویزی سادە",
      "پشتگیری تێکست",
    ],
    color: "gray",
  },
  {
    name: "پلاس",
    type: "plus",
    price: "١٠,٠٠٠",
    period: "مانگانە",
    features: [
      "دەستگەیشتن بە ١٠,٠٠٠ وشە",
      "٢٠ خول",
      "کویزی پێشکەوتوو",
      "پشتگیری دەنگ",
      "چات لەگەڵ مامۆستا",
    ],
    color: "blue",
  },
  {
    name: "پریمیەم",
    type: "premium",
    price: "٢٥,٠٠٠",
    period: "مانگانە",
    features: [
      "دەستگەیشتن بە هەموو وشەکان (٧٠٠,٠٠٠+)",
      "خولی نەسنووردار",
      "زیرەکی دەستکرد",
      "کویزی زیرەک",
      "ناسینەوەی دەنگ",
      "پشتگیری ٢٤/٧",
    ],
    color: "purple",
    popular: true,
  },
  {
    name: "خێزانی",
    type: "family",
    price: "٥٠,٠٠٠",
    period: "مانگانە",
    features: [
      "هەموو تایبەتمەندییەکانی پریمیەم",
      "تا ٦ ئەندام",
      "پلانی خێزانی تایبەت",
      "داشبۆردی باوان",
      "ڕاپۆرتی پێشکەوتن",
    ],
    color: "green",
  },
  {
    name: "بزنس",
    type: "business",
    price: "١٠٠,٠٠٠",
    period: "مانگانە",
    features: [
      "هەموو تایبەتمەندییەکانی خێزانی",
      "تا ٥٠ بەکارهێنەر",
      "ئەدمینی تایبەت",
      "API دەستگەیشتن",
      "مارکەی تایبەت",
      "پشتگیری تایبەت",
    ],
    color: "orange",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            پلانەکانی نرخ
          </h1>
          <p className="text-xl text-gray-600">
            پلانێک هەڵبژێرە کە گونجاو بێت بۆ تۆ
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.type}
              className={`relative ${
                plan.popular ? "border-purple-500 border-2 shadow-xl" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
                    باشترین هەڵبژاردە
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-center">
                  <span className="text-3xl font-bold text-purple-600">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✅</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link
                  href={
                    plan.type === "free"
                      ? "/register"
                      : `/payment?plan=${plan.type}`
                  }
                  className="w-full"
                >
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.type === "free" ? "دەستپێبکە" : "هەڵبژاردن"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FIB & FastPay Info */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold mb-4">
            شێوازەکانی پارەدان
          </h2>
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🏦</div>
              <div className="font-semibold">FIB</div>
              <div className="text-sm text-gray-600 mt-1">
                +964 750 604 5491
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <div className="font-semibold">FastPay</div>
              <div className="text-sm text-gray-600 mt-1">
                +964 750 604 5491
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
