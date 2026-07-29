"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (res.ok) {
        setProfile(data.profile);
        setFormData({
          name: data.profile.name,
          phone: data.profile.phone || "",
          currentPassword: "",
          newPassword: "",
        });
      }
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("پرۆفایل نوێ کرایەوە");
        setEditMode(false);
        fetchProfile();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ چاوەڕێ بکە...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: profile?.name, role: profile?.role }} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>پرۆفایلی بەکارهێنەر</CardTitle>
          </CardHeader>
          <CardContent>
            {!editMode ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">
                      {profile?.avatar || "👤"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">ناو</label>
                  <p className="text-lg font-semibold">{profile?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">ئیمەیڵ</label>
                  <p className="text-lg">{profile?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">ڕۆڵ</label>
                  <p className="text-lg">
                    {profile?.role === "student"
                      ? "قوتابی"
                      : profile?.role === "teacher"
                      ? "مامۆستا"
                      : profile?.role === "admin"
                      ? "ئەدمین"
                      : "خاوەن"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">پلان</label>
                  <p className="text-lg font-semibold text-purple-600">
                    {profile?.planType}
                  </p>
                </div>
                {profile?.phone && (
                  <div>
                    <label className="text-sm text-gray-600">مۆبایل</label>
                    <p className="text-lg">{profile?.phone}</p>
                  </div>
                )}
                <Button onClick={() => setEditMode(true)} className="w-full">
                  دەستکاری پرۆفایل
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ناو
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    مۆبایل
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    وشەی نهێنی ئێستا
                  </label>
                  <Input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    وشەی نهێنی نوێ
                  </label>
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    پاشەکەوت
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    ڕەتکردنەوە
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
