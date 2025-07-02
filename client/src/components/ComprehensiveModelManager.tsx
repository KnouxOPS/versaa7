import React, { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAvailableTools } from "@/hooks/useAvailableTools";
import { useModelDownloading } from "@/hooks/useModelDownloading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModelInfo {
  id: string;
  name: string;
  size_gb: number;
  backend_identifier: string;
  tools_using: string[];
  status: "downloaded" | "downloading" | "not_downloaded" | "failed";
  progress: number;
  complexity: "low" | "medium" | "high" | "extreme";
  gpu_required: boolean;
  min_vram_gb?: number;
}

export const ComprehensiveModelManager: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || "en";

  const { data: toolsData } = useAvailableTools();
  const { getModelStatus, downloadModel, getDownloadStats } =
    useModelDownloading();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "size" | "status">("name");

  // Process tools data to get unique models
  const models: ModelInfo[] = useMemo(() => {
    if (!toolsData) return [];

    const modelMap = new Map<string, ModelInfo>();

    toolsData.tools.forEach((tool) => {
      const modelId = tool.model_info.backend_identifier;
      const status = getModelStatus(modelId);

      if (!modelMap.has(modelId)) {
        modelMap.set(modelId, {
          id: modelId,
          name: tool.model_info.name,
          size_gb: tool.model_info.size_gb,
          backend_identifier: modelId,
          tools_using: [tool.getName("en")],
          status: status.status,
          progress: status.progress,
          complexity: tool.processing_complexity || "medium",
          gpu_required: tool.model_info.gpu_required || false,
          min_vram_gb: tool.model_info.min_vram_gb,
        });
      } else {
        const existing = modelMap.get(modelId)!;
        existing.tools_using.push(tool.getName("en"));
      }
    });

    return Array.from(modelMap.values());
  }, [toolsData, getModelStatus]);

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let filtered = models.filter((model) => {
      const matchesSearch =
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tools_using.some((tool) =>
          tool.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesStatus =
        statusFilter === "all" || model.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort models
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size_gb - a.size_gb;
        case "status":
          const statusOrder = {
            downloaded: 0,
            downloading: 1,
            not_downloaded: 2,
            failed: 3,
          };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return filtered;
  }, [models, searchQuery, statusFilter, sortBy]);

  const downloadStats = getDownloadStats();

  const content = {
    ar: {
      title: "إدارة النماذج الشاملة",
      search: "البحث عن نموذج...",
      status: "الحالة",
      sortBy: "ترتيب حسب",
      name: "الاسم",
      size: "الحجم",
      all: "الكل",
      downloaded: "محمل",
      downloading: "يتم التحميل",
      notDownloaded: "غير محمل",
      failed: "فشل",
      download: "تحميل",
      retry: "إعادة المحاولة",
      ready: "جاهز",
      toolsUsing: "الأدوات المستخدمة",
      complexity: "المعقدة",
      gpuRequired: "يتطلب GPU",
      vramRequired: "VRAM مطلوب",
      totalSize: "الحجم الإجمالي",
      readyModels: "النماذج الجاهزة",
      downloadAll: "تحميل الكل",
      removeAll: "حذف الكل",
    },
    en: {
      title: "Comprehensive Model Manager",
      search: "Search models...",
      status: "Status",
      sortBy: "Sort by",
      name: "Name",
      size: "Size",
      all: "All",
      downloaded: "Downloaded",
      downloading: "Downloading",
      notDownloaded: "Not Downloaded",
      failed: "Failed",
      download: "Download",
      retry: "Retry",
      ready: "Ready",
      toolsUsing: "Tools Using",
      complexity: "Complexity",
      gpuRequired: "GPU Required",
      vramRequired: "VRAM Required",
      totalSize: "Total Size",
      readyModels: "Ready Models",
      downloadAll: "Download All",
      removeAll: "Remove All",
    },
  };

  const text = content[lang];

  const getStatusBadge = (status: ModelInfo["status"]) => {
    const variants = {
      downloaded: {
        variant: "default" as const,
        color: "bg-green-500",
        text: text.ready,
      },
      downloading: {
        variant: "outline" as const,
        color: "border-yellow-400 text-yellow-400",
        text: text.downloading,
      },
      not_downloaded: {
        variant: "outline" as const,
        color: "border-gray-400 text-gray-400",
        text: text.notDownloaded,
      },
      failed: {
        variant: "destructive" as const,
        color: "bg-red-500",
        text: text.failed,
      },
    };

    // Handle undefined or invalid status by defaulting to not_downloaded
    const safeStatus = status && variants[status] ? status : "not_downloaded";
    const config = variants[safeStatus];

    return (
      <Badge variant={config.variant} className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getComplexityColor = (complexity: string) => {
    const colors = {
      low: "text-green-400",
      medium: "text-yellow-400",
      high: "text-orange-400",
      extreme: "text-red-400",
    };
    return colors[complexity as keyof typeof colors] || "text-gray-400";
  };

  const totalSize = models.reduce((sum, model) => sum + model.size_gb, 0);
  const downloadedSize = models
    .filter((m) => m.status === "downloaded")
    .reduce((sum, model) => sum + model.size_gb, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{text.title}</h1>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="border-cyan-400/30 text-cyan-400"
            >
              {downloadStats.downloaded}/{downloadStats.total}{" "}
              {text.readyModels}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-cyan-400/10 border-cyan-400/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {downloadStats.downloaded}
              </div>
              <div className="text-sm text-cyan-300">{text.downloaded}</div>
            </div>
          </Card>
          <Card className="p-4 bg-purple-400/10 border-purple-400/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {downloadedSize.toFixed(1)} GB
              </div>
              <div className="text-sm text-purple-300">{text.totalSize}</div>
            </div>
          </Card>
          <Card className="p-4 bg-green-400/10 border-green-400/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {models.length}
              </div>
              <div className="text-sm text-green-300">Total Models</div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex gap-4 flex-wrap">
          <Input
            placeholder={text.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] bg-white/5 border-white/10"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.all}</SelectItem>
              <SelectItem value="downloaded">{text.downloaded}</SelectItem>
              <SelectItem value="downloading">{text.downloading}</SelectItem>
              <SelectItem value="not_downloaded">
                {text.notDownloaded}
              </SelectItem>
              <SelectItem value="failed">{text.failed}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value: any) => setSortBy(value)}
          >
            <SelectTrigger className="w-[120px] bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{text.name}</SelectItem>
              <SelectItem value="size">{text.size}</SelectItem>
              <SelectItem value="status">{text.status}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Models List */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {filteredModels.map((model) => (
            <Card
              key={model.id}
              className="p-6 bg-white/5 border-white/10 hover:bg-white/8 transition-colors"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {model.name}
                      </h3>
                      {getStatusBadge(model.status)}
                      {model.gpu_required && (
                        <Badge
                          variant="outline"
                          className="border-orange-400/30 text-orange-400"
                        >
                          <i className="fas fa-microchip mr-1"></i>
                          GPU
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{model.size_gb} GB</span>
                      <span className={getComplexityColor(model.complexity)}>
                        {model.complexity} complexity
                      </span>
                      {model.min_vram_gb && (
                        <span className="text-orange-400">
                          {model.min_vram_gb} GB VRAM
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    {model.status === "not_downloaded" && (
                      <Button
                        onClick={() => downloadModel(model.backend_identifier)}
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-600"
                      >
                        <i className="fas fa-download mr-2"></i>
                        {text.download}
                      </Button>
                    )}
                    {model.status === "failed" && (
                      <Button
                        onClick={() => downloadModel(model.backend_identifier)}
                        size="sm"
                        variant="outline"
                        className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                      >
                        <i className="fas fa-redo mr-2"></i>
                        {text.retry}
                      </Button>
                    )}
                    {model.status === "downloaded" && (
                      <Badge variant="default" className="bg-green-500">
                        <i className="fas fa-check mr-1"></i>
                        {text.ready}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Download Progress */}
                {model.status === "downloading" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Downloading...</span>
                      <span className="text-cyan-400">
                        {Math.round(model.progress * 100)}%
                      </span>
                    </div>
                    <Progress value={model.progress * 100} className="h-2" />
                  </div>
                )}

                {/* Tools Using This Model */}
                <div>
                  <span className="text-sm font-medium text-gray-300 mb-2 block">
                    {text.toolsUsing} ({model.tools_using.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {model.tools_using.slice(0, 3).map((tool, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs border-gray-600"
                      >
                        {tool}
                      </Badge>
                    ))}
                    {model.tools_using.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-600"
                      >
                        +{model.tools_using.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-500 mb-4"></i>
              <p className="text-gray-400">
                No models found matching your criteria
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/10">
        <div className="flex gap-4">
          <Button
            onClick={() => {
              models
                .filter((m) => m.status === "not_downloaded")
                .forEach((m) => downloadModel(m.backend_identifier));
            }}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            <i className="fas fa-download mr-2"></i>
            {text.downloadAll}
          </Button>
          <Button
            variant="outline"
            className="border-gray-500 text-gray-300 hover:bg-gray-700"
            disabled
          >
            <i className="fas fa-trash mr-2"></i>
            {text.removeAll}
          </Button>
        </div>
      </div>
    </div>
  );
};
