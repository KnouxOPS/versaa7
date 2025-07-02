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

  // Get current effective settings (with previews)
  const effectiveSettings = {
    ...state.settings,
    ...state.previewChanges,
  };

  // Live preview component with current settings applied
  const PreviewComponent = () => {
    const neonGlow = getSettingValue(state, "neonGlow");
    const glassmorphism = getSettingValue(state, "glassmorphism");
    const animations = getSettingValue(state, "animations");
    const shadows = getSettingValue(state, "shadows");

    return (
      <div
        className="relative w-full h-full rounded-lg overflow-hidden transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(15,15,18,${glassmorphism / 100}) 0%, rgba(34,34,39,${glassmorphism / 100}) 50%, rgba(15,15,18,${glassmorphism / 100}) 100%)`,
          backdropFilter: `blur(${glassmorphism / 5}px)`,
          boxShadow: shadows
            ? `0 0 ${neonGlow / 2}px rgba(0,255,255,${neonGlow / 200})`
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
                  boxShadow: `0 0 ${neonGlow / 4}px rgba(0,255,255,${neonGlow / 100})`,
                  animation: animations ? "pulse 2s infinite" : "none",
                }}
              >
                <div className="w-full h-full bg-[#0F0F12] rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-cyan-400">K</span>
                </div>
              </div>
              <span className="text-white font-semibold">
                Preview Interface
              </span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
              Live
            </Badge>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          {/* Sample Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="p-4 border-cyan-400/30 transition-all duration-300 hover:border-cyan-400/50"
              style={{
                background: `rgba(34,34,39,${glassmorphism / 150})`,
                backdropFilter: `blur(${glassmorphism / 8}px)`,
                boxShadow: shadows
                  ? `0 0 ${neonGlow / 4}px rgba(0,255,255,${neonGlow / 300})`
                  : "none",
              }}
            >
              <h3 className="text-cyan-400 font-semibold mb-2">Sample Card</h3>
              <p className="text-gray-300 text-sm">
                This is how cards look with current settings
              </p>
            </Card>

            <Card
              className="p-4 border-purple-400/30 transition-all duration-300 hover:border-purple-400/50"
              style={{
                background: `rgba(34,34,39,${glassmorphism / 150})`,
                backdropFilter: `blur(${glassmorphism / 8}px)`,
                boxShadow: shadows
                  ? `0 0 ${neonGlow / 4}px rgba(139,92,246,${neonGlow / 300})`
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
          <div className="flex gap-3 flex-wrap">
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              style={{
                boxShadow: `0 0 ${neonGlow / 3}px rgba(0,255,255,${neonGlow / 200})`,
                animation: animations ? "none" : "none",
              }}
            >
              Primary Action
            </Button>
            <Button
              variant="outline"
              className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
            >
              Secondary
            </Button>
            <Button
              variant="outline"
              className="border-red-400/30 text-red-400 hover:bg-red-400/10"
            >
              Danger
            </Button>
          </div>

          {/* Sample Toggle */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full relative cursor-pointer"
              style={{
                boxShadow: `0 0 ${neonGlow / 5}px rgba(0,255,255,${neonGlow / 100})`,
              }}
            >
              <div
                className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300"
                style={{
                  boxShadow: shadows ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
                }}
              ></div>
            </div>
            <span className="text-white text-sm">Sample Toggle (ON)</span>
          </div>

          {/* Sample Slider */}
          <div className="space-y-2">
            <span className="text-white text-sm">Sample Slider</span>
            <div className="h-3 bg-gray-700 rounded-full relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                style={{
                  width: `${neonGlow}%`,
                  boxShadow: `0 0 ${neonGlow / 8}px rgba(0,255,255,${neonGlow / 200})`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {lang === "ar" ? "المعاينة المباشرة" : "Live Preview"}
            </h2>
            <p className="text-gray-400">
              {lang === "ar"
                ? "شاهد التغييرات مباشرة على الواجهة"
                : "See changes applied to the interface in real-time"}
            </p>
          </div>

          {/* Preview Controls */}
          <div className="flex items-center gap-2">
            {/* Device Size Toggle */}
            <div className="flex border border-cyan-400/30 rounded-lg overflow-hidden">
              {["desktop", "tablet", "mobile"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode as any)}
                  className={`px-3 py-1 text-sm transition-colors ${
                    previewMode === mode
                      ? "bg-cyan-400/20 text-cyan-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <i
                    className={`fas ${
                      mode === "desktop"
                        ? "fa-desktop"
                        : mode === "tablet"
                          ? "fa-tablet-alt"
                          : "fa-mobile-alt"
                    } mr-1`}
                  ></i>
                  {mode === "desktop"
                    ? lang === "ar"
                      ? "سطح المكتب"
                      : "Desktop"
                    : mode === "tablet"
                      ? lang === "ar"
                        ? "تابلت"
                        : "Tablet"
                      : lang === "ar"
                        ? "موبايل"
                        : "Mobile"}
                </button>
              ))}
            </div>

            {/* Grid Toggle */}
            <Button
              onClick={() => setShowGrid(!showGrid)}
              size="sm"
              variant="outline"
              className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10"
            >
              <i className="fas fa-th mr-1"></i>
              {lang === "ar" ? "الشبكة" : "Grid"}
            </Button>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30">
            {lang === "ar" ? "توهج" : "Glow"}:{" "}
            {getSettingValue(state, "neonGlow")}%
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
            {lang === "ar" ? "زجاجي" : "Glass"}:{" "}
            {getSettingValue(state, "glassmorphism")}%
          </Badge>
          <Badge
            className={`${getSettingValue(state, "animations") ? "bg-green-500/20 text-green-400 border-green-400/30" : "bg-gray-500/20 text-gray-400 border-gray-400/30"}`}
          >
            {lang === "ar" ? "حركات" : "Animations"}:{" "}
            {getSettingValue(state, "animations")
              ? lang === "ar"
                ? "مفعل"
                : "ON"
              : lang === "ar"
                ? "معطل"
                : "OFF"}
          </Badge>
          <Badge
            className={`${getSettingValue(state, "shadows") ? "bg-blue-500/20 text-blue-400 border-blue-400/30" : "bg-gray-500/20 text-gray-400 border-gray-400/30"}`}
          >
            {lang === "ar" ? "ظلال" : "Shadows"}:{" "}
            {getSettingValue(state, "shadows")
              ? lang === "ar"
                ? "مفعل"
                : "ON"
              : lang === "ar"
                ? "معطل"
                : "OFF"}
          </Badge>
          {Object.keys(state.previewChanges).length > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30 animate-pulse">
              {Object.keys(state.previewChanges).length}{" "}
              {lang === "ar" ? "تغيير معلق" : "Pending Changes"}
            </Badge>
          )}
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 relative">
        {/* Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
              `,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
        )}

        {/* Preview Frame */}
        <div className="h-full flex items-center justify-center p-4">
          <div
            className={`bg-black border-2 border-gray-700 rounded-lg transition-all duration-500 ${
              previewMode === "desktop"
                ? "w-full h-full"
                : previewMode === "tablet"
                  ? "w-3/4 h-5/6"
                  : "w-80 h-96"
            }`}
            style={{
              maxWidth:
                previewMode === "desktop"
                  ? "100%"
                  : previewMode === "tablet"
                    ? "768px"
                    : "375px",
              aspectRatio: previewMode === "mobile" ? "9/16" : "auto",
            }}
          >
            <PreviewComponent />
          </div>
        </div>

        {/* Preview Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="glass-light p-3">
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-400">
                {lang === "ar" ? "دقة المعاينة" : "Preview Resolution"}:
                <span className="text-white ml-1">
                  {previewMode === "desktop"
                    ? "1920×1080"
                    : previewMode === "tablet"
                      ? "1024×768"
                      : "375×667"}
                </span>
              </div>
              <div className="text-gray-400">
                {lang === "ar" ? "آخر تحديث" : "Last Updated"}:
                <span className="text-cyan-400 ml-1">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
