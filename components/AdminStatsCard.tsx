import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

interface AdminStatsCardProps {
  stats: {
    users: {
      total: number;
      students: number;
      teachers: number;
      activeTeachers: number;
    };
    courses: {
      total: number;
      approved: number;
      pending: number;
    };
    payments: {
      total: number;
      pending: number;
      approved: number;
      totalRevenue: number;
    };
    quizzes: number;
  };
}

export default function AdminStatsCard({ stats }: AdminStatsCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.users.total}
            </div>
            <div className="text-sm text-gray-600">کۆی بەکارهێنەران</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.users.students}
            </div>
            <div className="text-sm text-gray-600">قوتابیان</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.users.teachers}
            </div>
            <div className="text-sm text-gray-600">مامۆستایان</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.courses.total}
            </div>
            <div className="text-sm text-gray-600">کۆی خولەکان</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ڕاپۆرتی داهات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.payments.approved}
              </div>
              <div className="text-sm text-gray-600">پارەدانی پەسەندکراو</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.payments.pending}
              </div>
              <div className="text-sm text-gray-600">پارەدانی چاوەڕوان</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.payments.totalRevenue.toLocaleString()} IQD
              </div>
              <div className="text-sm text-gray-600">کۆی داهات</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
