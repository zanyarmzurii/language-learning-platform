import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function StudentDashboard() {
  // This is mock data - will be fetched from API later
  const user = {
    name: "قوتابی",
    role: "student",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">داشبۆردی قوتابی</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">خولەکانم</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">٠</p>
              <p className="text-gray-600">خولی بەردەست</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">پێشکەوتن</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">٠٪</p>
              <p className="text-gray-600">تەواو بووە</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">پلانی ئێستا</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">خۆرایی</p>
              <p className="text-gray-600">پلانی بنەڕەتی</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>خولە بەردەستەکان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-4">📚</p>
                <p>هێشتا هیچ خولێک نەکڕیوە</p>
                <Link href="/courses">
                  <Button className="mt-4">گەڕان بەدوای خولەکان</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>دوایین چالاکییەکان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-4">🎯</p>
                <p>هێشتا هیچ چالاکییەکت نییە</p>
                <p className="text-sm mt-2">
                  دەست بکە بە فێربوون بۆ بینینی چالاکییەکانت!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
