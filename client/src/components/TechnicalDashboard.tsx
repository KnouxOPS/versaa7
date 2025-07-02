import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModelStatus {
  name: string;
  version: string;
  status: "active" | "loading" | "inactive";
  memory: string;
  performance: number;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  gpu: number;
  inference_time: number;
  models_loaded: number;
}

export function TechnicalDashboard() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    gpu: 78,
    inference_time: 1.2,
    models_loaded: 8,
  });

  const [models] = useState<ModelStatus[]>([
    {
      name: "Stable Diffusion v2.1",
      version: "2.1.0",
      status: "active",
      memory: "4.2GB",
      performance: 95,
    },
    {
      name: "RealisticVision v5.1",
      version: "5.1.0",
      status: "active",
      memory: "3.8GB",
      performance: 92,
    },
    {
      name: "MODNet Background",
      version: "1.0.0",
      status: "active",
      memory: "512MB",
      performance: 98,
    },
    {
      name: "CLIP + SAM",
      version: "1.0.0",
      status: "loading",
      memory: "1.2GB",
      performance: 0,
    },
    {
      name: "Anything V6",
      version: "6.0.0",
      status: "inactive",
      memory: "0MB",
      performance: 0,
    },
    {
      name: "Prompt-to-Mask Adapter",
      version: "1.0.0",
      status: "active",
      memory: "256MB",
      performance: 94,
    },
  ]);

  const technicalModules = [
    {
      name: "Adaptive Brush Tool",
      description:
        "أداة تحرير تفاعلي ترتكز على توصيف لغوي لإعادة تشكيل المنطقة المحددة بصريًا",
      status: "operational",
      type: "core",
    },
    {
      name: "Super-Resolution AI",
      description:
        "تعزيز البنية التكسلية للصورة لتصل إلى 4K+ مع الحفاظ على استقرار الملامح",
      status: "operational",
      type: "enhancement",
    },
    {
      name: "Semantic Recoloring",
      description:
        "استبدال الألوان وفق مخطط دلالي يعتمد على التحليل النصي والسياقي للصورة",
      status: "operational",
      type: "semantic",
    },
    {
      name: "Generative Backgrounds",
      description:
        "توليد بيئات خلفية تركيبية باستخدام نماذج توليد مشروطة (Conditional GANs)",
      status: "operational",
      type: "generative",
    },
    {
      name: "Entity Removal & Swap",
      description:
        "تحليل وتمثيل الكيانات لحذفها أو استبدالها بمخرجات مولدة متوافقة دلاليًا",
      status: "operational",
      type: "semantic",
    },
    {
      name: "AutoMask AI Module",
      description:
        "يعتمد على Vision Transformers لتوليد أقنعة دلالية دقيقة للأجسام",
      status: "operational",
      type: "core",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        ...prev,
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(
          40,
          Math.min(85, prev.memory + (Math.random() - 0.5) * 5),
        ),
        gpu: Math.max(60, Math.min(95, prev.gpu + (Math.random() - 0.5) * 8)),
        inference_time: Math.max(
          0.5,
          Math.min(3.0, prev.inference_time + (Math.random() - 0.5) * 0.3),
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "active":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "loading":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-400/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "core":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-400/30";
      case "enhancement":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      case "semantic":
        return "bg-orange-500/20 text-orange-400 border-orange-400/30";
      case "generative":
        return "bg-pink-500/20 text-pink-400 border-pink-400/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* System Header */}
      <Card className="glass-strong rounded-3xl p-6 border-cyan-400/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold neon-text text-cyan-400 mb-2">
              🧠 KNOUX-VERSA Technical Console
            </h2>
            <p className="text-gray-300 text-sm">
              نظام متقدم لتحرير الصور المعتمد على الذكاء الاصطناعي | Advanced
              AI-Powered Image Processing System
            </p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-sm px-4 py-2">
            <span className="mr-2">🟢</span>
            System Operational
          </Badge>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass p-4 rounded-xl border-cyan-400/20">
            <div className="text-sm text-gray-400 mb-1">CPU Usage</div>
            <div className="text-xl font-bold text-cyan-400">
              {systemMetrics.cpu.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemMetrics.cpu}%` }}
              ></div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl border-purple-400/20">
            <div className="text-sm text-gray-400 mb-1">Memory</div>
            <div className="text-xl font-bold text-purple-400">
              {systemMetrics.memory.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemMetrics.memory}%` }}
              ></div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl border-green-400/20">
            <div className="text-sm text-gray-400 mb-1">GPU Load</div>
            <div className="text-xl font-bold text-green-400">
              {systemMetrics.gpu.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemMetrics.gpu}%` }}
              ></div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl border-yellow-400/20">
            <div className="text-sm text-gray-400 mb-1">Inference Time</div>
            <div className="text-xl font-bold text-yellow-400">
              {systemMetrics.inference_time.toFixed(2)}s
            </div>
            <div className="text-xs text-gray-400 mt-1">Average Response</div>
          </div>

          <div className="glass p-4 rounded-xl border-orange-400/20">
            <div className="text-sm text-gray-400 mb-1">Active Models</div>
            <div className="text-xl font-bold text-orange-400">
              {systemMetrics.models_loaded}/12
            </div>
            <div className="text-xs text-gray-400 mt-1">Models Loaded</div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass rounded-2xl p-1">
          <TabsTrigger
            value="modules"
            className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400"
          >
            <i className="fas fa-cogs mr-2"></i>
            Technical Modules
          </TabsTrigger>
          <TabsTrigger
            value="models"
            className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-purple-400"
          >
            <i className="fas fa-brain mr-2"></i>
            AI Models Status
          </TabsTrigger>
          <TabsTrigger
            value="architecture"
            className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400"
          >
            <i className="fas fa-project-diagram mr-2"></i>
            System Architecture
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalModules.map((module, index) => (
              <Card
                key={index}
                className="glass p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {module.name}
                  </h3>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(module.status)} size="sm">
                      {module.status}
                    </Badge>
                    <Badge className={getTypeColor(module.type)} size="sm">
                      {module.type}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {module.description}
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <div className="space-y-4">
            {models.map((model, index) => (
              <Card key={index} className="glass p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{model.name}</h3>
                      <Badge
                        className="bg-gray-500/20 text-gray-300 border-gray-400/30"
                        size="sm"
                      >
                        v{model.version}
                      </Badge>
                      <Badge className={getStatusColor(model.status)} size="sm">
                        {model.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span>
                        Memory:{" "}
                        <span className="text-cyan-400">{model.memory}</span>
                      </span>
                      {model.performance > 0 && (
                        <span>
                          Performance:{" "}
                          <span className="text-green-400">
                            {model.performance}%
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-400/30 hover:bg-cyan-400/10"
                      disabled={model.status === "loading"}
                    >
                      {model.status === "inactive"
                        ? "Load"
                        : model.status === "loading"
                          ? "Loading..."
                          : "Reload"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-400/30 hover:bg-red-400/10"
                      disabled={model.status === "inactive"}
                    >
                      Unload
                    </Button>
                  </div>
                </div>
                {model.performance > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${model.performance}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="mt-6">
          <Card className="glass p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              🏗️ System Architecture Overview
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-400">
                    🧠 AI Processing Pipeline
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span>Prompt Adapter → Language Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>AutoMask AI → Vision Transformers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Model Loader → Hot-Swap Engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>IntelliFix → Denoising Autoencoders</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-400">
                    ⚙️ System Components
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>React Frontend → Glassmorphism UI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Express Backend → Local Inference</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>CUDA Acceleration → GPU Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span>Local Storage → Zero Network Dependency</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/30">
                <h4 className="font-semibold text-cyan-400 mb-2">
                  🔒 Privacy & Security Features
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-400 font-semibold">
                      100% Local Processing
                    </span>
                    <p className="text-gray-300">No data leaves your device</p>
                  </div>
                  <div>
                    <span className="text-green-400 font-semibold">
                      Zero Network Dependency
                    </span>
                    <p className="text-gray-300">Fully offline operation</p>
                  </div>
                  <div>
                    <span className="text-green-400 font-semibold">
                      No Tracking
                    </span>
                    <p className="text-gray-300">Clean output files</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
