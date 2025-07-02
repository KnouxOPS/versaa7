import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

// Knoux Toggle Switch - Tron Style
interface KnouxToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const KnouxToggle: React.FC<KnouxToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
}) => {
  const { language } = useLanguage();
  const lang = language || "en";

  const sizeClasses = {
    sm: "w-10 h-5",
    md: "w-12 h-6",
    lg: "w-16 h-8",
  };

  const thumbSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative ${sizeClasses[size]} rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${
          checked
            ? "bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(0,255,255,0.5)]"
            : "bg-gray-700 border border-gray-600"
        }`}
      >
        {/* Background glow */}
        {checked && (
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-pulse"></div>
        )}

        {/* Thumb */}
        <div
          className={`absolute top-0.5 ${thumbSizes[size]} rounded-full transition-all duration-300 ${
            checked
              ? `${lang === "ar" ? "right-0.5" : "left-auto right-0.5"}`
              : `${lang === "ar" ? "right-auto left-0.5" : "left-0.5"}`
          } ${
            checked
              ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              : "bg-gray-400"
          }`}
        >
          {/* Inner glow */}
          {checked && (
            <div className="absolute inset-0 rounded-full bg-cyan-200 animate-pulse"></div>
          )}
        </div>

        {/* Rail decorations */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <div
            className={`w-1 h-1 rounded-full ${checked ? "bg-white/30" : "bg-gray-500"}`}
          ></div>
          <div
            className={`w-1 h-1 rounded-full ${checked ? "bg-white/30" : "bg-gray-500"}`}
          ></div>
        </div>
      </button>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className="text-sm font-medium text-white">{label}</div>
          )}
          {description && (
            <div className="text-xs text-gray-400">{description}</div>
          )}
        </div>
      )}
    </div>
  );
};

// Knoux Neon Slider
interface KnouxSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  color?: "cyan" | "purple" | "green" | "red";
}

export const KnouxSlider: React.FC<KnouxSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  color = "cyan",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    cyan: "from-cyan-400 to-blue-500",
    purple: "from-purple-400 to-pink-500",
    green: "from-green-400 to-emerald-500",
    red: "from-red-400 to-orange-500",
  };

  const glowColors = {
    cyan: "rgba(0,255,255,0.5)",
    purple: "rgba(139,92,246,0.5)",
    green: "rgba(34,197,94,0.5)",
    red: "rgba(239,68,68,0.5)",
  };

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e as any);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: any) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newValue = Math.min(max, Math.max(min, min + percent * (max - min)));
    onChange(Math.round(newValue / step) * step);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="space-y-3">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-white">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-mono text-cyan-400">{value}%</span>
          )}
        </div>
      )}

      <div className="relative">
        {/* Track */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          className="h-3 bg-gray-700 rounded-full cursor-pointer relative overflow-hidden border border-gray-600"
        >
          {/* Progress */}
          <div
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-200 relative`}
            style={{ width: `${percentage}%` }}
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-full blur-sm"
              style={{ backgroundColor: glowColors[color] }}
            ></div>
          </div>

          {/* Thumb */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg cursor-pointer transition-all duration-200 border-2 border-gray-300 ${
              isDragging ? "scale-110" : "hover:scale-105"
            }`}
            style={{
              left: `calc(${percentage}% - 10px)`,
              boxShadow: `0 0 10px ${glowColors[color]}`,
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white to-gray-100"></div>
          </div>
        </div>

        {/* Value markers */}
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

// Knoux Dropdown Select
interface KnouxSelectOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface KnouxSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: KnouxSelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export const KnouxSelect: React.FC<KnouxSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}

      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-3 bg-gray-800/50 border border-cyan-400/30 rounded-lg text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 hover:border-cyan-400/50 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedOption?.icon && (
              <i className={`fas ${selectedOption.icon} text-cyan-400`}></i>
            )}
            <span className={selectedOption ? "text-white" : "text-gray-400"}>
              {selectedOption?.label || placeholder}
            </span>
          </div>
          <i
            className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          ></i>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 border border-cyan-400/30 rounded-lg shadow-lg z-50 backdrop-blur-sm max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full p-3 text-left hover:bg-cyan-400/10 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                option.value === value
                  ? "bg-cyan-400/20 text-cyan-300"
                  : "text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {option.icon && (
                  <i
                    className={`fas ${option.icon} ${
                      option.value === value ? "text-cyan-300" : "text-gray-400"
                    }`}
                  ></i>
                )}
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
                {option.value === value && (
                  <i className="fas fa-check text-cyan-400"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Knoux Tooltip
interface KnouxTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  personality?: "professional" | "casual" | "badass";
}

export const KnouxTooltip: React.FC<KnouxTooltipProps> = ({
  content,
  children,
  position = "top",
  personality = "badass",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const personalityStyles = {
    professional: "bg-blue-900/90 border-blue-400/50 text-blue-100",
    casual: "bg-green-900/90 border-green-400/50 text-green-100",
    badass: "bg-red-900/90 border-red-400/50 text-red-100",
  };

  const personalityContent = {
    professional: content,
    casual: `💡 ${content}`,
    badass: `🔥 ${content} يحطك Badass كمطور كنوكس!`,
  };

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 rounded-lg border backdrop-blur-sm ${personalityStyles[personality]} ${positionClasses[position]} whitespace-nowrap text-sm animate-fade-in shadow-lg`}
        >
          {personalityContent[personality]}

          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 ${personalityStyles[personality].split(" ")[0]} border-r border-b ${personalityStyles[personality].split(" ")[1]} transform rotate-45 ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 -mt-1"
                : position === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 -mb-1"
                  : position === "left"
                    ? "left-full top-1/2 -translate-y-1/2 -ml-1"
                    : "right-full top-1/2 -translate-y-1/2 -mr-1"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

// Knoux Turbo Button
interface KnouxTurboButtonProps {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const KnouxTurboButton: React.FC<KnouxTurboButtonProps> = ({
  isActive,
  onClick,
  disabled = false,
  size = "lg",
}) => {
  const { language } = useLanguage();
  const lang = language || "en";

  const sizeClasses = {
    sm: "w-16 h-16 text-lg",
    md: "w-20 h-20 text-xl",
    lg: "w-24 h-24 text-2xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses[size]} relative rounded-full transition-all duration-300 focus:outline-none group ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${
        isActive
          ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse-glow"
          : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-red-400 hover:to-orange-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
      }`}
    >
      {/* Background Effects */}
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full bg-red-400/20 blur-lg animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-spin-slow"></div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <i
          className={`fas fa-rocket ${isActive ? "animate-bounce" : "group-hover:scale-110"} transition-transform`}
        ></i>
        <span className="text-xs font-bold mt-1">
          {isActive
            ? lang === "ar"
              ? "نشط"
              : "ON"
            : lang === "ar"
              ? "توربو"
              : "TURBO"}
        </span>
      </div>

      {/* Ring Animation */}
      {isActive && (
        <div className="absolute inset-0 rounded-full border-2 border-red-400/50 animate-ping"></div>
      )}
    </button>
  );
};

// Export all components
export {
  KnouxToggle,
  KnouxSlider,
  KnouxSelect,
  KnouxTooltip,
  KnouxTurboButton,
};
