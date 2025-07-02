import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useControlRoom,
  getKnouxPersonality,
} from "../context/ControlRoomContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const IntroAnimations = [
  "animate-fade-in-up",
  "animate-slide-in-right",
  "animate-bounce-in",
  "animate-zoom-in",
];

const KnouxQuotes = {
  ar: [
    "مرحباً بك في المستقبل، حيث الإبداع يلتقي بالذكاء الاصطناعي",
    "هنا حيث تبدأ رحلة التحول الرقمي الحقيقية",
    "استعد لتجربة تفوق كل توقعاتك مع تقنيات كنوكس المتقدمة",
    "في كنوكس، ن��ول الخيال إلى واقع ملموس",
  ],
  en: [
    "Welcome to the future, where creativity meets artificial intelligence",
    "This is where your digital transformation journey truly begins",
    "Prepare for an experience that exceeds all expectations with advanced Knoux tech",
    "At Knoux, we transform imagination into tangible reality",
  ],
};

export const IntroPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || "en";
  const { state, dispatch } = useControlRoom();

  const [currentQuote, setCurrentQuote] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  const personality = getKnouxPersonality(state.settings.knouxFlavor);
  const quotes = KnouxQuotes[lang];

  // Auto-rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
      setAnimationClass(
        IntroAnimations[Math.floor(Math.random() * IntroAnimations.length)],
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  // Show features after initial animation
  useEffect(() => {
    const timer = setTimeout(() => setShowFeatures(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    dispatch({
      type: "ADD_NOTIFICATION",
      notification: {
        type: "success",
        message:
          lang === "ar"
            ? "أهلاً بك في غرفة التحكم!"
            : "Welcome to the Control Room!",
      },
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-purple-400/5 to-blue-400/5"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center space-y-8 relative z-10 max-w-6xl w-full">
        {/* Hero Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            {/* Main Logo */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 animate-pulse-glow">
              <div className="w-full h-full bg-[#0F0F12] rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold text-cyan-400 animate-neon-text">
                  K
                </span>
              </div>
            </div>

            {/* Orbital Rings */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-40 h-40 rounded-full border-2 border-cyan-400/20 absolute -top-4 -left-4"></div>
            </div>
            <div className="absolute inset-0 animate-spin-reverse">
              <div className="w-48 h-48 rounded-full border border-purple-400/15 absolute -top-8 -left-8"></div>
            </div>

            {/* Energy Pulses */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-32 h-32 rounded-full bg-cyan-400/10"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shift">
            KNOUX CONTROL ROOM™
          </h1>
          <p className="text-2xl text-gray-300 font-light">
            {lang === "ar" ? "مركز التحكم الذكي" : "Intelligent Command Center"}
          </p>
        </div>

        {/* Dynamic Quote */}
        <Card className="glass-strong border-cyan-400/30 p-6 max-w-2xl mx-auto">
          <blockquote
            className={`text-lg text-cyan-100 italic ${animationClass}`}
          >
            "{quotes[currentQuote]}"
          </blockquote>
          <div className="flex justify-center mt-4 space-x-2">
            {quotes.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentQuote ? "bg-cyan-400" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Personality Badge */}
        <div className="flex justify-center">
          <Badge
            className="text-lg px-6 py-2"
            style={{
              backgroundColor: `${personality.colors[0]}20`,
              borderColor: `${personality.colors[0]}50`,
              color: personality.colors[0],
            }}
          >
            <i className="fas fa-robot mr-2"></i>
            {personality.greeting}
          </Badge>
        </div>

        {/* Features Grid */}
        {showFeatures && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in-up">
            <Card className="glass-light border-green-400/30 p-6 hover:border-green-400/50 transition-all duration-300 group">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fas fa-brain text-green-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-green-400">
                  {lang === "ar" ? "ذكاء متقدم" : "Advanced AI"}
                </h3>
                <p className="text-sm text-gray-300">
                  {lang === "ar"
                    ? "نظام ذكي يتعلم من تفضيلاتك ويتكيف معها"
                    : "Smart system that learns and adapts to your preferences"}
                </p>
              </div>
            </Card>

            <Card className="glass-light border-blue-400/30 p-6 hover:border-blue-400/50 transition-all duration-300 group">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fas fa-palette text-blue-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-blue-400">
                  {lang === "ar" ? "تصميم فخم" : "Luxury Design"}
                </h3>
                <p className="text-sm text-gray-300">
                  {lang === "ar"
                    ? "واجهة زجاجية بتأثيرات نيون تفاعلية"
                    : "Glassmorphism interface with interactive neon effects"}
                </p>
              </div>
            </Card>

            <Card className="glass-light border-purple-400/30 p-6 hover:border-purple-400/50 transition-all duration-300 group">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-purple-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fas fa-rocket text-purple-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-purple-400">
                  {lang === "ar" ? "أداء خارق" : "Turbo Performance"}
                </h3>
                <p className="text-sm text-gray-300">
                  {lang === "ar"
                    ? "تحكم كامل في الأداء والموارد"
                    : "Full control over performance and resources"}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300"
          >
            <i className="fas fa-rocket mr-2"></i>
            {lang === "ar" ? "ابدأ الرحلة" : "Start Journey"}
          </Button>

          <Button
            onClick={() => dispatch({ type: "TRIGGER_VOICE_ASSISTANT" })}
            variant="outline"
            size="lg"
            className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400/50 px-8 py-3 rounded-lg transition-all duration-300"
          >
            <i className="fas fa-microphone mr-2"></i>
            {lang === "ar" ? "أبو ريتاج" : "Abu Ritaj"}
          </Button>
        </div>

        {/* Version Info */}
        <div className="mt-12 flex flex-col items-center space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>KNOUX CONTROL ROOM v2.0.0</span>
            <span>•</span>
            <span>
              {lang === "ar"
                ? "صنع بإبداع في أبوظبي"
                : "Crafted with passion in Abu Dhabi"}
            </span>
            <span>•</span>
            <span>🇦🇪 UAE</span>
          </div>
          <p className="text-cyan-400/60">
            © 2025 Sadek Elgazar -{" "}
            {lang === "ar"
              ? "حيث يلتقي الخيال بالذكاء الاصطناعي"
              : "Where imagination meets AI"}
          </p>
        </div>
      </div>
    </div>
  );
};
