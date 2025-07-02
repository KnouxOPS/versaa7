import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BuilderHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
}

export default function BuilderHero({
  title = "KNOUX VERSA",
  subtitle = "النظام المحلي الكامل للذكاء الاصطناعي",
  description = "30 أداة ذكاء اصطناعي متقدمة تعمل بالكامل على جهازك - بدون إنترنت، بدون رفع بيانات، خصوصية مطلقة",
  heroImage = "https://cdn.builder.io/api/v1/image/assets%2F097d5f110a6844f7bf48358cc02a3156%2F4089c5496d87402ab56438165795fedb?format=webp&width=800",
}: BuilderHeroProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ar">("ar");

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const features = [
    {
      icon: "🛡️",
      title:
        currentLanguage === "ar" ? "100% محلي وآمن" : "100% Local & Secure",
      description:
        currentLanguage === "ar"
          ? "جميع العمليات تتم على جهازك بدون إرسال بيانات"
          : "All processing happens on your device with no data transmission",
    },
    {
      icon: "🚀",
      title: currentLanguage === "ar" ? "30 أداة ذكاء اصطناعي" : "30 AI Tools",
      description:
        currentLanguage === "ar"
          ? "مجموعة شاملة من أدوات تحرير الصور والذكاء الاصطناعي"
          : "Complete suite of image editing and AI transformation tools",
    },
    {
      icon: "⚡",
      title: currentLanguage === "ar" ? "معالجة فورية" : "Instant Processing",
      description:
        currentLanguage === "ar"
          ? "نتائج سريعة بدون انتظار أو اشتراكات"
          : "Fast results without waiting or subscriptions",
    },
    {
      icon: "🎨",
      title: currentLanguage === "ar" ? "حرية كاملة" : "Complete Freedom",
      description:
        currentLanguage === "ar"
          ? "بدون قيود أو رقابة - إبداع بلا حدود"
          : "No restrictions or censorship - unlimited creativity",
    },
  ];

  const aiTools = [
    "Face Swap",
    "Beauty Filter",
    "Age Transform",
    "Gender Swap",
    "Background Remover",
    "Style Transfer",
    "Super Resolution",
    "Object Remover",
    "Cartoonizer",
    "Vintage Filter",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div
          className="absolute top-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center animate-spin-slow">
              <span className="text-xl font-bold">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-xs text-gray-300">The Uncensored AI Nexus</p>
            </div>
          </div>

          <Button
            onClick={toggleLanguage}
            variant="outline"
            className="border-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-300"
          >
            <span className="mr-2">🌐</span>
            {currentLanguage === "en" ? "العربية" : "English"}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30 text-sm px-4 py-2">
                <span className="mr-2">✨</span>
                {currentLanguage === "ar"
                  ? "الجيل الجديد من الذكاء الاصطناعي"
                  : "Next Generation AI"}
              </Badge>

              <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  {subtitle}
                </span>
              </h2>

              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">🚀</span>
                {currentLanguage === "ar"
                  ? "ابدأ الآن مجاناً"
                  : "Start Free Now"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-purple-400/50 hover:bg-purple-400/10 px-8 py-4 text-lg rounded-full transition-all duration-300"
              >
                <span className="mr-2">📺</span>
                {currentLanguage === "ar"
                  ? "شاهد العرض التوضيحي"
                  : "Watch Demo"}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">30+</div>
                <div className="text-sm text-gray-400">
                  {currentLanguage === "ar" ? "أداة ذكاء اصطناعي" : "AI Tools"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-gray-400">
                  {currentLanguage === "ar"
                    ? "معالجة محلية"
                    : "Local Processing"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">0</div>
                <div className="text-sm text-gray-400">
                  {currentLanguage === "ar" ? "رسوم شهرية" : "Monthly Fees"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src={heroImage}
                alt="KNOUX VERSA AI Interface"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-bounce"></div>
            <div
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              {currentLanguage === "ar"
                ? "لماذا KNOUX VERSA؟"
                : "Why KNOUX VERSA?"}
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {currentLanguage === "ar"
                ? "الحل الوحيد للذكاء الاصطناعي الذي يحترم خصوصيتك ويمنحك حرية كاملة"
                : "The only AI solution that respects your privacy and gives you complete freedom"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-md border-white/10 p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Tools Showcase */}
        <div className="mt-32 space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              {currentLanguage === "ar"
                ? "أدوات الذكاء الاصطناعي المتوفرة"
                : "Available AI Tools"}
            </h3>
            <p className="text-gray-300">
              {currentLanguage === "ar"
                ? "مجموعة شاملة من الأدوات المتطورة لجميع احتياجاتك الإبداعية"
                : "Complete suite of advanced tools for all your creative needs"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {aiTools.map((tool, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30 text-cyan-300 px-4 py-2 text-sm hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer"
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-32 text-center space-y-8">
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-cyan-400/30 p-12 backdrop-blur-md">
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-white">
                {currentLanguage === "ar" ? "جاهز للبدء؟" : "Ready to Start?"}
              </h3>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {currentLanguage === "ar"
                  ? "انضم إلى آلاف المستخدمين الذين يستمتعون بالحرية الكاملة في الإبداع"
                  : "Join thousands of users enjoying complete creative freedom"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-2">⭐</span>
                  {currentLanguage === "ar"
                    ? "حمّل التطبيق مجاناً"
                    : "Download Free App"}
                </Button>
              </div>

              <div className="text-sm text-gray-400 space-y-2">
                <p>
                  ✨{" "}
                  {currentLanguage === "ar"
                    ? "مجاني تماماً - بدون اشتراكات"
                    : "Completely free - no subscriptions"}
                </p>
                <p>
                  🔒{" "}
                  {currentLanguage === "ar"
                    ? "خصوصية مطلقة - بياناتك آمنة"
                    : "Complete privacy - your data is safe"}
                </p>
                <p>
                  🚀{" "}
                  {currentLanguage === "ar"
                    ? "بدء فوري - لا يحتاج تسجيل"
                    : "Instant start - no registration needed"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-32 bg-black/20 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-4">
            <p className="text-gray-400">
              {currentLanguage === "ar"
                ? "تم التطوير بإبداع بواسطة"
                : "Crafted with creativity by"}{" "}
              <span className="text-cyan-400 font-bold">Sadek Elgazar</span> |
              © 2025 KNOUX VERSA
            </p>
            <p className="text-sm text-gray-500">
              {currentLanguage === "ar"
                ? "ادعم المطور على"
                : "Support the creator on"}{" "}
              <a
                href="https://buymeacoffee.com/knoux"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                BuyMeACoffee
              </a>{" "}
              ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
