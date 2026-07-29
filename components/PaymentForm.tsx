"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { toast } from "sonner";

interface PaymentFormProps {
  type: "course" | "plan";
  itemId?: string;
  planType?: string;
  duration?: string;
  amount: number;
  onSuccess?: () => void;
}

export default function PaymentForm({
  type,
  itemId,
  planType,
  duration,
  amount,
  onSuccess,
}: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"FIB" | "FastPay" | null>(null);
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    transactionId: "",
  });
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>("");

  const handlePayment = async () => {
    if (!method) {
      toast.error("تکایە شێوازی پارەدان هەڵبژێرە");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        method === "FIB" ? "/api/payments/fib" : "/api/payments/fastpay";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          planType: type === "plan" ? planType : undefined,
          duration: type === "plan" ? duration : undefined,
          courseId: type === "course" ? itemId : undefined,
          senderName: formData.senderName,
          senderPhone: formData.senderPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setPaymentId(data.payment.id);
      setInstructions(data.payment.instructions);
      toast.success("زانیاری تۆمار کرا. ئێستا پارەکە بنێرە");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!paymentId || !formData.transactionId) {
      toast.error("ژمارەی مامەڵەکە پێویستە");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          transactionId: formData.transactionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("ژمارەی مامەڵەکە نێردرا. چاوەڕێی پشتڕاستکردنەوە بکە");
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>پارەدان</CardTitle>
        <CardDescription>
          بڕی پارە: {amount.toLocaleString()} دینار
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Choose Payment Method */}
        {!method ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMethod("FIB")}
              className="p-6 border-2 rounded-lg hover:border-purple-500 transition text-center"
            >
              <div className="text-4xl mb-2">🏦</div>
              <div className="font-semibold">FIB</div>
              <div className="text-sm text-gray-500">First Iraqi Bank</div>
            </button>
            <button
              onClick={() => setMethod("FastPay")}
              className="p-6 border-2 rounded-lg hover:border-purple-500 transition text-center"
            >
              <div className="text-4xl mb-2">📱</div>
              <div className="font-semibold">FastPay</div>
              <div className="text-sm text-gray-500">Mobile Wallet</div>
            </button>
          </div>
        ) : !paymentId ? (
          /* Sender Info */
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-lg font-semibold">
                شێوازی پارەدان: {method}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                ناوی تەواوی نێرەر
              </label>
              <Input
                required
                placeholder="ناوی تەواوت بنووسە"
                value={formData.senderName}
                onChange={(e) =>
                  setFormData({ ...formData, senderName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                ژمارەی مۆبایلی نێرەر
              </label>
              <Input
                required
                placeholder="+964 750 000 0000"
                value={formData.senderPhone}
                onChange={(e) =>
                  setFormData({ ...formData, senderPhone: e.target.value })
                }
              />
            </div>
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full"
            >
              {loading ? "تکایە چاوەڕێ بکە..." : "بەردەوام بە"}
            </Button>
          </div>
        ) : (
          /* Instructions */
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-sans">
                {instructions}
              </pre>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                ژمارەی مامەڵەکە (Transaction ID)
              </label>
              <Input
                required
                placeholder="ژمارەی مامەڵەکە بنووسە"
                value={formData.transactionId}
                onChange={(e) =>
                  setFormData({ ...formData, transactionId: e.target.value })
                }
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={loading}
              className="w-full"
            >
              {loading ? "تکایە چاوەڕێ بکە..." : "ناردنی ژمارەی مامەڵەکە"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
