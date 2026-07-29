"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";

interface NavbarProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-600">
              🗣️ KurdiLearn
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-700">
                  بەخێربێیت، {user.name}
                </span>
                <Link href={`/dashboard/${user.role}`}>
                  <Button variant="outline" size="sm">
                    داشبۆرد
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm">
                  چوونەدەرەوە
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">بچۆ ژوورەوە</Button>
                </Link>
                <Link href="/register">
                  <Button>تۆمار بکە</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
