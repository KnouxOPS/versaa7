import { useState, useEffect } from "react";
import { NeuralBackground } from "@/components/NeuralBackground";
import { SimpleImageCanvas } from "@/components/SimpleImageCanvas";
import { ServicesLayout } from "@/components/ServicesLayout";
import { AdvancedLocalAITools } from "@/components/AdvancedLocalAITools";
import { MainImageEditor } from "@/components/MainImageEditor";
import { PromptNexus } from "@/components/PromptNexus";
import { ProcessingModal } from "@/components/ProcessingModal";
import { ResultsComparison } from "@/components/ResultsComparison";
import { VIPModal } from "@/components/VIPModal";
import { TechnicalDashboard } from "@/components/TechnicalDashboard";
import { AdvancedAIModelsManager } from "@/components/AdvancedAIModelsManager";
import { ComprehensiveModelManager } from "@/components/ComprehensiveModelManager";
import { KnouxControlRoom } from "@/components/ControlRoom/KnouxControlRoom";
import LiveNowPanel from "@/components/LiveNowPanel";
import { useLanguage } from "@/hooks/useLanguage";
import { useImageTransform } from "@/hooks/useImageTransform";
import { processImageLocally } from "@/lib/localAIProcessor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

export default function Home() {
  const { t, currentLanguage, toggleLanguage } = useLanguage();
  const [selectedService, setSelectedService] = useState("magic-morph");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectionData, setSelectionData] = useState<string | null>(null);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [vipSession, setVipSession] = useState<string | null>(null);
  const [serviceCustomizations, setServiceCustomizations] = useState<
    Record<string, any>
  >({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLocalProcessing, setIsLocalProcessing] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [localMessage, setLocalMessage] = useState("");
  const [showControlRoom, setShowControlRoom] = useState(false);

  // Live Now Panel state
  const [liveStatus, setLiveStatus] = useState<"Running" | "Paused" | "Error">(
    "Running",
  );
  const [currentTool, setCurrentTool] = useState("Knoux VERSA");
  const [currentModel, setCurrentModel] = useState("SDXL Turbo");

  // System stats
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 27,
    ramUsage: 74,
    gpuUsage: 72,
    activeTools: 30,
    activeUsers: 1247,
    processedImages: 45892,
    uptime: "99.9%",
    networkStatus: "Connected",
  });

  const {
    transform,
    isProcessing,
    result,
    progress,
    processingMessage,
    error,
    reset,
    setResult,
    setError,
  } = useImageTransform();

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    reset();
  };

  const handleSelectionChange = (selection: string) => {
    setSelectionData(selection);
  };

  const handleTransform = async (prompt: string, quality: string) => {
    if (!uploadedImage || !prompt.trim()) {
      return;
    }

    const isVIP = selectedService === "vip-magic";
    if (isVIP && !vipSession) {
      setShowVIPModal(true);
      return;
    }

    const localTools = [
      "face_swap",
      "beauty_filter",
      "face_expression",
      "age_transform",
      "gender_swap",
      "makeup_artist",
      "body_reshape",
      "hair_color",
      "eye_color",
      "smile_enhance",
      "skin_smooth",
      "face_slim",
      "nose_reshape",
      "lip_enhance",
      "magic-morph",
    ];

    if (localTools.includes(selectedService)) {
      try {
        setIsLocalProcessing(true);
        setLocalProgress(0);
        setLocalMessage("تحضير النموذج المحلي...");

        const result = await processImageLocally({
          imageUrl: uploadedImage,
          tool: selectedService,
          prompt,
          quality,
          onProgress: (progress, message) => {
            setLocalProgress(progress);
            setLocalMessage(message);
          },
        });

        if (result.success && result.processedImageUrl) {
          const mockTransformation = {
            id: Date.now().toString(),
            originalImageUrl: uploadedImage,
            transformedImageUrl: result.processedImageUrl,
            prompt,
            service: selectedService,
            quality,
            isVIP: false,
            createdAt: new Date(),
            processingTime: result.processingTime,
            metadata: result.metadata,
          };

          setResult(mockTransformation);
          setLocalMessage("تمت المعالجة بنجاح! ✨");

          setTimeout(() => {
            setIsLocalProcessing(false);
          }, 1000);
        } else {
          throw new Error(result.error || "فشلت المعالجة المحلية");
        }
      } catch (error) {
        console.error("خطأ في المعالجة المحلية:", error);
        setError(
          error instanceof Error ? error.message : "خطأ في المعالجة المحلية",
        );
        setIsLocalProcessing(false);
      }
    } else {
      await transform({
        originalImageUrl: uploadedImage,
        prompt,
        service: selectedService,
        selectionData,
        quality,
        isVIP,
        vipSession,
      });
    }
  };

  const handleVIPAccess = (sessionKey: string) => {
    setVipSession(sessionKey);
    setShowVIPModal(false);
  };

  const handleCustomizationChange = (
    serviceId: string,
    customizations: Record<string, any>,
  ) => {
    setServiceCustomizations((prev) => ({
      ...prev,
      [serviceId]: customizations,
    }));
  };

  // Sync LiveNowPanel with processing state
  useEffect(() => {
    if (isProcessing || isLocalProcessing) {
      setLiveStatus("Running");
      setCurrentModel(
        selectedService === "magic-morph" ? "SDXL Turbo" : "Stable Diffusion",
      );
    } else if (error) {
      setLiveStatus("Error");
    } else {
      setLiveStatus("Paused");
    }
  }, [isProcessing, isLocalProcessing, error, selectedService]);

  // Update system stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 30 + 20),
        ramUsage: Math.floor(Math.random() * 40 + 40),
        gpuUsage: Math.floor(Math.random() * 60 + 20),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Electron API integration
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).electronAPI) {
      const electronAPI = (window as any).electronAPI;

      electronAPI.onNewTransformation(() => {
        reset();
        setUploadedImage(null);
        setSelectionData(null);
      });

      electronAPI.onOpenImage((filePath: string) => {
        const fileUrl = `file://${filePath}`;
        setUploadedImage(fileUrl);
      });

      electronAPI.onSelectService((serviceId: string) => {
        setSelectedService(serviceId);
        setActiveTab("workspace");
      });

      electronAPI.onVipRequest(() => {
        setShowVIPModal(true);
      });

      return () => {
        electronAPI.removeAllListeners("new-transformation");
        electronAPI.removeAllListeners("open-image");
        electronAPI.removeAllListeners("select-service");
        electronAPI.removeAllListeners("vip-request");
      };
    }
  }, [reset]);

  const quickActions = [
    {
      id: "upload",
      icon: "fa-upload",
      label: "رفع صورة",
      color: "cyan",
      action: () => setActiveTab("workspace"),
    },
    {
      id: "ai-tools",
      icon: "fa-robot",
      label: "أدوات AI",
      color: "purple",
      action: () => setActiveTab("ai-tools"),
    },
    {
      id: "control",
      icon: "fa-cogs",
      label: "غرفة التحكم",
      color: "orange",
      action: () => setShowControlRoom(true),
    },
    {
      id: "models",
      icon: "fa-brain",
      label: "النماذج",
      color: "green",
      action: () => setActiveTab("models"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <NeuralBackground />

      {/* Advanced Header */}
      <header className="relative z-50 glass-strong border-b border-cyan-400/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Section */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 animate-pulse-glow group-hover:scale-110 transition-transform">
                  <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-400 animate-neon-text">
                      K
                    </span>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-cyan-400/20 rounded-full blur-xl animate-pulse opacity-50"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shift">
                  KNOUX VERSA
                </h1>
                <p className="text-sm text-gray-400">The Uncensored AI Nexus</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-xs text-green-400">
                    v2.0.0 • {systemStats.networkStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Central Live Panel */}
            <div className="flex-1 flex justify-center px-8">
              <LiveNowPanel
                tool={currentTool}
                model={currentModel}
                privacy="No Censorship"
                status={liveStatus}
                onStop={() => {
                  setLiveStatus("Paused");
                  console.log("تم إيقاف المهمة");
                }}
                onSwitch={() => {
                  setCurrentTool(
                    currentTool === "Knoux VERSA"
                      ? "Face Morph"
                      : "Knoux VERSA",
                  );
                  console.log("تم تبديل الأداة");
                }}
                onShowLogs={() => {
                  alert(
                    "فتح سجل النشاط...\n\n🧠 AI Inference Engine\n⚡ Processing Speed: 2.3s\n🔒 Privacy: Maximum\n📊 Success Rate: 98.7%",
                  );
                }}
                className="max-w-md"
              />
            </div>

            {/* Control Panel */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 mr-4">
                <div className="text-xs text-gray-400">
                  <div>
                    CPU:{" "}
                    <span className="text-cyan-400">
                      {systemStats.cpuUsage}%
                    </span>
                  </div>
                  <div>
                    GPU:{" "}
                    <span className="text-purple-400">
                      {systemStats.gpuUsage}%
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControlRoom(true)}
                className="glass border-orange-400/30 hover:bg-orange-400/10 text-orange-400 hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]"
              >
                <i className="fas fa-cogs mr-2"></i>
                <span className="hidden lg:inline">
                  {currentLanguage === "en" ? "Control Room" : "غرفة التحكم"}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="glass border-cyan-400/30 hover:bg-cyan-400/10 text-cyan-400"
              >
                <i className="fas fa-globe mr-2"></i>
                <span className="hidden lg:inline">
                  {currentLanguage === "en" ? "العربية" : "English"}
                </span>
              </Button>

              <Link href="/about">
                <Button
                  variant="outline"
                  size="sm"
                  className="glass border-purple-400/30 hover:bg-purple-400/10 text-purple-400"
                >
                  <i className="fas fa-info-circle mr-2"></i>
                  <span className="hidden lg:inline">{t("About")}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="container mx-auto px-6 py-6 h-[calc(100vh-120px)]">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Left Sidebar - Quick Actions & Stats */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <Card className="glass-strong p-6 border border-cyan-400/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-bolt text-cyan-400"></i>
                إجراءات سريعة
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    onClick={action.action}
                    className={`w-full justify-start gap-3 glass border-${action.color}-400/30 hover:bg-${action.color}-400/10 text-${action.color}-400 h-12`}
                    variant="outline"
                  >
                    <i className={`fas ${action.icon}`}></i>
                    <span className="hidden lg:inline">{action.label}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* System Status */}
            <Card className="glass-strong p-6 border border-green-400/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-chart-line text-green-400"></i>
                حالة النظام
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">CPU</span>
                    <span className="text-cyan-400">
                      {systemStats.cpuUsage}%
                    </span>
                  </div>
                  <Progress
                    value={systemStats.cpuUsage}
                    className="h-2 bg-gray-700"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">RAM</span>
                    <span className="text-purple-400">
                      {systemStats.ramUsage}%
                    </span>
                  </div>
                  <Progress
                    value={systemStats.ramUsage}
                    className="h-2 bg-gray-700"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">GPU</span>
                    <span className="text-orange-400">
                      {systemStats.gpuUsage}%
                    </span>
                  </div>
                  <Progress
                    value={systemStats.gpuUsage}
                    className="h-2 bg-gray-700"
                  />
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-strong p-6 border border-purple-400/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-chart-bar text-purple-400"></i>
                إحصائيات سريعة
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">أدوات AI نشطة</span>
                  <span className="text-cyan-400 font-bold">
                    {systemStats.activeTools}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">مستخدمين نشطين</span>
                  <span className="text-green-400 font-bold">
                    {systemStats.activeUsers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">صور معالجة</span>
                  <span className="text-purple-400 font-bold">
                    {systemStats.processedImages.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">وقت التشغيل</span>
                  <span className="text-pink-400 font-bold">
                    {systemStats.uptime}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              {/* Enhanced Tabs */}
              <TabsList className="glass-strong rounded-2xl p-2 mb-6 border border-cyan-400/30 grid grid-cols-5 h-14">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_20px_rgba(0,255,239,0.2)] transition-all duration-300 rounded-xl"
                >
                  <i className="fas fa-tachometer-alt mr-2"></i>
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ai-tools"
                  className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-purple-400 data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 rounded-xl"
                >
                  <i className="fas fa-robot mr-2"></i>
                  <span className="hidden sm:inline">أدوات AI</span>
                </TabsTrigger>
                <TabsTrigger
                  value="workspace"
                  className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400 data-[state=active]:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300 rounded-xl"
                >
                  <i className="fas fa-magic mr-2"></i>
                  <span className="hidden sm:inline">ورشة العمل</span>
                </TabsTrigger>
                <TabsTrigger
                  value="models"
                  className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400 data-[state=active]:shadow-[0_0_20px_rgba(251,146,60,0.2)] transition-all duration-300 rounded-xl"
                >
                  <i className="fas fa-brain mr-2"></i>
                  <span className="hidden sm:inline">النماذج</span>
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-blue-400/20 data-[state=active]:text-blue-400 data-[state=active]:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 rounded-xl"
                >
                  <i className="fas fa-cloud mr-2"></i>
                  <span className="hidden sm:inline">السحابة</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab Contents */}
              <div className="flex-1 overflow-hidden">
                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="h-full mt-0">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                    {/* Welcome Panel */}
                    <div className="xl:col-span-2">
                      <Card className="glass-strong border border-cyan-400/30 h-full">
                        <div className="p-8 text-center h-full flex flex-col justify-center">
                          <div className="mb-8">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                              مرحباً بك في عالم الذكاء الاصطناعي
                            </h2>
                            <p className="text-xl text-gray-300 mb-6">
                              30 أداة ذكاء اصطناعي • خصوصية كاملة • بلا رقابة
                            </p>
                          </div>

                          {/* Feature Highlights */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="glass p-4 rounded-xl border border-cyan-400/30">
                              <i className="fas fa-shield-alt text-3xl text-cyan-400 mb-2"></i>
                              <h3 className="font-bold text-white mb-1">
                                خصوصية كاملة
                              </h3>
                              <p className="text-sm text-gray-400">
                                معالجة محلية 100%
                              </p>
                            </div>
                            <div className="glass p-4 rounded-xl border border-purple-400/30">
                              <i className="fas fa-rocket text-3xl text-purple-400 mb-2"></i>
                              <h3 className="font-bold text-white mb-1">
                                سرعة فائقة
                              </h3>
                              <p className="text-sm text-gray-400">
                                معالجة AI متقدمة
                              </p>
                            </div>
                            <div className="glass p-4 rounded-xl border border-green-400/30">
                              <i className="fas fa-infinity text-3xl text-green-400 mb-2"></i>
                              <h3 className="font-bold text-white mb-1">
                                بلا حدود
                              </h3>
                              <p className="text-sm text-gray-400">
                                حرية إبداعية كاملة
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={() => setActiveTab("workspace")}
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                          >
                            <i className="fas fa-play mr-2"></i>
                            ابدأ الآن
                          </Button>
                        </div>
                      </Card>
                    </div>

                    {/* Activity Panel */}
                    <div className="space-y-6">
                      <Card className="glass-strong p-6 border border-green-400/30">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <i className="fas fa-history text-green-400"></i>
                          النشاط الأخير
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 glass rounded-lg">
                            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                            <div className="flex-1">
                              <p className="text-sm text-white">
                                تم تحميل النموذج SDXL
                              </p>
                              <p className="text-xs text-gray-400">
                                قبل دقيقتين
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 glass rounded-lg">
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <div className="flex-1">
                              <p className="text-sm text-white">
                                معالجة صورة بنجاح
                              </p>
                              <p className="text-xs text-gray-400">
                                قبل 5 دقائق
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 glass rounded-lg">
                            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                            <div className="flex-1">
                              <p className="text-sm text-white">تحديث النظام</p>
                              <p className="text-xs text-gray-400">قبل ساعة</p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="glass-strong p-6 border border-blue-400/30">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <i className="fas fa-fire text-blue-400"></i>
                          الأدوات الأكثر استخداماً
                        </h3>
                        <div className="space-y-3">
                          {[
                            { name: "Face Swap", usage: 85, color: "cyan" },
                            {
                              name: "Style Transfer",
                              usage: 72,
                              color: "purple",
                            },
                            {
                              name: "Background Replace",
                              usage: 68,
                              color: "green",
                            },
                          ].map((tool, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">
                                  {tool.name}
                                </span>
                                <span className={`text-${tool.color}-400`}>
                                  {tool.usage}%
                                </span>
                              </div>
                              <Progress
                                value={tool.usage}
                                className="h-2 bg-gray-700"
                              />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* AI Tools Tab */}
                <TabsContent value="ai-tools" className="h-full mt-0">
                  <Card className="glass-strong rounded-2xl border border-purple-400/30 h-full overflow-hidden">
                    <MainImageEditor />
                  </Card>
                </TabsContent>

                {/* Workspace Tab */}
                <TabsContent value="workspace" className="h-full mt-0">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                    <div className="xl:col-span-2">
                      <Card className="glass-strong rounded-2xl border border-green-400/30 h-full overflow-hidden">
                        <div className="p-6 h-full">
                          <SimpleImageCanvas
                            onImageUpload={handleImageUpload}
                            onSelectionChange={handleSelectionChange}
                            uploadedImage={uploadedImage}
                          />
                        </div>
                      </Card>
                    </div>

                    <div className="space-y-6 flex flex-col h-full">
                      <Card className="glass-strong rounded-2xl border border-green-400/30 flex-1">
                        <div className="p-6 h-full">
                          <PromptNexus
                            onTransform={handleTransform}
                            isProcessing={isProcessing || isLocalProcessing}
                            selectedService={selectedService}
                            customizations={
                              serviceCustomizations[selectedService]
                            }
                          />
                        </div>
                      </Card>

                      {result && (
                        <Card className="glass-strong rounded-2xl border border-green-400/30 flex-1">
                          <div className="p-6 h-full">
                            <ResultsComparison
                              transformation={result}
                              onNewTransform={reset}
                            />
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Models Tab */}
                <TabsContent value="models" className="h-full mt-0">
                  <Card className="glass-strong rounded-2xl border border-orange-400/30 h-full overflow-hidden">
                    <div className="p-6 h-full">
                      <ComprehensiveModelManager />
                    </div>
                  </Card>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="h-full mt-0">
                  <Card className="glass-strong rounded-2xl border border-blue-400/30 h-full overflow-hidden">
                    <ServicesLayout
                      selectedService={selectedService}
                      onServiceChange={setSelectedService}
                      customizations={serviceCustomizations}
                      onCustomizationChange={handleCustomizationChange}
                    />
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Modals */}
      {(isProcessing || isLocalProcessing) && (
        <ProcessingModal
          progress={isLocalProcessing ? localProgress : progress}
          message={isLocalProcessing ? localMessage : processingMessage}
          isLocal={isLocalProcessing}
        />
      )}

      {showVIPModal && (
        <VIPModal
          isOpen={showVIPModal}
          onClose={() => setShowVIPModal(false)}
          onVIPAccess={handleVIPAccess}
        />
      )}

      {showControlRoom && (
        <KnouxControlRoom
          isOpen={showControlRoom}
          onClose={() => setShowControlRoom(false)}
        />
      )}
    </div>
  );
}
