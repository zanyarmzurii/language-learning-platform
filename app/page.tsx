import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-purple-600">
                🗣️ KurdiLearn
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg transition"
              >
                بچۆ ژوورەوە
              </Link>
              <Link
                href="/register"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                تۆمار بکە
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            فێربوونی زمان بە شێوەی{" "}
            <span className="text-purple-600">زیرەک و ئاسان</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            پلاتفۆرمی فێربوونی زمان بە بەکارهێنانی دوایین تەکنەلۆژیای
            زیرەکی دەستکرد. زیاتر لە ٧٠٠,٠٠٠ وشە و ملیۆنان ڕستە بۆ فێربوون!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition transform hover:scale-105"
            >
              دەست بکە بە فێربوون - خۆرایی
            </Link>
            <Link
              href="#features"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition"
            >
              زیاتر بزانە
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            بۆچی KurdiLearn؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "🤖 زیرەکی دەستکرد",
                desc: "کویز و ڕاهێنانی خۆکارانە بەپێی ئاستی خۆت",
              },
              {
                title: "👨‍🏫 مامۆستایانی پسپۆڕ",
                desc: "خولەکانی ڤیدیۆیی لەگەڵ باشترین مامۆستایان",
              },
              {
                title: "📱 هەموو شوێنێک",
                desc: "لە مۆبایل و کۆمپیوتەر و تابلێت فێربە",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{feature.title.split(" ")[0]}</div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title.split(" ").slice(1).join(" ")}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg">
            © 2024 KurdiLearn - هەموو مافەکان پارێزراون
          </p>
        </div>
      </footer>
    </div>
  );
}
