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

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("وشەی نهێنی یەک ناگرنەوە");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "هەڵەیەک ڕوویدا");
      }

      toast.success("بە سەرکەوتوویی تۆمار کرا!");
      router.push("/login");
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
            دروستکردنی هەژماری نوێ
          </CardTitle>
          <CardDescription className="text-center">
            ئێستا دەست بکە بە سەفەری فێربوونت!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ناوی تەواو
              </label>
              <Input
                type="text"
                required
                placeholder="ناوی تەواوت بنووسە"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

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
                ژمارەی مۆبایل (ئارەزوومەندانە)
              </label>
              <Input
                type="tel"
                placeholder="+964 750 000 0000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                ڕۆڵ
              </label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="student">قوتابی</option>
                <option value="teacher">مامۆستا</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                وشەی نهێنی
              </label>
              <Input
                type="password"
                required
                placeholder="کەمتر لە ٦ پیت نەبێت"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                دووپاتکردنەوەی وشەی نهێنی
              </label>
              <Input
                type="password"
                required
                placeholder="وشەی نهێنی دووبارە بنووسە"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "تکایە چاوەڕێ بکە..." : "تۆمار بکە"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            پێشتر هەژمارت هەیە؟{" "}
            <Link href="/login" className="text-purple-600 hover:underline">
              بچۆ ژوورەوە
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
