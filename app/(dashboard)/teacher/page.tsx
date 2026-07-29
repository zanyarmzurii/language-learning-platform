import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TeacherDashboard() {
  const user = {
    name: "مامۆستا",
    role: "teacher",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">داشبۆردی مامۆستا</h1>
          <Link href="/teacher/create-course">
            <Button size="lg">
              + دروستکردنی خولی نوێ
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">خولەکانم</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">٠</p>
              <p className="text-gray-600">خولی چالاک</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">قوتابیان</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">٠</p>
              <p className="text-gray-600">کۆی قوتابیان</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">داهات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">٠ IQD</p>
              <p className="text-gray-600">کۆی داهات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">هەڵسەنگاندن</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">٠</p>
              <p className="text-gray-600">تێکڕای ئەستێرەکان</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>خولە چالاکەکانم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-4">📚</p>
                <p>هێشتا هیچ خولێکت دروست نەکردووە</p>
                <Link href="/teacher/create-course">
                  <Button className="mt-4">یەکەم خول دروست بکە</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>دوایین پارەدانەکان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-4">💰</p>
                <p>هێشتا هیچ پارەدانێک نەکراوە</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
