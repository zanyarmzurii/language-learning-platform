"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "هەڵەیەک ڕوویدا");
      }

      toast.success("بە سەرکەوتوویی چوویتە ژوورەوە!");
      
      // Redirect based on role
      if (data.user.role === "admin" || data.user.role === "owner") {
        router.push("/dashboard/admin");
      } else if (data.user.role === "teacher") {
        router.push("/dashboard/teacher");
      } else {
        router.push("/dashboard/student");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            بچۆ ژوورەوە
          </CardTitle>
          <CardDescription className="text-center">
            بەخێربێیتەوە! درێژە بە سەفەری فێربوونت بدە
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ئیمەیڵ
              </label>
              <Input
                type="email"
                required
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                وشەی نهێنی
              </label>
              <Input
                type="password"
                required
                placeholder="وشەی نهێنیت بنووسە"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "تکایە چاوەڕێ بکە..." : "بچۆ ژوورەوە"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            هەژمارت نییە؟{" "}
            <Link
              href="/register"
              className="text-purple-600 hover:underline"
            >
              تۆمار بکە
            </Link>
          </p>
          <Link
            href="/forgot-password"
            className="text-sm text-purple-600 hover:underline"
          >
            وشەی نهێنیت لەبیر چووە؟
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
