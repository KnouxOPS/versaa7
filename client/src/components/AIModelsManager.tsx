import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AI_TOOLS_DATABASE, ToolsDatabase } from "@/data/aiToolsDatabase";
import { AiTool, AIModelIdentifier } from "@/types/aiTools";

interface AIModel {
  id: string;
  name: string;
  version: string;
  type: "diffusion" | "enhancement" | "segmentation" | "nlp" | "detection";
  size: number; // in GB
  description: string;
  capabilities: string[];
  status: "installed" | "downloading" | "available" | "error";
  downloadProgress?: number;
  performance: {
    speed: number;
    quality: number;
    memoryUsage: string;
  };
  requirements: {
    gpu: boolean;
    minRam: string;
    minVram?: number;
    diskSpace: string;
  };
  usedByTools: string[]; // Which tools use this model
  backend_identifier: AIModelIdentifier;
}

export function AIModelsManager() {
  // Generate unique models from tools database
  const generateModelsFromTools = (): AIModel[] => {
    const uniqueModels = new Map<AIModelIdentifier, AIModel>();

    AI_TOOLS_DATABASE.forEach(tool => {
      const modelInfo = tool.model_info;
      const modelId = modelInfo.backend_identifier;

      if (!uniqueModels.has(modelId)) {
        uniqueModels.set(modelId, {
          id: modelId,
          name: modelInfo.name,
          version: "1.0.0", // Default version
          type: getModelType(modelId),
          size: modelInfo.size_gb,
          description: `Neural model used by ${tool.name_ar}`,
          capabilities: tool.features.map(f => f.description_en),
          status: Math.random() > 0.3 ? "installed" : "available", // Random status for demo
          performance: {
            speed: Math.floor(Math.random() * 30) + 70,
            quality: Math.floor(Math.random() * 20) + 80,
            memoryUsage: `${modelInfo.size_gb.toFixed(1)}GB`
          },
          requirements: {
            gpu: modelInfo.gpu_required,
            minRam: modelInfo.gpu_required ? "8GB" : "4GB",
            minVram: modelInfo.min_vram_gb,
            diskSpace: `${(modelInfo.size_gb * 1.2).toFixed(1)}GB`
          },
          usedByTools: [],
          backend_identifier: modelId
        });
      }

      // Add tool to the usedByTools list
      const model = uniqueModels.get(modelId)!;
      model.usedByTools.push(tool.name_en);
    });

    return Array.from(uniqueModels.values());
  };

  const getModelType = (identifier: AIModelIdentifier): AIModel['type'] => {
    switch (identifier) {
      case AIModelIdentifier.STABLE_DIFFUSION_XL:
      case AIModelIdentifier.STABLE_DIFFUSION_V21:
      case AIModelIdentifier.REALISTIC_VISION:
      case AIModelIdentifier.ANYTHING_V6:
        return "diffusion";
      case AIModelIdentifier.REAL_ESRGAN:
      case AIModelIdentifier.GFPGAN:
      case AIModelIdentifier.CODEFORMER:
        return "enhancement";
      case AIModelIdentifier.MODNET:
      case AIModelIdentifier.SEGMENT_ANYTHING:
      case AIModelIdentifier.REMBG:
        return "segmentation";
      case AIModelIdentifier.CLIP_SAM:
      case AIModelIdentifier.PROMPT_TO_MASK:
        return "detection";
      case AIModelIdentifier.PHI3_VISION:
        return "nlp";
      default:
        return "enhancement";
    }
  };

  const [models, setModels] = useState<AIModel[]>(generateModelsFromTools());
    {
      id: "rv51",
      name: "RealisticVision v5.1",
      version: "5.1.0",
      type: "diffusion",
      size: "3.8 GB",
      description: "إخراج فائق الواقعية للوجوه والأشخاص",
      capabilities: ["Photorealistic", "Portrait", "High-Detail"],
      status: "installed",
      performance: { speed: 92, quality: 96, memoryUsage: "3.8GB" },
      requirements: { gpu: true, minRam: "6GB", diskSpace: "4GB" }
    },
    {
      id: "anything6",
      name: "Anything V6",
      version: "6.0.0",
      type: "diffusion",
      size: "4.1 GB",
      description: "إنتاج أنماط رسومية يابانية/أنمي متقدمة",
      capabilities: ["Anime Style", "Illustration", "Character Design"],
      status: "available",
      performance: { speed: 90, quality: 94, memoryUsage: "0GB" },
      requirements: { gpu: true, minRam: "6GB", diskSpace: "5GB" }
    },
    {
      id: "modnet",
      name: "MODNet Background Remover",
      version: "1.0.0",
      type: "segmentation",
      size: "512 MB",
      description: "إزالة خلفيات مع الحفاظ على حواف دقيقة",
      capabilities: ["Background Removal", "Edge Preservation", "Real-time"],
      status: "installed",
      performance: { speed: 98, quality: 95, memoryUsage: "512MB" },
      requirements: { gpu: false, minRam: "4GB", diskSpace: "1GB" }
    },
    {
      id: "clip-sam",
      name: "CLIP + SAM",
      version: "1.0.0",
      type: "detection",
      size: "1.2 GB",
      description: "الربط بين النص والكيانات البصرية للتحديد الدقيق",
      capabilities: ["Object Detection", "Semantic Segmentation", "Text-Image Matching"],
      status: "downloading",
      downloadProgress: 67,
      performance: { speed: 85, quality: 92, memoryUsage: "1.2GB" },
      requirements: { gpu: true, minRam: "6GB", diskSpace: "2GB" }
    },
    {
      id: "superres",
      name: "Real-ESRGAN 4x",
      version: "2.0.0",
      type: "enhancement",
      size: "256 MB",
      description: "تعزيز البنية التكسلية للصورة لتصل إلى 4K+",
      capabilities: ["4x Upscaling", "Noise Reduction", "Detail Enhancement"],
      status: "available",
      performance: { speed: 88, quality: 96, memoryUsage: "0GB" },
      requirements: { gpu: true, minRam: "4GB", diskSpace: "512MB" }
    },
    {
      id: "prompt-adapter",
      name: "Prompt-to-Mask Adapter",
      version: "1.0.0",
      type: "nlp",
      size: "128 MB",
      description: "تحويل الأوامر النصية إلى أقنعة موجهة بدقة عالية",
      capabilities: ["Text Analysis", "Mask Generation", "Arabic Support"],
      status: "installed",
      performance: { speed: 94, quality: 88, memoryUsage: "128MB" },
      requirements: { gpu: false, minRam: "2GB", diskSpace: "256MB" }
    },
    {
      id: "controlnet",
      name: "ControlNet Suite",
      version: "1.1.0",
      type: "diffusion",
      size: "2.4 GB",
      description: "تحكم دقيق في التوليد باستخدام خرائط التحكم",
      capabilities: ["Pose Control", "Edge Control", "Depth Control", "Canny Edge"],
      status: "available",
      performance: { speed: 80, quality: 97, memoryUsage: "0GB" },
      requirements: { gpu: true, minRam: "8GB", diskSpace: "3GB" }
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "diffusion": return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      case "enhancement": return "bg-green-500/20 text-green-400 border-green-400/30";
      case "segmentation": return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "nlp": return "bg-orange-500/20 text-orange-400 border-orange-400/30";
      case "detection": return "bg-cyan-500/20 text-cyan-400 border-cyan-400/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "installed": return "bg-green-500/20 text-green-400 border-green-400/30";
      case "downloading": return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "available": return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "error": return "bg-red-500/20 text-red-400 border-red-400/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  const handleDownload = (modelId: string) => {
    setModels(models.map(model =>
      model.id === modelId
        ? { ...model, status: "downloading", downloadProgress: 0 }
        : model
    ));

    // Simulate download progress
    const interval = setInterval(() => {
      setModels(prevModels => {
        const updatedModels = prevModels.map(model => {
          if (model.id === modelId && model.status === "downloading") {
            const newProgress = (model.downloadProgress || 0) + Math.random() * 15;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...model, status: "installed", downloadProgress: undefined };
            }
            return { ...model, downloadProgress: newProgress };
          }
          return model;
        });
        return updatedModels;
      });
    }, 500);
  };

  const handleUninstall = (modelId: string) => {
    setModels(models.map(model =>
      model.id === modelId
        ? { ...model, status: "available" }
        : model
    ));
  };

  const installedModels = models.filter(m => m.status === "installed");
  const availableModels = models.filter(m => m.status === "available");
  const downloadingModels = models.filter(m => m.status === "downloading");

  return (
    <div className="space-y-6">
      <Card className="glass-strong p-6 border-cyan-400/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold neon-text text-cyan-400 mb-2">
              🧠 AI Models Manager
            </h2>
            <p className="text-gray-300 text-sm">
              إدارة وتحميل النماذج التوليدية المتقدمة | Advanced AI Models Management
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{installedModels.length}</div>
              <div className="text-gray-400">Installed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{availableModels.length}</div>
              <div className="text-gray-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{downloadingModels.length}</div>
              <div className="text-gray-400">Downloading</div>
            </div>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Storage Usage</span>
            <span className="text-sm text-cyan-400">
              {installedModels.reduce((total, model) => total + parseFloat(model.size), 0).toFixed(1)} GB / 50 GB
            </span>
          </div>
          <Progress
            value={(installedModels.reduce((total, model) => total + parseFloat(model.size), 0) / 50) * 100}
            className="h-2"
          />
        </div>
      </Card>

      {/* Active Downloads */}
      {downloadingModels.length > 0 && (
        <Card className="glass p-6 border-yellow-400/30">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">
            <i className="fas fa-download mr-2"></i>
            Active Downloads
          </h3>
          <div className="space-y-4">
            {downloadingModels.map((model) => (
              <div key={model.id} className="glass p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{model.name}</span>
                  <span className="text-sm text-gray-400">{model.downloadProgress?.toFixed(1)}%</span>
                </div>
                <Progress value={model.downloadProgress || 0} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Models Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="glass p-6 hover:bg-white/10 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-2">
                <Badge className={getTypeColor(model.type)} size="sm">
                  {model.type}
                </Badge>
                <Badge className={getStatusColor(model.status)} size="sm">
                  {model.status}
                </Badge>
              </div>
              <span className="text-xs text-gray-400">{model.size}</span>
            </div>

            <h3 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {model.name}
            </h3>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {model.description}
            </p>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-1 mb-4">
              {model.capabilities.map((capability, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs bg-gray-600/20 text-gray-300 border-gray-500/30"
                >
                  {capability}
                </Badge>
              ))}
            </div>

            {/* Performance Metrics */}
            {model.status === "installed" && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Speed</span>
                  <span className="text-green-400">{model.performance.speed}%</span>
                </div>
                <Progress value={model.performance.speed} className="h-1" />

                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Quality</span>
                  <span className="text-purple-400">{model.performance.quality}%</span>
                </div>
                <Progress value={model.performance.quality} className="h-1" />
              </div>
            )}

            {/* Requirements */}
            <div className="text-xs text-gray-400 mb-4 space-y-1">
              <div className="flex items-center gap-2">
                <i className={`fas ${model.requirements.gpu ? 'fa-microchip text-green-400' : 'fa-microchip text-gray-500'}`}></i>
                <span>GPU: {model.requirements.gpu ? 'Required' : 'Optional'}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-memory text-blue-400"></i>
                <span>RAM: {model.requirements.minRam}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-hdd text-orange-400"></i>
                <span>Disk: {model.requirements.diskSpace}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {model.status === "available" && (
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  onClick={() => handleDownload(model.id)}
                >
                  <i className="fas fa-download mr-2"></i>
                  Install
                </Button>
              )}

              {model.status === "installed" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cyan-400/30 hover:bg-cyan-400/10"
                  >
                    <i className="fas fa-cog mr-2"></i>
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-400/30 hover:bg-red-400/10"
                    onClick={() => handleUninstall(model.id)}
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Remove
                  </Button>
                </>
              )}

              {model.status === "downloading" && (
                <Button
                  size="sm"
                  disabled
                  className="flex-1"
                >
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Downloading...
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}