import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAvailableTools } from "@/hooks/useAvailableTools";
import { useModelDownloading } from "@/hooks/useModelDownloading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  gpuMemory: number;
  temperature: number;
  modelsCached: number;
  totalStorageUsed: number;
}

export const SystemStatsWidget: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || "en";

  const { data: toolsData } = useAvailableTools();
  const { getDownloadStats } = useModelDownloading();

  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpuUsage: 0,
    memoryUsage: 0,
    gpuUsage: 0,
    gpuMemory: 0,
    temperature: 0,
    modelsCached: 0,
    totalStorageUsed: 0,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate system stats (in real implementation, this would come from actual system monitoring)
  useEffect(() => {
    const updateStats = () => {
      setSystemStats({
        cpuUsage: Math.floor(Math.random() * 40) + 20, // 20-60%
        memoryUsage: Math.floor(Math.random() * 30) + 50, // 50-80%
        gpuUsage: Math.floor(Math.random() * 60) + 20, // 20-80%
        gpuMemory: Math.floor(Math.random() * 40) + 30, // 30-70%
        temperature: Math.floor(Math.random() * 20) + 65, // 65-85°C
        modelsCached: Math.floor(Math.random() * 5) + 2, // 2-7 models
        totalStorageUsed: Math.floor(Math.random() * 10) + 15, // 15-25 GB
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const downloadStats = getDownloadStats();
  const totalTools = toolsData?.tools.length || 0;
  const totalModelSize =
    toolsData?.tools.reduce((sum, tool) => sum + tool.model_info.size_gb, 0) ||
    0;

  const getStatusColor = (
    value: number,
    type: "cpu" | "memory" | "gpu" | "temp",
  ) => {
    switch (type) {
      case "cpu":
      case "memory":
      case "gpu":
        if (value > 80) return "text-red-400";
        if (value > 60) return "text-yellow-400";
        return "text-green-400";
      case "temp":
        if (value > 80) return "text-red-400";
        if (value > 70) return "text-yellow-400";
        return "text-green-400";
      default:
        return "text-cyan-400";
    }
  };

  const content = {
    ar: {
      title: "إحصائيات النظام",
      cpu: "المعالج",
      memory: "الذاكرة",
      gpu: "كرت الرسوميات",
      gpuMemory: "ذاكرة GPU",
      temperature: "درجة الحرارة",
      modelsReady: "النماذج الجاهزة",
      toolsTotal: "إجمالي الأدوات",
      storageUsed: "التخزين المستخدم",
      modelsCached: "النماذج المحملة",
      performance: "الأداء",
      status: "الحالة",
      excellent: "ممتاز",
      good: "جيد",
      warning: "تحذير",
      critical: "حرج",
      showMore: "عرض المزيد",
      showLess: "عرض أقل",
    },
    en: {
      title: "System Stats",
      cpu: "CPU",
      memory: "Memory",
      gpu: "GPU",
      gpuMemory: "GPU Memory",
      temperature: "Temperature",
      modelsReady: "Models Ready",
      toolsTotal: "Total Tools",
      storageUsed: "Storage Used",
      modelsCached: "Models Cached",
      performance: "Performance",
      status: "Status",
      excellent: "Excellent",
      good: "Good",
      warning: "Warning",
      critical: "Critical",
      showMore: "Show More",
      showLess: "Show Less",
    },
  };

  const text = content[lang];

  const getOverallStatus = () => {
    const avgUsage =
      (systemStats.cpuUsage + systemStats.memoryUsage + systemStats.gpuUsage) /
      3;
    if (avgUsage > 85 || systemStats.temperature > 80)
      return { status: text.critical, color: "text-red-400" };
    if (avgUsage > 70 || systemStats.temperature > 75)
      return { status: text.warning, color: "text-yellow-400" };
    if (avgUsage > 40) return { status: text.good, color: "text-green-400" };
    return { status: text.excellent, color: "text-cyan-400" };
  };

  const overallStatus = getOverallStatus();

  return (
    <Card className="glass-strong border-cyan-400/30 p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fas fa-chart-line text-cyan-400"></i>
            <h3 className="font-semibold text-white">{text.title}</h3>
          </div>
          <Badge
            variant="outline"
            className={`${overallStatus.color} border-current`}
          >
            {overallStatus.status}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-xs text-gray-400">{text.cpu}</div>
            <div
              className={`text-lg font-bold ${getStatusColor(systemStats.cpuUsage, "cpu")}`}
            >
              {systemStats.cpuUsage}%
            </div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <div className="text-xs text-gray-400">{text.memory}</div>
            <div
              className={`text-lg font-bold ${getStatusColor(systemStats.memoryUsage, "memory")}`}
            >
              {systemStats.memoryUsage}%
            </div>
          </div>
        </div>

        {/* Models Status */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{text.modelsReady}</span>
            <span className="text-cyan-400 font-semibold">
              {downloadStats.downloaded}/{downloadStats.total}
            </span>
          </div>
          <Progress
            value={(downloadStats.downloaded / downloadStats.total) * 100}
            className="h-2"
          />
        </div>

        {/* Expandable Section */}
        {isExpanded && (
          <>
            <Separator className="border-gray-700" />

            {/* GPU Stats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{text.gpu}</span>
                <span
                  className={`text-sm font-semibold ${getStatusColor(systemStats.gpuUsage, "gpu")}`}
                >
                  {systemStats.gpuUsage}%
                </span>
              </div>
              <Progress value={systemStats.gpuUsage} className="h-2" />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{text.gpuMemory}</span>
                <span
                  className={`text-sm font-semibold ${getStatusColor(systemStats.gpuMemory, "memory")}`}
                >
                  {systemStats.gpuMemory}%
                </span>
              </div>
              <Progress value={systemStats.gpuMemory} className="h-2" />
            </div>

            {/* Temperature */}
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2">
                <i className="fas fa-thermometer-half text-orange-400"></i>
                <span className="text-sm text-gray-400">
                  {text.temperature}
                </span>
              </div>
              <span
                className={`font-bold ${getStatusColor(systemStats.temperature, "temp")}`}
              >
                {systemStats.temperature}°C
              </span>
            </div>

            {/* Storage Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <div className="text-gray-400">{text.modelsCached}</div>
                <div className="text-purple-400 font-bold">
                  {systemStats.modelsCached}
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <div className="text-gray-400">{text.storageUsed}</div>
                <div className="text-blue-400 font-bold">
                  {systemStats.totalStorageUsed} GB
                </div>
              </div>
            </div>

            {/* Tools Summary */}
            <div className="p-3 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg border border-cyan-400/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-cyan-300">{text.toolsTotal}</span>
                <span className="text-cyan-400 font-bold">{totalTools}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-400">Total Model Size</span>
                <span className="text-gray-300 text-xs">
                  {totalModelSize.toFixed(1)} GB
                </span>
              </div>
            </div>
          </>
        )}

        {/* Toggle Button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="sm"
          className="w-full text-cyan-400 hover:bg-cyan-400/10"
        >
          <i
            className={`fas fa-chevron-${isExpanded ? "up" : "down"} mr-2`}
          ></i>
          {isExpanded ? text.showLess : text.showMore}
        </Button>
      </div>
    </Card>
  );
};
