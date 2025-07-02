import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useControlRoom, getSettingValue } from "../context/ControlRoomContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const LivePreviewPanel: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || "en";
  const { state } = useControlRoom();

  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [showGrid, setShowGrid] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get current effective settings
  const glowIntensity = getSettingValue(state.settings, "glowIntensity", 100);
  const glassOpacity = getSettingValue(state.settings, "glassOpacity", 100);
  const animations = getSettingValue(state.settings, "animations", true);
  const shadows = getSettingValue(state.settings, "shadows", true);

  const deviceSizes = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "768px", height: "1024px" },
    mobile: { width: "375px", height: "667px" },
  };

  return (
    <div className="h-full flex">
      {/* Control Panel */}
      <div className="w-80 border-r border-gray-700/50 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === "ar" ? "المعاينة المباشرة" : "Live Preview"}
            </h2>
            <p className="text-gray-400 text-sm">
              {lang === "ar"
                ? "شاهد التغييرات على الواجهة في الوقت الفعلي"
                : "See changes applied to the interface in real-time"}
            </p>
          </div>

          {/* Device Size Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">
              {lang === "ar" ? "حجم الجهاز" : "Device Size"}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(["desktop", "tablet", "mobile"] as const).map((size) => (
                <Button
                  key={size}
                  onClick={() => setPreviewMode(size)}
                  variant={previewMode === size ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    previewMode === size
                      ? "bg-cyan-500 hover:bg-cyan-600"
                      : "border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <i
                    className={`fas ${size === "desktop" ? "fa-desktop" : size === "tablet" ? "fa-tablet-alt" : "fa-mobile-alt"} mr-1`}
                  ></i>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid Toggle */}
          <div className="mb-6">
            <Button
              onClick={() => setShowGrid(!showGrid)}
              variant="outline"
              size="sm"
              className={`w-full ${showGrid ? "bg-blue-500/20 border-blue-400/50" : "border-gray-600"}`}
            >
              <i className="fas fa-th mr-2"></i>
              {showGrid ? "Hide Grid" : "Show Grid"}
            </Button>
          </div>

          {/* Live Settings Display */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">
              {lang === "ar" ? "الإعدادات الحالية" : "Current Settings"}
            </h3>

            <div className="glass-strong p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Glow:</span>
                <span className="text-cyan-400">{glowIntensity}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Glass:</span>
                <span className="text-purple-400">{glassOpacity}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Animations:</span>
                <span
                  className={animations ? "text-green-400" : "text-red-400"}
                >
                  {animations ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Shadows:</span>
                <span className={shadows ? "text-green-400" : "text-red-400"}>
                  {shadows ? "ON" : "OFF"}
                </span>
              </div>
            </div>

            {/* Preview Info */}
            <div className="glass-strong p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Resolution:</span>
                <span className="text-white">
                  {previewMode === "desktop"
                    ? "1920×1080"
                    : previewMode === "tablet"
                      ? "768×1024"
                      : "375×667"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Last Updated:</span>
                <span className="text-white">{time.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-6 bg-gradient-to-br from-gray-900/30 to-gray-800/30">
        <div className="h-full flex items-center justify-center">
          <div
            className="relative transition-all duration-500 rounded-lg overflow-hidden"
            style={{
              width: deviceSizes[previewMode].width,
              height: deviceSizes[previewMode].height,
              maxWidth: "100%",
              maxHeight: "100%",
              transform: previewMode !== "desktop" ? "scale(0.8)" : "scale(1)",
            }}
          >
            {/* Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none z-10">
                <div
                  className="w-full h-full opacity-20"
                  style={{
                    backgroundImage: `
                    linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
                  `,
                    backgroundSize: "20px 20px",
                  }}
                ></div>
              </div>
            )}

            {/* Preview Content */}
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, rgba(15,15,18,${glassOpacity / 100}) 0%, rgba(34,34,39,${glassOpacity / 100}) 50%, rgba(15,15,18,${glassOpacity / 100}) 100%)`,
                backdropFilter: `blur(${glassOpacity / 8}px)`,
                boxShadow: shadows
                  ? `0 0 ${glowIntensity / 2}px rgba(0,255,255,${glowIntensity / 200})`
                  : "none",
              }}
            >
              {/* Header */}
              <div className="p-4 border-b border-cyan-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 p-0.5"
                      style={{
                        boxShadow: `0 0 ${glowIntensity / 4}px rgba(0,255,255,${glowIntensity / 100})`,
                        animation: animations ? "pulse 2s infinite" : "none",
                      }}
                    >
                      <div className="w-full h-full bg-[#0F0F12] rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-cyan-400">
                          K
                        </span>
                      </div>
                    </div>
                    <span className="text-white font-semibold">
                      Preview Interface
                    </span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30 animate-pulse">
                    Live
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Sample Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    className="p-4 border-cyan-400/30 transition-all duration-300 hover:border-cyan-400/50"
                    style={{
                      background: `rgba(34,34,39,${glassOpacity / 150})`,
                      backdropFilter: `blur(${glassOpacity / 10}px)`,
                      boxShadow: shadows
                        ? `0 0 ${glowIntensity / 4}px rgba(0,255,255,${glowIntensity / 300})`
                        : "none",
                    }}
                  >
                    <h3 className="text-cyan-400 font-semibold mb-2">
                      Sample Card
                    </h3>
                    <p className="text-gray-300 text-sm">
                      This is how cards look with current settings
                    </p>
                  </Card>

                  <Card
                    className="p-4 border-purple-400/30 transition-all duration-300 hover:border-purple-400/50"
                    style={{
                      background: `rgba(34,34,39,${glassOpacity / 150})`,
                      backdropFilter: `blur(${glassOpacity / 10}px)`,
                      boxShadow: shadows
                        ? `0 0 ${glowIntensity / 4}px rgba(139,92,246,${glowIntensity / 300})`
                        : "none",
                    }}
                  >
                    <h3 className="text-purple-400 font-semibold mb-2">
                      Another Card
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Preview different color variants
                    </p>
                  </Card>
                </div>

                {/* Sample Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-cyan-500 hover:bg-cyan-600"
                    style={{
                      boxShadow: shadows
                        ? `0 0 ${glowIntensity / 6}px rgba(0,255,255,${glowIntensity / 200})`
                        : "none",
                    }}
                  >
                    Primary Action
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    Secondary
                  </Button>
                  <Button
                    variant="destructive"
                    style={{
                      boxShadow: shadows
                        ? `0 0 ${glowIntensity / 6}px rgba(239,68,68,${glowIntensity / 200})`
                        : "none",
                    }}
                  >
                    Danger
                  </Button>
                </div>

                {/* Sample Toggle */}
                <div
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: `rgba(34,34,39,${glassOpacity / 200})`,
                  }}
                >
                  <span className="text-gray-300">Sample Toggle (ON)</span>
                  <div
                    className="w-12 h-6 bg-cyan-500 rounded-full relative"
                    style={{
                      boxShadow: `0 0 ${glowIntensity / 8}px rgba(0,255,255,${glowIntensity / 100})`,
                    }}
                  >
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>

                {/* Sample Slider */}
                <div className="space-y-2">
                  <span className="text-gray-300">Sample Slider</span>
                  <div className="w-full h-2 bg-gray-700 rounded-full relative">
                    <div
                      className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                      style={{
                        width: `${glowIntensity}%`,
                        boxShadow: `0 0 ${glowIntensity / 10}px rgba(0,255,255,${glowIntensity / 150})`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
