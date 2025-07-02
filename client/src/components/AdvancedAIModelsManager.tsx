import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AI_TOOLS_DATABASE, ToolsDatabase } from "@/data/aiToolsDatabase";
import { AiTool, AIModelIdentifier } from "@/types/aiTools";

interface ModelInfo {
  id: string;
  name: string;
  backend_identifier: AIModelIdentifier;
  size_gb: number;
  type: "diffusion" | "enhancement" | "segmentation" | "nlp" | "detection";
  description: string;
  status: "installed" | "downloading" | "available" | "error";
  downloadProgress?: number;
  performance: {
    speed: number;
    quality: number;
    reliability: number;
  };
  requirements: {
    gpu: boolean;
    minRam: string;
    minVram?: number;
    diskSpace: string;
  };
  usedByTools: {
    id: string;
    name_ar: string;
    name_en: string;
    category: string;
  }[];
  capabilities: string[];
  processing_time_range: string;
}

export function AdvancedAIModelsManager() {
  const getModelType = (identifier: AIModelIdentifier): ModelInfo["type"] => {
    switch (identifier) {
      case AIModelIdentifier.STABLE_DIFFUSION_XL:
      case AIModelIdentifier.STABLE_DIFFUSION_V21:
      case AIModelIdentifier.REALISTIC_VISION:
      case AIModelIdentifier.ANYTHING_V6:
      case AIModelIdentifier.CONTROLNET:
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
      case AIModelIdentifier.DEPTH_ESTIMATION:
        return "detection";
      case AIModelIdentifier.PHI3_VISION:
        return "nlp";
      default:
        return "enhancement";
    }
  };

  const getModelDescription = (identifier: AIModelIdentifier): string => {
    const descriptions: Record<AIModelIdentifier, string> = {
      [AIModelIdentifier.STABLE_DIFFUSION_XL]:
        "Advanced text-to-image generation",
      [AIModelIdentifier.STABLE_DIFFUSION_V21]: "High-quality image generation",
      [AIModelIdentifier.REALISTIC_VISION]: "Photorealistic image generation",
      [AIModelIdentifier.ANYTHING_V6]: "Anime style image generation",
      [AIModelIdentifier.REAL_ESRGAN]: "Super-resolution upscaling",
      [AIModelIdentifier.MODNET]: "Portrait background removal",
      [AIModelIdentifier.CLIP_SAM]: "Vision-language model",
      [AIModelIdentifier.CONTROLNET]: "Conditional generation control",
      [AIModelIdentifier.PHI3_VISION]: "Multi-modal AI model",
      [AIModelIdentifier.SEGMENT_ANYTHING]: "Universal segmentation",
      [AIModelIdentifier.GFPGAN]: "Face restoration model",
      [AIModelIdentifier.CODEFORMER]: "Robust face restoration",
      [AIModelIdentifier.PROMPT_TO_MASK]: "Text-guided masking",
      [AIModelIdentifier.REMBG]: "Background removal",
      [AIModelIdentifier.DEPTH_ESTIMATION]: "Depth estimation",
      [AIModelIdentifier.DEEPFACELAB_SAEHD]: "Advanced face swapping",
    };
    return descriptions[identifier] || "Advanced AI model";
  };

  const getRandomStatus = (): ModelInfo["status"] => {
    const statuses: ModelInfo["status"][] = [
      "installed",
      "available",
      "downloading",
    ];
    const weights = [0.6, 0.3, 0.1];
    const random = Math.random();

    if (random < weights[0]) return "installed";
    if (random < weights[0] + weights[1]) return "available";
    return "downloading";
  };

  // Generate models data from tools database
  const generateModelsFromDatabase = (): ModelInfo[] => {
    const modelsMap = new Map<AIModelIdentifier, ModelInfo>();

    AI_TOOLS_DATABASE.forEach((tool) => {
      const modelInfo = tool.model_info;
      const modelId = modelInfo.backend_identifier;

      if (!modelsMap.has(modelId)) {
        modelsMap.set(modelId, {
          id: modelId,
          name: modelInfo.name,
          backend_identifier: modelId,
          size_gb: modelInfo.size_gb,
          type: getModelType(modelId),
          description: getModelDescription(modelId),
          status: getRandomStatus(),
          performance: {
            speed: Math.floor(Math.random() * 30) + 70,
            quality: Math.floor(Math.random() * 20) + 80,
            reliability: Math.floor(Math.random() * 15) + 85,
          },
          requirements: {
            gpu: modelInfo.gpu_required,
            minRam: modelInfo.gpu_required ? "8GB" : "4GB",
            minVram: modelInfo.min_vram_gb,
            diskSpace: `${(modelInfo.size_gb * 1.2).toFixed(1)}GB`,
          },
          usedByTools: [],
          capabilities: [],
          processing_time_range: modelInfo.processing_time_secs,
        });
      }

      const model = modelsMap.get(modelId)!;
      model.usedByTools.push({
        id: tool.id,
        name_ar: tool.name_ar,
        name_en: tool.name_en,
        category: tool.category,
      });

      tool.features.forEach((feature) => {
        if (!model.capabilities.includes(feature.description_en)) {
          model.capabilities.push(feature.description_en);
        }
      });
    });

    return Array.from(modelsMap.values());
  };

  const [models, setModels] = useState<ModelInfo[]>(
    generateModelsFromDatabase(),
  );
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredModels = useMemo(() => {
    if (selectedType === "all") return models;
    return models.filter((model) => model.type === selectedType);
  }, [models, selectedType]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "diffusion":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      case "enhancement":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "segmentation":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "nlp":
        return "bg-orange-500/20 text-orange-400 border-orange-400/30";
      case "detection":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-400/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "installed":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "downloading":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "available":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  const handleDownload = (modelId: string) => {
    setModels(
      models.map((model) =>
        model.id === modelId
          ? { ...model, status: "downloading", downloadProgress: 0 }
          : model,
      ),
    );

    const interval = setInterval(() => {
      setModels((prevModels) => {
        const updatedModels = prevModels.map((model) => {
          if (model.id === modelId && model.status === "downloading") {
            const newProgress =
              (model.downloadProgress || 0) + Math.random() * 15;
            if (newProgress >= 100) {
              clearInterval(interval);
              return {
                ...model,
                status: "installed",
                downloadProgress: undefined,
              };
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
    setModels(
      models.map((model) =>
        model.id === modelId
          ? { ...model, status: "available", downloadProgress: undefined }
          : model,
      ),
    );
  };

  const installedModels = models.filter((m) => m.status === "installed");
  const availableModels = models.filter((m) => m.status === "available");
  const downloadingModels = models.filter((m) => m.status === "downloading");
  const totalSize = models.reduce((sum, model) => sum + model.size_gb, 0);
  const installedSize = installedModels.reduce(
    (sum, model) => sum + model.size_gb,
    0,
  );

  const modelTypes = [
    { id: "all", name: "All Models", count: models.length },
    {
      id: "diffusion",
      name: "Diffusion",
      count: models.filter((m) => m.type === "diffusion").length,
    },
    {
      id: "enhancement",
      name: "Enhancement",
      count: models.filter((m) => m.type === "enhancement").length,
    },
    {
      id: "segmentation",
      name: "Segmentation",
      count: models.filter((m) => m.type === "segmentation").length,
    },
    {
      id: "detection",
      name: "Detection",
      count: models.filter((m) => m.type === "detection").length,
    },
    {
      id: "nlp",
      name: "NLP",
      count: models.filter((m) => m.type === "nlp").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-strong p-6 border-cyan-400/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold neon-text text-cyan-400 mb-2">
              🧠 إدارة نماذج الذكاء الاصطناعي
            </h2>
            <p className="text-gray-300 text-sm">
              إدارة متقدمة لنماذج التعلم العميق | Advanced Deep Learning Models
              Management
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {installedModels.length}
              </div>
              <div className="text-gray-400">Installed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {availableModels.length}
              </div>
              <div className="text-gray-400">Available</div>
            </div>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Storage Usage</span>
            <span className="text-sm text-cyan-400">
              {installedSize.toFixed(1)} GB / {totalSize.toFixed(1)} GB
            </span>
          </div>
          <Progress value={(installedSize / totalSize) * 100} className="h-2" />
        </div>

        {/* Model Type Filters */}
        <div className="flex flex-wrap gap-2">
          {modelTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "outline"}
              onClick={() => setSelectedType(type.id)}
              className={`glass transition-all duration-300 ${
                selectedType === type.id
                  ? "bg-cyan-400/20 border-cyan-400/50 text-cyan-400"
                  : "border-gray-600/30 hover:border-cyan-400/30"
              }`}
              size="sm"
            >
              {type.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {type.count}
              </Badge>
            </Button>
          ))}
        </div>
      </Card>

      {/* Models Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <Card
            key={model.id}
            className="glass p-6 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-2">
                <Badge className={getTypeColor(model.type)} size="sm">
                  {model.type}
                </Badge>
                <Badge className={getStatusColor(model.status)} size="sm">
                  {model.status}
                </Badge>
              </div>
              <span className="text-xs text-gray-400">
                {model.size_gb.toFixed(1)} GB
              </span>
            </div>

            <h3 className="font-semibold text-white mb-2">{model.name}</h3>
            <p className="text-gray-300 text-sm mb-4">{model.description}</p>

            {model.status === "installed" && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Performance</span>
                  <span className="text-green-400">
                    {model.performance.speed}%
                  </span>
                </div>
                <Progress value={model.performance.speed} className="h-1" />
              </div>
            )}

            <div className="text-xs text-gray-400 mb-4">
              Used by {model.usedByTools.length} tools
            </div>

            <div className="flex gap-2">
              {model.status === "available" && (
                <Button
                  size="sm"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                  onClick={() => handleDownload(model.id)}
                >
                  Install
                </Button>
              )}

              {model.status === "installed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-400/30"
                  onClick={() => handleUninstall(model.id)}
                >
                  Remove
                </Button>
              )}

              {model.status === "downloading" && (
                <Button size="sm" disabled className="flex-1">
                  Downloading {model.downloadProgress?.toFixed(0)}%
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
