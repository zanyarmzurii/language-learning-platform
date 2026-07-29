"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/Button";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await fetch("/api/courses?teacherId=me");
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("Fetch courses error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: "مامۆستا", role: "teacher" }} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">خولەکانم</h1>
          <Link href="/dashboard/teacher/create-course">
            <Button size="lg">+ خولی نوێ</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⏳</div>
            <p>چاوەڕێ بکە...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-lg text-gray-600">هێشتا هیچ خولێکت دروست نەکردووە</p>
            <Link href="/dashboard/teacher/create-course">
              <Button className="mt-4">یەکەم خول دروست بکە</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
