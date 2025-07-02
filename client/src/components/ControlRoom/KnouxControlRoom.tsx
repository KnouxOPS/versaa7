import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Control Room Sub-Components
import { IntroPage } from "./pages/IntroPage";
import { SettingsDashboard } from "./pages/SettingsDashboard";
import { LivePreviewPanel } from "./pages/LivePreviewPanel";
import { ComponentsLibrary } from "./pages/ComponentsLibrary";
import { DesignTokens } from "./pages/DesignTokens";

// Control Room Context
import {
  ControlRoomProvider,
  useControlRoom,
} from "./context/ControlRoomContext";

interface KnouxControlRoomProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const ControlRoomTabs = [
  { id: "intro", label: "مقدمة", labelEn: "Intro", icon: "fa-rocket" },
  { id: "settings", label: "الإعدادات", labelEn: "Settings", icon: "fa-cogs" },
  { id: "preview", label: "المعاينة", labelEn: "Preview", icon: "fa-eye" },
  {
    id: "components",
    label: "المكونات",
    labelEn: "Components",
    icon: "fa-cube",
  },
  { id: "tokens", label: "التصميم", labelEn: "Design", icon: "fa-palette" },
];

const ControlRoomContent: React.FC<KnouxControlRoomProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const lang = language || "en";
  const { state, dispatch } = useControlRoom();

  const [activeTab, setActiveTab] = useState("intro");
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize Control Room on mount
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      dispatch({ type: "INITIALIZE_ROOM" });

      // Welcome animation
      setTimeout(() => setIsAnimating(false), 2000);
    }
  }, [isOpen, dispatch]);

  // Handle tab switching with smooth animations
  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTab) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveTab(tabId);
        setIsAnimating(false);
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Control Room Container */}
      <Card className="control-room-main h-[90vh] w-[95vw] max-w-[1400px] overflow-hidden bg-gradient-to-br from-[#0F0F12]/95 via-[#1a1a2e]/90 to-[#0F0F12]/95 border-2 border-cyan-400/30 shadow-[0_0_50px_rgba(0,255,255,0.3)]">
        {/* Header */}
        <div className="control-room-header flex items-center justify-between p-6 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-400/5 to-purple-600/5">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 p-1 animate-pulse-glow">
                <div className="w-full h-full bg-[#0F0F12] rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-cyan-400 animate-neon-text">
                    K
                  </span>
                </div>
              </div>
              {/* Orbital rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="w-16 h-16 rounded-full border border-cyan-400/30 absolute -top-2 -left-2"></div>
              </div>
              <div className="absolute inset-0 animate-spin-reverse">
                <div className="w-20 h-20 rounded-full border border-purple-400/20 absolute -top-4 -left-4"></div>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shift">
                KNOUX CONTROL ROOM™
              </h1>
              <p className="text-sm text-gray-400">
                {lang === "ar"
                  ? "مركز التحكم الذكي"
                  : "Intelligent Command Center"}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            {/* AI Status */}
            <Badge className="bg-green-500/20 text-green-400 border-green-400/30 animate-pulse">
              <i className="fas fa-brain mr-2"></i>
              {lang === "ar" ? "نشط" : "AI Active"}
            </Badge>

            {/* Language */}
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
              <i className="fas fa-globe mr-2"></i>
              {lang === "ar" ? "عربي" : "English"}
            </Badge>

            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400/50"
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100%-88px)]">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r border-cyan-400/20 bg-gradient-to-b from-[#222227]/80 to-[#0F0F12]/80">
            <ScrollArea className="h-full p-4">
              <nav className="space-y-2">
                {ControlRoomTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                        : "hover:bg-white/5 hover:border-cyan-400/20 border border-transparent"
                    }`}
                  >
                    <i
                      className={`fas ${tab.icon} ${
                        activeTab === tab.id
                          ? "text-cyan-400"
                          : "text-gray-400 group-hover:text-cyan-300"
                      } transition-colors`}
                    ></i>
                    <span
                      className={`font-medium ${
                        activeTab === tab.id
                          ? "text-white"
                          : "text-gray-300 group-hover:text-white"
                      } transition-colors`}
                    >
                      {lang === "ar" ? tab.label : tab.labelEn}
                    </span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 p-4 border border-purple-400/30 rounded-lg bg-gradient-to-br from-purple-400/10 to-cyan-400/10">
                <h3 className="text-sm font-semibold text-purple-300 mb-3">
                  {lang === "ar" ? "إجراءات سريعة" : "Quick Actions"}
                </h3>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xs"
                    onClick={() =>
                      dispatch({ type: "TRIGGER_VOICE_ASSISTANT" })
                    }
                  >
                    <i className="fas fa-microphone mr-2"></i>
                    {lang === "ar" ? "استدعاء أبو ريتاج" : "Call Abu Ritaj"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 text-xs"
                    onClick={() => dispatch({ type: "TOGGLE_TURBO_MODE" })}
                  >
                    <i className="fas fa-rocket mr-2"></i>
                    {lang === "ar" ? "وضع التوربو" : "Turbo Mode"}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Content Area */}
          <div className="flex-1 relative overflow-hidden">
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                isAnimating
                  ? "opacity-0 transform scale-95"
                  : "opacity-100 transform scale-100"
              }`}
            >
              {activeTab === "intro" && <IntroPage />}
              {activeTab === "settings" && <SettingsDashboard />}
              {activeTab === "preview" && <LivePreviewPanel />}
              {activeTab === "components" && <ComponentsLibrary />}
              {activeTab === "tokens" && <DesignTokens />}
            </div>

            {/* Loading Animation */}
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0F0F12]/80">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
                  <p className="text-cyan-400 animate-pulse">
                    {lang === "ar"
                      ? "تحميل غرفة التحكم..."
                      : "Loading Control Room..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-8 bg-gradient-to-r from-[#0F0F12] to-[#222227] border-t border-cyan-400/20 flex items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-4 text-gray-400">
            <span>CPU: {Math.round(Math.random() * 30 + 20)}%</span>
            <span>RAM: {Math.round(Math.random() * 40 + 40)}%</span>
            <span>GPU: {Math.round(Math.random() * 60 + 20)}%</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <i className="fas fa-circle animate-pulse"></i>
            <span>{lang === "ar" ? "متصل" : "Connected"}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const KnouxControlRoom: React.FC<KnouxControlRoomProps> = (props) => {
  return (
    <ControlRoomProvider>
      <ControlRoomContent {...props} />
    </ControlRoomProvider>
  );
};
