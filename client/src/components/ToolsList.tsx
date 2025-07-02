import React, { useState, useMemo } from "react";
import { AiTool } from "@/shared/types";
import { useLanguage } from "@/hooks/useLanguage";
import { useModelDownloading } from "@/hooks/useModelDownloading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface ToolCardProps {
  tool: AiTool;
  onToolSelect: (tool: AiTool) => void;
  isSelected: boolean;
  downloadStatus:
    | "idle"
    | "downloading"
    | "downloaded"
    | "failed"
    | "already_present";
  downloadProgress: number;
  onDownloadClick: (modelIdentifier: string) => void;
  language: "ar" | "en";
}

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onToolSelect,
  isSelected,
  downloadStatus,
  downloadProgress,
  onDownloadClick,
  language,
}) => {
  const modelAvailable =
    downloadStatus === "downloaded" || downloadStatus === "already_present";
  const isDownloading = downloadStatus === "downloading";
  const showDownloadButton = !modelAvailable && !isDownloading;

  // Determine card styling based on tool properties
  const getCardStyling = () => {
    let baseClasses =
      "relative p-6 rounded-2xl backdrop-filter backdrop-blur-lg border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl";

    if (tool.is_sensitive) {
      baseClasses += " bg-red-900/20 border-red-500/30 hover:border-red-400/50";
    } else {
      baseClasses += " bg-white/5 border-white/10 hover:border-cyan-400/50";
    }

    if (isSelected) {
      baseClasses += " ring-2 ring-cyan-400/50 bg-cyan-400/10";
    }

    return baseClasses;
  };

  // Get complexity color
  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-orange-400";
      case "extreme":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card className={getCardStyling()}>
      {/* Sensitive content indicator */}
      {tool.is_sensitive && (
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="destructive"
            className="bg-red-600/80 text-white text-xs font-bold"
          >
            +18
          </Badge>
        </div>
      )}

      {/* Model status indicator */}
      <div className="absolute top-3 right-3 z-10">
        {modelAvailable && (
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        )}
        {isDownloading && (
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        )}
        {!modelAvailable && !isDownloading && (
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        )}
      </div>

      <div onClick={() => onToolSelect(tool)} className="h-full flex flex-col">
        {/* Tool Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
            {tool.getName(language)}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
            {tool.getDescription(language)}
          </p>
        </div>

        {/* Tool Category & Complexity */}
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className="text-xs border-cyan-400/30 text-cyan-400"
          >
            {tool.category}
          </Badge>
          {tool.processing_complexity && (
            <Badge
              variant="outline"
              className={`text-xs border-current ${getComplexityColor(tool.processing_complexity)}`}
            >
              {tool.processing_complexity}
            </Badge>
          )}
        </div>

        {/* Model Information */}
        <div className="text-xs text-gray-400 mb-4 space-y-1">
          <div className="flex justify-between">
            <span>Model:</span>
            <span className="text-cyan-400">{tool.model_info.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Size:</span>
            <span className="text-cyan-400">{tool.model_info.size_gb} GB</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span className="text-cyan-400">
              {tool.model_info.processing_time_secs}
            </span>
          </div>
          {tool.model_info.gpu_required && (
            <div className="flex justify-between">
              <span>VRAM:</span>
              <span className="text-orange-400">
                {tool.model_info.min_vram_gb || "N/A"} GB
              </span>
            </div>
          )}
        </div>

        {/* Tool Features */}
        {tool.features.length > 0 && (
          <div className="mb-4 flex-grow">
            <h4 className="text-xs font-semibold text-gray-300 mb-2">
              Features:
            </h4>
            <ul className="text-xs text-gray-400 space-y-1">
              {tool
                .getFeatures(language)
                .slice(0, 3)
                .map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span className="line-clamp-1">{feature}</span>
                  </li>
                ))}
              {tool.features.length > 3 && (
                <li className="text-cyan-400 text-xs">
                  +{tool.features.length - 3} more...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Requirements Icons */}
        <div className="flex items-center gap-3 mb-4 text-xs">
          {tool.requires_mask && (
            <div className="flex items-center gap-1 text-purple-400">
              <i className="fas fa-paint-brush"></i>
              <span>Mask</span>
            </div>
          )}
          {tool.requires_prompt && (
            <div className="flex items-center gap-1 text-blue-400">
              <i className="fas fa-edit"></i>
              <span>Prompt</span>
            </div>
          )}
          {tool.requires_second_image && (
            <div className="flex items-center gap-1 text-green-400">
              <i className="fas fa-images"></i>
              <span>2nd Image</span>
            </div>
          )}
        </div>

        <Separator className="my-3 border-gray-700" />

        {/* Download Status/Button Area */}
        <div className="mt-auto">
          {isDownloading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Downloading...</span>
                <span>{Math.round(downloadProgress * 100)}%</span>
              </div>
              <Progress value={downloadProgress * 100} className="h-2" />
            </div>
          )}

          {downloadStatus === "failed" && (
            <div className="text-center">
              <span className="text-red-400 text-xs">Download failed</span>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadClick(tool.model_info.backend_identifier);
                }}
                size="sm"
                variant="outline"
                className="w-full mt-2 border-red-400/30 text-red-400 hover:bg-red-400/10"
              >
                Retry Download
              </Button>
            </div>
          )}

          {modelAvailable && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-semibold">
                <i className="fas fa-check-circle"></i>
                <span>Model Ready</span>
              </div>
            </div>
          )}

          {showDownloadButton && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDownloadClick(tool.model_info.backend_identifier);
              }}
              size="sm"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
            >
              <i className="fas fa-download mr-2"></i>
              {language === "ar" ? "تحميل النموذج" : "Download Model"}
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
  className?: string;
}

export const ToolsList: React.FC<ToolsListProps> = ({
  tools,
  categories,
  selectedToolId,
  onToolSelect,
  className = "",
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [complexityFilter, setComplexityFilter] = useState<string>("all");
  const [showSensitiveOnly, setShowSensitiveOnly] = useState<boolean>(false);

  const { language } = useLanguage();
  const lang = language || "en";

  const { getModelStatus, downloadModel } = useModelDownloading();

  // Filter tools based on selected criteria
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const categoryMatch =
        filterCategory === "all" || tool.category === filterCategory;
      const searchMatch =
        searchQuery.toLowerCase() === "" ||
        tool.getName(lang).toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool
          .getDescription(lang)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const complexityMatch =
        complexityFilter === "all" ||
        tool.processing_complexity === complexityFilter;
      const sensitiveMatch = !showSensitiveOnly || tool.is_sensitive;

      return categoryMatch && searchMatch && complexityMatch && sensitiveMatch;
    });
  }, [
    tools,
    filterCategory,
    searchQuery,
    complexityFilter,
    showSensitiveOnly,
    lang,
  ]);

  const handleDownloadModel = (modelIdentifier: string) => {
    downloadModel(modelIdentifier);
  };

  const getDownloadStats = () => {
    const downloaded = tools.filter((tool) => {
      const status = getModelStatus(tool.model_info.backend_identifier);
      return (
        status.status === "downloaded" || status.status === "already_present"
      );
    }).length;

    return { downloaded, total: tools.length };
  };

  const stats = getDownloadStats();

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header with Search and Stats */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            {lang === "ar" ? "جميع الأدوات" : "All Tools"} (
            {filteredTools.length})
          </h2>
          <div className="text-sm text-gray-400">
            Models Ready: {stats.downloaded}/{stats.total}
          </div>
        </div>

        <div className="space-y-4">
          {/* Search Input */}
          <Input
            type="text"
            placeholder={
              lang === "ar" ? "ابحث عن أي أداة..." : "Search any tool..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400/50"
          />

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              onClick={() => setFilterCategory("all")}
              size="sm"
              variant={filterCategory === "all" ? "default" : "outline"}
              className={`whitespace-nowrap ${filterCategory === "all" ? "bg-cyan-500 hover:bg-cyan-600" : "border-white/20 hover:bg-white/5"}`}
            >
              {lang === "ar" ? "الكل" : "All"}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                size="sm"
                variant={filterCategory === cat ? "default" : "outline"}
                className={`whitespace-nowrap ${filterCategory === cat ? "bg-cyan-500 hover:bg-cyan-600" : "border-white/20 hover:bg-white/5"}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="flex gap-2 text-xs">
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white"
            >
              <option value="all">All Complexity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>

            <Button
              onClick={() => setShowSensitiveOnly(!showSensitiveOnly)}
              size="sm"
              variant={showSensitiveOnly ? "default" : "outline"}
              className={`text-xs ${showSensitiveOnly ? "bg-red-500 hover:bg-red-600" : "border-red-400/30 text-red-400"}`}
            >
              +18 Only
            </Button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <ScrollArea className="flex-1 p-6">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => {
              const modelStatus = getModelStatus(
                tool.model_info.backend_identifier,
              );
              return (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onToolSelect={onToolSelect}
                  isSelected={tool.id === selectedToolId}
                  downloadStatus={modelStatus.status}
                  downloadProgress={modelStatus.progress}
                  onDownloadClick={handleDownloadModel}
                  language={lang}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-12">
            <i className="fas fa-search text-4xl mb-4"></i>
            <p className="text-lg">
              {lang === "ar"
                ? "لم يتم العثور على أدوات تطابق المعايير"
                : "No tools found matching criteria"}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
