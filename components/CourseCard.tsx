import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    language: string;
    level: string;
    price: number;
    currency: string;
    thumbnail?: string;
    totalStudents: number;
    rating: number;
    teacherId: {
      name: string;
      avatar?: string;
    };
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const levelLabels: any = {
    beginner: "سەرەتایی",
    intermediate: "ناوەند",
    advanced: "پێشکەوتوو",
  };

  return (
    <Card className="hover:shadow-lg transition">
      <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 rounded-t-lg flex items-center justify-center">
        <span className="text-6xl">📚</span>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {course.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>🗣️ {course.language}</span>
          <span>📊 {levelLabels[course.level]}</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <span>👨‍🎓 {course.totalStudents} قوتابی</span>
          <span>⭐ {course.rating.toFixed(1)}</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <span>👨‍🏫 {course.teacherId.name}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-2xl font-bold text-purple-600">
          {course.price.toLocaleString()} {course.currency}
        </span>
        <Link href={`/courses/${course._id}`}>
          <Button>بینینی خول</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
