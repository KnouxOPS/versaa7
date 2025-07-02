import React, { useState, useEffect } from "react";

interface LiveNowPanelProps {
  tool: string;
  model: string;
  privacy: string;
  status: "Running" | "Paused" | "Error";
  onStop?: () => void;
  onSwitch?: () => void;
  onShowLogs?: () => void;
  className?: string;
}

const LiveNowPanel: React.FC<LiveNowPanelProps> = ({
  tool,
  model,
  privacy,
  status,
  onStop,
  onSwitch,
  onShowLogs,
  className = "",
}) => {
  const [livePulse, setLivePulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePulse((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    Running: {
      color: "#00FF88",
      textColor: "#00FF88",
      shadowColor: "rgba(0, 255, 136, 0.6)",
      emoji: "🟢",
    },
    Paused: {
      color: "#FFD700",
      textColor: "#FFD700",
      shadowColor: "rgba(255, 215, 0, 0.6)",
      emoji: "🟡",
    },
    Error: {
      color: "#FF4444",
      textColor: "#FF4444",
      shadowColor: "rgba(255, 68, 68, 0.6)",
      emoji: "🔴",
    },
  };

  const currentStatus = statusConfig[status];

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStop?.();
  };

  const handleSwitch = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSwitch?.();
  };

  const handleShowLogs = () => {
    onShowLogs?.();
  };

  return (
    <div
      className={`
        relative max-w-md w-full cursor-pointer
        glass-strong rounded-2xl p-4
        border-2 transition-all duration-300 hover:scale-[1.02]
        ${className}
      `}
      onClick={handleShowLogs}
      style={{
        borderColor: currentStatus.color,
        boxShadow: `0 0 20px ${currentStatus.shadowColor}, 0 8px 32px rgba(0, 0, 0, 0.3)`,
      }}
      title={`🧠 ${privacy} – حالة: ${status}`}
    >
      {/* Background Glow Effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-20 blur-md"
        style={{
          background: `linear-gradient(135deg, ${currentStatus.color}20, transparent)`,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Pulsing Live Indicator */}
        <div className="flex-shrink-0 relative">
          <div
            className="w-5 h-5 rounded-full transition-all duration-500"
            style={{
              backgroundColor: currentStatus.color,
              opacity: livePulse ? 1 : 0.3,
              boxShadow: livePulse
                ? `0 0 20px ${currentStatus.shadowColor}`
                : "none",
            }}
          />
          {/* Ripple effect */}
          {livePulse && (
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: currentStatus.color, opacity: 0.4 }}
            />
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Title with LIVE indicator */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-white neon-text">
              {currentStatus.emoji} LIVE NOW
            </span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-300 font-medium">أداة:</span>
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "#00FFEF" }}
            >
              {tool}
            </span>
          </div>

          {/* Details */}
          <div className="text-xs text-gray-400 space-y-0.5">
            <div className="flex items-center gap-1">
              <span>موديل:</span>
              <span className="text-yellow-400 font-medium">{model}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>الخصوصية:</span>
              <span className="text-pink-400 font-medium">{privacy}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {/* Stop Button */}
          <button
            onClick={handleStop}
            className="
              px-3 py-1.5 rounded-lg text-xs font-bold
              bg-red-500/80 hover:bg-red-500 text-white
              border border-red-400/50 
              transition-all duration-200
              hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]
              active:scale-95
            "
            title="إيقاف المهمة"
          >
            ✋ وقف
          </button>

          {/* Switch Button */}
          <button
            onClick={handleSwitch}
            className="
              px-3 py-1.5 rounded-lg text-xs font-bold
              bg-cyan-500/80 hover:bg-cyan-500 text-black
              border border-cyan-400/50
              transition-all duration-200
              hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]
              active:scale-95
            "
            title="تبديل الأداة"
          >
            🔄 تبديل
          </button>
        </div>
      </div>

      {/* Hover glow enhancement */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl blur-xl"
          style={{
            background: `linear-gradient(135deg, ${currentStatus.color}15, transparent)`,
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
};

export default LiveNowPanel;
