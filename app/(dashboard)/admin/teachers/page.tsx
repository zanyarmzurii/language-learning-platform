"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { toast } from "sonner";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teacher/approve");
      const data = await res.json();
      if (res.ok) {
        setTeachers(data.teachers);
      }
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacherId: string) => {
    try {
      const res = await fetch("/api/teacher/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId,
          action: "approve",
          activationKey: `TEACHER-${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        // Show activation key
        if (data.teacher?.activationKey) {
          toast.success(`Activation Key: ${data.teacher.activationKey}`);
        }
        fetchTeachers();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا");
    }
  };

  const handleReject = async (teacherId: string) => {
    try {
      const res = await fetch("/api/teacher/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, action: "reject" }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchTeachers();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: "ئەدمین", role: "admin" }} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">بەڕێوەبردنی مامۆستایان</h1>

        {loading ? (
          <div className="text-center py-20">⏳ چاوەڕێ بکە...</div>
        ) : teachers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-lg text-gray-600">
                هیچ مامۆستایەکی چاوەڕوان نییە
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <Card key={teacher._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{teacher.name}</h3>
                      <p className="text-gray-600">{teacher.email}</p>
                      <p className="text-sm text-gray-500">
                        بەروار:{" "}
                        {new Date(teacher.createdAt).toLocaleDateString("ckb")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(teacher._id)}
                        variant="default"
                      >
                        پەسەندکردن
                      </Button>
                      <Button
                        onClick={() => handleReject(teacher._id)}
                        variant="destructive"
                      >
                        ڕەتکردنەوە
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
