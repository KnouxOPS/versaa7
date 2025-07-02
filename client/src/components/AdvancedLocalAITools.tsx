import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";
import { AI_TOOLS_DATABASE, ToolsDatabase } from "@/data/aiToolsDatabase";
import { AiTool, AiToolUtils, TOOL_CATEGORIES } from "@/types/aiTools";

interface AdvancedLocalAIToolsProps {
  selectedTool?: string;
  onToolSelect: (tool: AiTool) => void;
}

export function AdvancedLocalAITools({
  selectedTool,
  onToolSelect,
}: AdvancedLocalAIToolsProps) {
  const { t, currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [complexityFilter, setComplexityFilter] = useState<string>("all");
  const [sensitiveFilter, setSensitiveFilter] = useState<boolean>(false);

  const tools = AI_TOOLS_DATABASE;

  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    // Filter by complexity
    if (complexityFilter !== "all") {
      filtered = filtered.filter(
        (tool) => tool.processing_complexity === complexityFilter,
      );
    }

    // Filter sensitive content
    if (sensitiveFilter) {
      filtered = filtered.filter((tool) => !tool.is_sensitive);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = ToolsDatabase.searchTools(
        searchQuery,
        currentLanguage as "ar" | "en",
      );
    }

    return filtered;
  }, [
    selectedCategory,
    complexityFilter,
    sensitiveFilter,
    searchQuery,
    currentLanguage,
    tools,
  ]);

  const categoryIcons: Record<string, string> = {
    Face: "👤",
    Body: "🏃",
    "Background & Environment": "🌄",
    "Artistic & Creative": "🎨",
    "Technical Enhancement": "✨",
    "Advanced Tools": "⚡",
  };

  const categoryNames: Record<string, { ar: string; en: string }> = {
    Face: { ar: "الوجه", en: "Face" },
    Body: { ar: "الجسم", en: "Body" },
    "Background & Environment": {
      ar: "الخلفية والبيئة",
      en: "Background & Environment",
    },
    "Artistic & Creative": { ar: "فني وإبداعي", en: "Artistic & Creative" },
    "Technical Enhancement": {
      ar: "التحسين التقني",
      en: "Technical Enhancement",
    },
    "Advanced Tools": { ar: "أدوات متقدمة", en: "Advanced Tools" },
  };

  const categories = [
    {
      id: "all",
      name: currentLanguage === "ar" ? "جميع الأدوات" : "All Tools",
      icon: "🔧",
      count: tools.length,
    },
    ...TOOL_CATEGORIES.map((cat) => ({
      id: cat,
      name: categoryNames[cat]?.[currentLanguage as "ar" | "en"] || cat,
      icon: categoryIcons[cat] || "🔧",
      count: tools.filter((t) => t.category === cat).length,
    })),
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "high":
        return "bg-red-500/20 text-red-400 border-red-400/30";
      case "extreme":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
    }
  };

  const getCategoryIcon = (category: string): string => {
    return categoryIcons[category] || "🔧";
  };

  const getGPURequirementText = (tool: AiTool): string => {
    if (!tool.model_info.gpu_required)
      return currentLanguage === "ar" ? "CPU" : "CPU";
    const vramText = tool.model_info.min_vram_gb
      ? ` (${tool.model_info.min_vram_gb}GB+)`
      : "";
    return `GPU${vramText}`;
  };

  const complexityOptions = [
    {
      id: "all",
      name: currentLanguage === "ar" ? "كل المستويات" : "All Levels",
    },
    { id: "low", name: currentLanguage === "ar" ? "منخفض" : "Low" },
    { id: "medium", name: currentLanguage === "ar" ? "متوسط" : "Medium" },
    { id: "high", name: currentLanguage === "ar" ? "عالي" : "High" },
    { id: "extreme", name: currentLanguage === "ar" ? "متطرف" : "Extreme" },
  ];

  const totalDatabaseSize = ToolsDatabase.getTotalDatabaseSize();
  const installedSize = tools
    .filter((t) => t.model_info.gpu_required)
    .reduce((sum, t) => sum + t.model_info.size_gb, 0);

  return (
    <div className="space-y-8">
      {/* Header with Advanced Stats */}
      <Card className="glass-strong rounded-3xl p-6 border-cyan-400/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold neon-text text-cyan-400 mb-2">
              🧠 {t("مجموعة أدوات الذكاء الاصطناعي المتقدمة")}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t(
                "30 أداة ذكاء اصطناعي متطورة - معالجة محلية كاملة - خصوصية مطلقة - تقنيات Deep Learning حديثة",
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-400/30 px-4 py-2">
              <span className="mr-2">🟢</span>
              {tools.length}{" "}
              {currentLanguage === "ar" ? "أداة جاهزة" : "Tools Ready"}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 px-4 py-2">
              <span className="mr-2">💾</span>
              {totalDatabaseSize.toFixed(1)} GB{" "}
              {currentLanguage === "ar" ? "إجمالي" : "Total"}
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30 px-4 py-2">
              <span className="mr-2">⚡</span>
              {tools.filter((t) => t.model_info.gpu_required).length} GPU{" "}
              {currentLanguage === "ar" ? "محسن" : "Accelerated"}
            </Badge>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              {currentLanguage === "ar"
                ? "استخدام التخزين المقدر"
                : "Estimated Storage Usage"}
            </span>
            <span className="text-sm text-cyan-400">
              {installedSize.toFixed(1)} GB / {totalDatabaseSize.toFixed(1)} GB
            </span>
          </div>
          <Progress
            value={(installedSize / totalDatabaseSize) * 100}
            className="h-2"
          />
        </div>

        {/* Advanced Search and Filters */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder={
              currentLanguage === "ar"
                ? "ابحث في الأدوات..."
                : "Search tools..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass border-cyan-400/30 focus:border-cyan-400/50"
          />

          <select
            value={complexityFilter}
            onChange={(e) => setComplexityFilter(e.target.value)}
            className="glass border-cyan-400/30 rounded-md px-3 py-2 text-white bg-transparent"
          >
            {complexityOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-gray-800">
                {opt.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sensitiveFilter"
              checked={sensitiveFilter}
              onChange={(e) => setSensitiveFilter(e.target.checked)}
              className="rounded border-cyan-400/30"
            />
            <label htmlFor="sensitiveFilter" className="text-sm text-gray-300">
              {currentLanguage === "ar"
                ? "إخفاء المحتوى الحساس"
                : "Hide Sensitive Content"}
            </label>
          </div>

          <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30 px-4 py-2 flex items-center justify-center">
            <span className="mr-2">🔍</span>
            {filteredTools.length}{" "}
            {currentLanguage === "ar" ? "نتيجة" : "Results"}
          </Badge>
        </div>
      </Card>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className={`glass transition-all duration-300 ${
              selectedCategory === category.id
                ? "bg-cyan-400/20 border-cyan-400/50 text-cyan-400"
                : "border-gray-600/30 hover:border-cyan-400/30 hover:text-cyan-400"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
            <Badge
              variant="secondary"
              className="ml-2 text-xs bg-gray-600/30 text-gray-300"
            >
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool, index) => (
          <Card
            key={tool.id}
            className={`glass p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group border-2 transform hover:scale-105 ${
              selectedTool === tool.id
                ? "border-cyan-400/50 bg-cyan-400/10 shadow-xl shadow-cyan-400/20"
                : "border-transparent hover:border-cyan-400/30"
            }`}
            onClick={() => onToolSelect(tool)}
          >
            {/* Tool Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl animate-pulse">
                  {getCategoryIcon(tool.category)}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors text-lg">
                    {AiToolUtils.getName(tool, currentLanguage)}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    {tool.category}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Badge
                  className={getComplexityColor(tool.processing_complexity)}
                  size="sm"
                >
                  {tool.processing_complexity.toUpperCase()}
                </Badge>
                {tool.is_sensitive && (
                  <Badge
                    className="bg-red-500/20 text-red-400 border-red-400/30"
                    size="sm"
                  >
                    +18
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
              {AiToolUtils.getDescription(tool, currentLanguage)}
            </p>

            {/* Key Features */}
            <div className="space-y-3 mb-4">
              <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                {currentLanguage === "ar" ? "المزايا الرئيسية" : "Key Features"}
              </h4>
              <div className="flex flex-wrap gap-1">
                {AiToolUtils.getFeatures(tool, currentLanguage)
                  .slice(0, 3)
                  .map((feature, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs bg-purple-500/10 text-purple-300 border-purple-400/20"
                    >
                      {feature}
                    </Badge>
                  ))}
                {tool.features.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-600/20 text-gray-300 border-gray-500/30"
                  >
                    +{tool.features.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            {/* Technical Specs */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-gray-400 mb-1">
                  {currentLanguage === "ar" ? "وقت المعالجة" : "Processing"}
                </div>
                <div className="text-cyan-400 font-bold">
                  {tool.model_info.processing_time_secs}
                </div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-gray-400 mb-1">
                  {currentLanguage === "ar" ? "حجم النموذج" : "Model Size"}
                </div>
                <div className="text-green-400 font-bold">
                  {tool.model_info.size_gb.toFixed(1)}GB
                </div>
              </div>
            </div>

            {/* Model Info */}
            <div className="bg-gray-800/20 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-400 mb-1">
                {currentLanguage === "ar" ? "النموذج المستخدم" : "AI Model"}
              </div>
              <div className="text-orange-400 font-semibold text-sm">
                {tool.model_info.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getGPURequirementText(tool)}
              </div>
            </div>

            {/* Input Requirements */}
            <div className="border-t border-gray-600/30 pt-4">
              <div className="text-xs text-gray-400 mb-2">
                {currentLanguage === "ar"
                  ? "المدخلات المطلوبة"
                  : "Required Inputs"}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className="bg-blue-500/20 text-blue-400 border-blue-400/30"
                  size="sm"
                >
                  📷 {currentLanguage === "ar" ? "صورة" : "Image"}
                </Badge>
                {tool.requires_prompt && (
                  <Badge
                    className="bg-orange-500/20 text-orange-400 border-orange-400/30"
                    size="sm"
                  >
                    💬 {currentLanguage === "ar" ? "نص" : "Prompt"}
                  </Badge>
                )}
                {tool.requires_mask && (
                  <Badge
                    className="bg-pink-500/20 text-pink-400 border-pink-400/30"
                    size="sm"
                  >
                    🎭 {currentLanguage === "ar" ? "قناع" : "Mask"}
                  </Badge>
                )}
                {tool.requires_second_image && (
                  <Badge
                    className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30"
                    size="sm"
                  >
                    🖼️ {currentLanguage === "ar" ? "صورة إضافية" : "Reference"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Quality Modes */}
            {tool.quality_modes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-600/30">
                <div className="text-xs text-gray-400 mb-2">
                  {currentLanguage === "ar" ? "أوضاع الجودة" : "Quality Modes"}
                </div>
                <div className="flex gap-1">
                  {tool.quality_modes.map((mode, idx) => (
                    <Badge
                      key={idx}
                      className="bg-indigo-500/20 text-indigo-400 border-indigo-400/30 text-xs"
                    >
                      {mode}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTools.length === 0 && (
        <Card className="glass p-12 text-center border-yellow-400/30">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            {currentLanguage === "ar"
              ? "لم يتم العثور على أدوات"
              : "No Tools Found"}
          </h3>
          <p className="text-gray-300 mb-4">
            {currentLanguage === "ar"
              ? "حاول تغيير معايير البحث أو المرشحات"
              : "Try adjusting your search criteria or filters"}
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setComplexityFilter("all");
              setSensitiveFilter(false);
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            {currentLanguage === "ar"
              ? "إعادة تعيين المرشحات"
              : "Reset Filters"}
          </Button>
        </Card>
      )}

      {/* Quick Stats Footer */}
      <Card className="glass p-6 border-gray-600/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-cyan-400">
              {tools.filter((t) => t.category === "Face").length}
            </div>
            <div className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "أدوات الوجه" : "Face Tools"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {
                tools.filter(
                  (t) =>
                    t.processing_complexity === "high" ||
                    t.processing_complexity === "extreme",
                ).length
              }
            </div>
            <div className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "أدوات متقدمة" : "Advanced Tools"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {tools.filter((t) => !t.model_info.gpu_required).length}
            </div>
            <div className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "يعمل على CPU" : "CPU Compatible"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {tools.filter((t) => t.is_sensitive).length}
            </div>
            <div className="text-xs text-gray-400">
              {currentLanguage === "ar" ? "محتوى حساس" : "Sensitive Content"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
