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

export default function TeacherActivationForm() {
  const router = useRouter();
  const [activationKey, setActivationKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activationKey.trim()) {
      toast.error("کلیلی چالاککردنەوە پێویستە");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/teacher/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activationKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("هەژماری مامۆستاکەت چالاک کرا! 🎉");
      router.push("/dashboard/teacher");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>چالاککردنەوەی هەژماری مامۆستا</CardTitle>
        <CardDescription>
          بۆ چالاککردنی هەژماری مامۆستا، کلیلی چالاککردنەوە داخڵ بکە
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleActivate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              کلیلی چالاککردنەوە
            </label>
            <Input
              required
              placeholder="کلیلەکەت بنووسە..."
              value={activationKey}
              onChange={(e) => setActivationKey(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "چالاک دەکرێت..." : "چالاککردنەوە"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold mb-2">
            کلیلی چالاککردنەوەت نییە؟
          </p>
          <p className="text-sm text-gray-600 mb-3">
            دەتوانیت کلیلی چالاککردنەوە بکڕیت بە ناردنی پارە بۆ:
          </p>
          <div className="text-sm space-y-1">
            <p>🏦 FIB: +964 750 604 5491</p>
            <p>📱 FastPay: +964 750 604 5491</p>
            <p className="font-semibold mt-2">نرخ: ٥٠,٠٠٠ دینار</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
