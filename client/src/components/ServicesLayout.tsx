import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";

interface Service {
  id: string;
  icon: string;
  color: string;
  bgColor: string;
  titleKey: string;
  descKey: string;
  category: string;
  badge?: string;
  isVIP?: boolean;
  isImplemented: boolean;
  customizations: ServiceCustomization[];
}

interface ServiceCustomization {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  type: "slider" | "select" | "toggle" | "color" | "text";
  options?: any;
  defaultValue: any;
}

interface ServicesLayoutProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
  onVIPRequest: () => void;
  onCustomizationChange: (
    serviceId: string,
    customizations: Record<string, any>,
  ) => void;
}

const services: Service[] = [
  {
    id: "magic-morph",
    icon: "fas fa-magic",
    color: "text-cyan-400",
    bgColor: "from-cyan-400/20 to-blue-500/20",
    titleKey: "Magic Morph",
    descKey: "Select & transform anything with unlimited AI power",
    category: "Core Features",
    badge: "Uncensored",
    isImplemented: true,
    customizations: [
      {
        id: "creativity",
        icon: "fas fa-lightbulb",
        titleKey: "Creativity Level",
        descKey: "How creative should the AI be?",
        type: "slider",
        options: { min: 0, max: 100, step: 10 },
        defaultValue: 70,
      },
      {
        id: "style",
        icon: "fas fa-palette",
        titleKey: "Transformation Style",
        descKey: "Choose the transformation approach",
        type: "select",
        options: [
          { value: "realistic", label: "Photorealistic" },
          { value: "artistic", label: "Artistic" },
          { value: "fantasy", label: "Fantasy/Surreal" },
          { value: "anime", label: "Anime Style" },
        ],
        defaultValue: "realistic",
      },
      {
        id: "preserve_face",
        icon: "fas fa-user",
        titleKey: "Preserve Facial Features",
        descKey: "Keep original facial structure intact",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
  {
    id: "remove-replace",
    icon: "fas fa-eraser",
    color: "text-purple-400",
    bgColor: "from-purple-400/20 to-pink-500/20",
    titleKey: "Remove & Replace",
    descKey: "Erase objects and fill with intelligent context",
    category: "Core Features",
    isImplemented: true,
    customizations: [
      {
        id: "fill_method",
        icon: "fas fa-fill-drip",
        titleKey: "Fill Method",
        descKey: "How to fill the removed area",
        type: "select",
        options: [
          { value: "ai_generate", label: "AI Generated Content" },
          { value: "context_aware", label: "Context-Aware Fill" },
          { value: "pattern_match", label: "Pattern Matching" },
          { value: "background_extend", label: "Background Extension" },
        ],
        defaultValue: "ai_generate",
      },
      {
        id: "edge_blending",
        icon: "fas fa-adjust",
        titleKey: "Edge Blending",
        descKey: "Smoothness of edges after removal",
        type: "slider",
        options: { min: 0, max: 100, step: 5 },
        defaultValue: 80,
      },
    ],
  },
  {
    id: "style-transfer",
    icon: "fas fa-palette",
    color: "text-pink-400",
    bgColor: "from-pink-400/20 to-red-500/20",
    titleKey: "Style Transfer",
    descKey: "Transform to any artistic style (Anime, 3D, Van Gogh...)",
    category: "Artistic",
    isImplemented: true,
    customizations: [
      {
        id: "style_strength",
        icon: "fas fa-adjust",
        titleKey: "Style Strength",
        descKey: "How strongly to apply the style",
        type: "slider",
        options: { min: 0, max: 100, step: 5 },
        defaultValue: 75,
      },
      {
        id: "preserve_content",
        icon: "fas fa-lock",
        titleKey: "Content Preservation",
        descKey: "Preserve original image structure",
        type: "slider",
        options: { min: 0, max: 100, step: 10 },
        defaultValue: 60,
      },
      {
        id: "color_palette",
        icon: "fas fa-eye-dropper",
        titleKey: "Color Enhancement",
        descKey: "Enhance colors in the target style",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
  {
    id: "background-replace",
    icon: "fas fa-image",
    color: "text-green-400",
    bgColor: "from-green-400/20 to-emerald-500/20",
    titleKey: "Background Replace",
    descKey: "Generate or replace backgrounds with AI",
    category: "Background",
    isImplemented: true,
    customizations: [
      {
        id: "subject_detection",
        icon: "fas fa-search",
        titleKey: "Subject Detection",
        descKey: "AI precision for subject isolation",
        type: "slider",
        options: { min: 0, max: 100, step: 5 },
        defaultValue: 85,
      },
      {
        id: "lighting_match",
        icon: "fas fa-sun",
        titleKey: "Lighting Adaptation",
        descKey: "Match lighting to new background",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "background_blur",
        icon: "fas fa-eye",
        titleKey: "Background Blur",
        descKey: "Depth of field effect strength",
        type: "slider",
        options: { min: 0, max: 50, step: 2 },
        defaultValue: 5,
      },
    ],
  },
  {
    id: "object-recolor",
    icon: "fas fa-paint-brush",
    color: "text-yellow-400",
    bgColor: "from-yellow-400/20 to-orange-500/20",
    titleKey: "Object Recolor",
    descKey: "Change colors of any object intelligently",
    category: "Objects",
    isImplemented: true,
    customizations: [
      {
        id: "color_accuracy",
        icon: "fas fa-crosshairs",
        titleKey: "Color Accuracy",
        descKey: "Precision of color application",
        type: "slider",
        options: { min: 0, max: 100, step: 5 },
        defaultValue: 90,
      },
      {
        id: "preserve_texture",
        icon: "fas fa-texture",
        titleKey: "Preserve Texture",
        descKey: "Keep original material textures",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "color_mode",
        icon: "fas fa-palette",
        titleKey: "Color Mode",
        descKey: "How to apply the new color",
        type: "select",
        options: [
          { value: "replace", label: "Complete Replace" },
          { value: "tint", label: "Color Tint" },
          { value: "overlay", label: "Color Overlay" },
          { value: "multiply", label: "Multiply Blend" },
        ],
        defaultValue: "replace",
      },
    ],
  },
  {
    id: "text2image",
    icon: "fas fa-plus-circle",
    color: "text-orange-400",
    bgColor: "from-orange-400/20 to-red-500/20",
    titleKey: "Text2Image Add",
    descKey: "Add new objects with text descriptions",
    category: "Objects",
    isImplemented: true,
    customizations: [
      {
        id: "object_scale",
        icon: "fas fa-expand-arrows-alt",
        titleKey: "Object Scale",
        descKey: "Size of the added object",
        type: "slider",
        options: { min: 10, max: 200, step: 10 },
        defaultValue: 100,
      },
      {
        id: "perspective_match",
        icon: "fas fa-cube",
        titleKey: "Perspective Matching",
        descKey: "Match object perspective to scene",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "shadow_generation",
        icon: "fas fa-moon",
        titleKey: "Generate Shadows",
        descKey: "Add realistic shadows for objects",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
  {
    id: "ai-enhance",
    icon: "fas fa-sparkles",
    color: "text-emerald-400",
    bgColor: "from-emerald-400/20 to-green-500/20",
    titleKey: "AI Enhance",
    descKey: "Upscale and enhance to Ultra HD quality",
    category: "Enhancement",
    badge: "Real-ESRGAN",
    isImplemented: true,
    customizations: [
      {
        id: "upscale_factor",
        icon: "fas fa-expand",
        titleKey: "Upscale Factor",
        descKey: "How much to increase resolution",
        type: "select",
        options: [
          { value: "2x", label: "2x (Double)" },
          { value: "4x", label: "4x (Quadruple)" },
          { value: "8x", label: "8x (Ultra)" },
        ],
        defaultValue: "4x",
      },
      {
        id: "noise_reduction",
        icon: "fas fa-filter",
        titleKey: "Noise Reduction",
        descKey: "Remove image noise and artifacts",
        type: "slider",
        options: { min: 0, max: 100, step: 5 },
        defaultValue: 70,
      },
      {
        id: "sharpening",
        icon: "fas fa-eye",
        titleKey: "Detail Sharpening",
        descKey: "Enhance fine details and edges",
        type: "slider",
        options: { min: 0, max: 100, step: 5 },
        defaultValue: 60,
      },
    ],
  },
  {
    id: "vip-magic",
    icon: "fas fa-crown",
    color: "text-yellow-400",
    bgColor: "from-yellow-400/20 to-amber-500/20",
    titleKey: "VIP Magic Morph",
    descKey: "Ultra-advanced AI for complex transformations (Owner Only)",
    category: "VIP Exclusive",
    isVIP: true,
    badge: "Sadek Elgazar Exclusive",
    isImplemented: true,
    customizations: [
      {
        id: "ai_power",
        icon: "fas fa-bolt",
        titleKey: "AI Power Level",
        descKey: "Maximum AI processing capability",
        type: "slider",
        options: { min: 80, max: 100, step: 1 },
        defaultValue: 95,
      },
      {
        id: "multi_step",
        icon: "fas fa-layer-group",
        titleKey: "Multi-Step Processing",
        descKey: "Enable complex multi-pass AI processing",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "ultra_quality",
        icon: "fas fa-gem",
        titleKey: "Ultra Quality Mode",
        descKey: "Maximum quality output (slower)",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
];

const categories = [
  {
    id: "all",
    name: "All Tools",
    icon: "fas fa-th-large",
    color: "text-white",
  },
  {
    id: "Core Features",
    name: "Core Features",
    icon: "fas fa-magic",
    color: "text-cyan-400",
  },
  {
    id: "Artistic",
    name: "Artistic",
    icon: "fas fa-palette",
    color: "text-pink-400",
  },
  {
    id: "Background",
    name: "Background",
    icon: "fas fa-image",
    color: "text-green-400",
  },
  {
    id: "Objects",
    name: "Objects",
    icon: "fas fa-cube",
    color: "text-orange-400",
  },
  {
    id: "Enhancement",
    name: "Enhancement",
    icon: "fas fa-sparkles",
    color: "text-emerald-400",
  },
  {
    id: "VIP Exclusive",
    name: "VIP Exclusive",
    icon: "fas fa-crown",
    color: "text-yellow-400",
  },
];

export function ServicesLayout({
  selectedService,
  onServiceSelect,
  onVIPRequest,
  onCustomizationChange,
}: ServicesLayoutProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customizations, setCustomizations] = useState<
    Record<string, Record<string, any>>
  >({});

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const selectedServiceData = services.find(
    (service) => service.id === selectedService,
  );

  // Initialize customizations for all services
  useEffect(() => {
    const initialCustomizations: Record<string, Record<string, any>> = {};
    services.forEach((service) => {
      initialCustomizations[service.id] = {};
      service.customizations.forEach((custom) => {
        initialCustomizations[service.id][custom.id] = custom.defaultValue;
      });
    });
    setCustomizations(initialCustomizations);
  }, []);

  const handleServiceClick = (serviceId: string, service: Service) => {
    if (service.isVIP) {
      onVIPRequest();
      return;
    }
    onServiceSelect(serviceId);
  };

  const handleCustomizationChange = (customId: string, value: any) => {
    const newCustomizations = {
      ...customizations,
      [selectedService]: {
        ...customizations[selectedService],
        [customId]: value,
      },
    };
    setCustomizations(newCustomizations);
    onCustomizationChange(selectedService, newCustomizations[selectedService]);
  };

  const renderCustomizationControl = (custom: ServiceCustomization) => {
    const currentValue =
      customizations[selectedService]?.[custom.id] ?? custom.defaultValue;

    switch (custom.type) {
      case "slider":
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">
                {currentValue}
                {custom.options.step < 1 ? "%" : ""}
              </span>
            </div>
            <input
              type="range"
              min={custom.options.min}
              max={custom.options.max}
              step={custom.options.step}
              value={currentValue}
              onChange={(e) =>
                handleCustomizationChange(custom.id, Number(e.target.value))
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
            />
          </div>
        );

      case "select":
        return (
          <select
            value={currentValue}
            onChange={(e) =>
              handleCustomizationChange(custom.id, e.target.value)
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
          >
            {custom.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        );

      case "toggle":
        return (
          <button
            onClick={() => handleCustomizationChange(custom.id, !currentValue)}
            className={`w-full p-2 rounded-lg border transition-all duration-300 ${
              currentValue
                ? "bg-cyan-400/20 border-cyan-400 text-cyan-400"
                : "bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500"
            }`}
          >
            <i
              className={`fas ${currentValue ? "fa-toggle-on" : "fa-toggle-off"} mr-2`}
            ></i>
            {currentValue ? t("Enabled") : t("Disabled")}
          </button>
        );

      case "color":
        return (
          <input
            type="color"
            value={currentValue}
            onChange={(e) =>
              handleCustomizationChange(custom.id, e.target.value)
            }
            className="w-full h-10 rounded-lg border border-gray-600 bg-gray-800 cursor-pointer"
          />
        );

      case "text":
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) =>
              handleCustomizationChange(custom.id, e.target.value)
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            placeholder={t(custom.descKey)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              glass rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300
              ${
                selectedCategory === category.id
                  ? `border-2 ${category.color} bg-opacity-20 neon-glow`
                  : "border border-gray-600 hover:border-gray-400"
              }
            `}
          >
            <i className={`${category.icon} mr-2 ${category.color}`}></i>
            {t(category.name)}
          </button>
        ))}
      </div>

      {/* Tools Count */}
      <div className="text-center">
        <p className="text-gray-400">
          <span className="text-cyan-400 font-bold">
            {filteredServices.length}
          </span>{" "}
          {t("AI Tools Available")}
          {selectedCategory !== "all" && (
            <span className="ml-2">
              • <span className="text-purple-400">{t(selectedCategory)}</span>{" "}
              {t("Category")}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredServices.map((service, index) => (
              <Card
                key={service.id}
                className={`
                  service-card glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl animate-float
                  ${selectedService === service.id ? "border-cyan-400 bg-cyan-400/10 neon-glow" : "hover:border-cyan-400/50"}
                  ${service.isVIP ? "vip-exclusive border-yellow-500/50" : ""}
                  ${service.isImplemented ? "border-green-500/30" : ""}
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleServiceClick(service.id, service)}
              >
                {/* Service Icon */}
                <div
                  className={`w-16 h-16 rounded-lg mb-4 bg-gradient-to-br ${service.bgColor} flex items-center justify-center relative`}
                >
                  <i
                    className={`${service.icon} text-2xl ${service.color}`}
                  ></i>
                  {service.isImplemented && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                  )}
                </div>

                {/* Service Title */}
                <h3
                  className={`text-xl font-bold mb-2 ${service.color} neon-text`}
                >
                  {t(service.titleKey)}
                </h3>

                {/* Service Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {t(service.descKey)}
                </p>

                {/* Service Badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {service.badge && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${service.isVIP ? "bg-yellow-500/20 text-yellow-400" : "bg-cyan-500/20 text-cyan-400"}`}
                    >
                      {service.isVIP && <i className="fas fa-crown mr-1"></i>}
                      {t(service.badge)}
                    </Badge>
                  )}
                  {service.isImplemented && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-500/20 text-green-400"
                    >
                      <i className="fas fa-check mr-1"></i>
                      {t("Working")}
                    </Badge>
                  )}
                </div>

                {/* Active Indicator */}
                {selectedService === service.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse-glow"></div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Customization Panel */}
        {selectedServiceData && (
          <div className="lg:col-span-1">
            <Card className="glass-strong rounded-2xl p-6 sticky top-6">
              <div className="flex items-center mb-6">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedServiceData.bgColor} flex items-center justify-center mr-4`}
                >
                  <i
                    className={`${selectedServiceData.icon} text-xl ${selectedServiceData.color}`}
                  ></i>
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold ${selectedServiceData.color} neon-text`}
                  >
                    {t(selectedServiceData.titleKey)}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t("Customization Panel")}
                  </p>
                </div>
              </div>

              <Separator className="mb-6 bg-gray-600" />

              <div className="space-y-6">
                {selectedServiceData.customizations.map((custom) => (
                  <div key={custom.id} className="space-y-3">
                    <div className="flex items-center mb-2">
                      <i
                        className={`${custom.icon} text-cyan-400 mr-2 text-sm`}
                      ></i>
                      <label className="text-sm font-semibold text-white">
                        {t(custom.titleKey)}
                      </label>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">
                      {t(custom.descKey)}
                    </p>
                    {renderCustomizationControl(custom)}
                  </div>
                ))}
              </div>

              {/* Apply Settings Button */}
              <Button
                className="w-full mt-6 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border-cyan-400/50 hover:bg-cyan-400/30"
                onClick={() =>
                  onCustomizationChange(
                    selectedService,
                    customizations[selectedService] || {},
                  )
                }
              >
                <i className="fas fa-cogs mr-2"></i>
                {t("Apply Settings")}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
