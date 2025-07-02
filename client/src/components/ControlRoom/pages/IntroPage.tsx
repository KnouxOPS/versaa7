import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useControlRoom,
  getKnouxPersonality,
} from "../context/ControlRoomContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const KnouxQuotes = {
  ar: [
    "مرحباً بك في المستقبل، حيث الإبداع يلتقي بالذكاء الاصطناعي",
    "يلا نشتغل! وقت نعمل سحر تقني 🔥",
    "هنا حيث تبدأ رحلة التحول الرقمي الحقيقية",
    "في كنوكس، نحول الخيال إلى واقع ملموس",
  ],
  en: [
    "Welcome to the future, where creativity meets artificial intelligence",
    "Let's get to work! Time to create some tech magic 🔥",
    "This is where your digital transformation journey truly begins",
    "At Knoux, we transform imagination into tangible reality",
  ],
};

export const IntroPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || "en";
  const { state, dispatch } = useControlRoom();

  const [currentQuote, setCurrentQuote] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const personality = getKnouxPersonality(state.settings.knouxFlavor);
  const quotes = KnouxQuotes[lang];

  // Auto-rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Show content after initial animation
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
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
    <div className="h-full p-6 overflow-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        {/* Logo with Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-2 animate-pulse-glow">
              <div className="w-full h-full bg-[#0F0F12] rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-cyan-400 animate-neon-text">
                  K
                </span>
              </div>
            </div>
            {/* Orbital rings */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-32 h-32 rounded-full border border-cyan-400/30 absolute -top-4 -left-4"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          KNOUX CONTROL ROOM™
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          {lang === "ar" ? "مركز التحكم الذكي" : "Intelligent Command Center"}
        </p>

        {/* Rotating Quote */}
        <div className="glass-strong rounded-2xl p-6 max-w-3xl mx-auto mb-8">
          <div className="text-xl font-medium text-cyan-300 animate-fade-in">
            "{quotes[currentQuote]}"
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      {showContent && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Advanced AI Card */}
          <Card className="glass-strong p-6 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                <i className="fas fa-brain text-3xl text-cyan-400"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {lang === "ar" ? "ذكاء اصطناعي متقدم" : "Advanced AI"}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === "ar"
                  ? "نظام ذكي يتعلم ويتكيف مع تفضيلاتك"
                  : "Smart system that learns and adapts to your preferences"}
              </p>
            </div>
          </Card>

          {/* Luxury Design Card */}
          <Card className="glass-strong p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-500/20 flex items-center justify-center">
                <i className="fas fa-gem text-3xl text-purple-400"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {lang === "ar" ? "تصميم فاخر" : "Luxury Design"}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === "ar"
                  ? "واجهة زجاجية مع تأثيرات نيون تفاعلية"
                  : "Glassmorphism interface with interactive neon effects"}
              </p>
            </div>
          </Card>

          {/* Turbo Performance Card */}
          <Card className="glass-strong p-6 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 flex items-center justify-center">
                <i className="fas fa-rocket text-3xl text-green-400"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {lang === "ar" ? "أداء توربو" : "Turbo Performance"}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === "ar"
                  ? "تحكم كامل في الأداء والموارد"
                  : "Full control over performance and resources"}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Action Section */}
      <div className="text-center">
        <Button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-3 text-lg font-semibold rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] transition-all duration-300"
        >
          <i className="fas fa-rocket mr-3"></i>
          {lang === "ar" ? "ابدأ الرحلة" : "Start Journey"}
        </Button>
      </div>

      {/* Bottom Info */}
      <div className="mt-16 text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30">
            Abu Ritaj
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
            KNOUX CONTROL ROOM v2.0.0
          </Badge>
        </div>
        <p className="text-gray-500 text-sm">
          {lang === "ar"
            ? "• صُنع بشغف في أبو ظبي • 🇦🇪 UAE"
            : "• Crafted with passion in Abu Dhabi • 🇦🇪 UAE"}
        </p>
        <p className="text-gray-600 text-xs mt-2">
          © 2025 Sadek Elgazar - Where imagination meets AI
        </p>
      </div>
    </div>
  );
};
