import React, { useState } from "react";
import { AiTool } from "@/shared/types";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ToolCardProps {
  tool: AiTool;
  onToolSelect: (tool: AiTool) => void;
  isSelected: boolean;
  downloadStatus?:
    | "idle"
    | "downloading"
    | "downloaded"
    | "failed"
    | "already_present";
  downloadProgress?: number; // 0-1
  onDownloadClick: (modelIdentifier: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onToolSelect,
  isSelected,
  downloadStatus,
  downloadProgress,
  onDownloadClick,
}) => {
  const { t } = useLanguage();

  // Determine background color and style based on sensitivity and selection
  const cardBgClass = tool.is_sensitive
    ? "bg-red-900/20 border-red-500/30" // Reddish for sensitive
    : "bg-gray-800/20 border-gray-600/30"; // Default glassmorphism dark background

  const selectedClass = isSelected
    ? "border-2 border-cyan-400 ring-2 ring-cyan-400/50" // Highlight selected tool
    : ""; // Default border

  const modelAvailable =
    downloadStatus === "downloaded" || downloadStatus === "already_present";
  const isDownloading = downloadStatus === "downloading";
  const showDownloadButton = !modelAvailable && !isDownloading;

  return (
    <Card
      className={`relative p-4 glass cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${cardBgClass} ${selectedClass}`}
      onClick={() => onToolSelect(tool)}
    >
      {tool.is_sensitive && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          +18
        </span>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-2">
          {tool.getName("ar")}
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          {tool.getDescription("ar")}
        </p>

        <div className="text-xs text-gray-400 space-y-1">
          <p>
            <span className="text-cyan-400">النموذج:</span>{" "}
            {tool.model_info.name}
          </p>
          <p>
            <span className="text-cyan-400">الحجم:</span>{" "}
            {tool.model_info.size_gb} GB
          </p>
          <p>
            <span className="text-cyan-400">الوقت:</span>{" "}
            {tool.model_info.processing_time_secs} ثانية
          </p>
          {tool.model_info.gpu_required && (
            <p>
              <span className="text-yellow-400">يتطلب GPU</span>
            </p>
          )}
        </div>

        {tool.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-purple-400">المميزات:</h4>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              {tool
                .getFeatures("ar")
                .slice(0, 3)
                .map((feature, index) => (
                  <li key={index} className="leading-tight">
                    {feature}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Requirements indicators */}
        <div className="flex flex-wrap gap-2">
          {tool.requires_mask && (
            <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-600/30">
              يتطلب تحديد منطقة
            </span>
          )}
          {tool.requires_prompt && (
            <span className="px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded-full border border-green-600/30">
              يتطلب وصف
            </span>
          )}
          {tool.requires_second_image && (
            <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 text-xs rounded-full border border-yellow-600/30">
              يتطلب صورة ثانية
            </span>
          )}
        </div>

        {/* Model Download Status/Button Area */}
        <div className="pt-3 border-t border-gray-700 text-center">
          {isDownloading && downloadProgress !== undefined && (
            <div className="space-y-2">
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-400">
                جاري التحميل... {Math.round(downloadProgress * 100)}%
              </p>
            </div>
          )}

          {downloadStatus === "failed" && (
            <div className="space-y-2">
              <span className="text-red-400 text-sm">فشل التحميل</span>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadClick(tool.model_info.backend_identifier);
                }}
                variant="outline"
                size="sm"
                className="border-red-400 text-red-400 hover:bg-red-400/20"
              >
                إعادة المحاولة
              </Button>
            </div>
          )}

          {modelAvailable && (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <i className="fas fa-check-circle text-green-400"></i>
              <span className="text-green-400 text-sm font-semibold">
                جاهز للاستخدام
              </span>
            </div>
          )}

          {showDownloadButton && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDownloadClick(tool.model_info.backend_identifier);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              disabled={isDownloading}
            >
              <i className="fas fa-download mr-2"></i>
              تحميل النموذج
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

interface ToolsListProps {
  tools: AiTool[];
  categories: string[];
  selectedToolId: string | null;
  onToolSelect: (tool: AiTool) => void;
  modelDownloadStatuses: Record<
    string,
    "idle" | "downloading" | "downloaded" | "failed" | "already_present"
  >;
  modelDownloadProgress: Record<string, number>;
  onDownloadModel: (modelIdentifier: string) => void;
}

export const ToolsList: React.FC<ToolsListProps> = ({
  tools,
  categories,
  selectedToolId,
  onToolSelect,
  modelDownloadStatuses,
  modelDownloadProgress,
  onDownloadModel,
}) => {
  const [filterCategory, setFilterCategory] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { t } = useLanguage();

  const filteredTools = tools.filter((tool) => {
    const categoryMatch =
      filterCategory === "all" || tool.category === filterCategory;
    const searchMatch =
      searchQuery.toLowerCase() === "" ||
      tool.getName("ar").toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool
        .getDescription("ar")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      tool.getName("en").toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool
        .getDescription("en")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Category name mapping
  const getCategoryNameAr = (category: string) => {
    const categoryMap: Record<string, string> = {
      Face: "أدوات الوجه",
      Body: "أدوات الجسم",
      "Background & Environment": "الخلفية والبيئة",
      "Artistic & Creative": "فنية وإبداعية",
      "Technical Enhancement": "تحسين تقني",
      "Advanced Tools": "أدوات متقدمة",
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {/* Header with Search */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <i className="fas fa-magic mr-3 text-purple-400"></i>
          جميع الأدوات ({tools.length})
        </h2>

        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن أي أداة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pr-10 rounded-lg glass border border-cyan-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <Button
            onClick={() => setFilterCategory("all")}
            variant={filterCategory === "all" ? "default" : "outline"}
            className={
              filterCategory === "all"
                ? "bg-cyan-600 text-white"
                : "glass border-cyan-400/30"
            }
          >
            جميع الفئات
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              variant={filterCategory === cat ? "default" : "outline"}
              className={
                filterCategory === cat
                  ? "bg-cyan-600 text-white"
                  : "glass border-cyan-400/30"
              }
            >
              {getCategoryNameAr(cat)}
            </Button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onToolSelect={onToolSelect}
            isSelected={tool.id === selectedToolId}
            downloadStatus={
              modelDownloadStatuses[tool.model_info.backend_identifier]
            }
            downloadProgress={
              modelDownloadProgress[tool.model_info.backend_identifier]
            }
            onDownloadClick={onDownloadModel}
          />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center text-gray-400 mt-8 p-8 glass rounded-lg">
          <i className="fas fa-search text-4xl mb-4 text-gray-500"></i>
          <p className="text-lg">لم يتم العثور على أدوات تطابق معايير البحث</p>
          <p className="text-sm">جرب تغيير كلمات البحث أو الفئة</p>
        </div>
      )}
    </div>
  );
};
