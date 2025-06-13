import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

interface ServiceSelectorProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
  onVIPRequest: () => void;
}

// Only show services that are actually implemented in the backend
const services = [
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

export function ServiceSelector({
  selectedService,
  onServiceSelect,
  onVIPRequest,
}: ServiceSelectorProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const handleServiceClick = (serviceId: string, service: any) => {
    if (service.isVIP) {
      onVIPRequest();
      return;
    }

    onServiceSelect(serviceId);
  };

  return (
    <div className="mb-12">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
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
      <div className="text-center mb-6">
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

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <i className={`${service.icon} text-2xl ${service.color}`}></i>
              {service.isImplemented && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
              )}
            </div>

            {/* Service Title */}
            <h3 className={`text-xl font-bold mb-2 ${service.color} neon-text`}>
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
  );
}

import { useState } from "react";
