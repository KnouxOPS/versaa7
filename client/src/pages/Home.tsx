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
  const [activeTab, setActiveTab] = useState("local_ai");
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

  // Statistics
  const [stats, setStats] = useState({
    totalTools: 30,
    activeUsers: 1247,
    processedImages: 45892,
    uptime: "99.9%",
  });

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

    // قائمة الأدوات المحلية
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

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <NeuralBackground />

      {/* Navigation Bar */}
      <nav className="glass-strong fixed top-0 left-0 right-0 z-50 border-b border-cyan-400/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 animate-pulse-glow">
                  <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-400 animate-neon-text">
                      K
                    </span>
                  </div>
                </div>
                <div className="absolute -inset-2 bg-cyan-400/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  KNOUX VERSA
                </h1>
                <p className="text-xs text-gray-400">
                  {t("The Uncensored AI Nexus")}
                </p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControlRoom(true)}
                className="glass border-orange-400/30 hover:bg-orange-400/10 text-orange-400 hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]"
              >
                <i className="fas fa-cogs mr-2"></i>
                {currentLanguage === "en" ? "Control Room" : "غرفة التحكم"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="glass border-cyan-400/30 hover:bg-cyan-400/10 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,239,0.3)]"
              >
                <i className="fas fa-globe mr-2"></i>
                {currentLanguage === "en" ? "العربية" : "English"}
              </Button>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="sm"
                  className="glass border-purple-400/30 hover:bg-purple-400/10 text-purple-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  <i className="fas fa-info-circle mr-2"></i>
                  {t("About")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Section */}
          <section className="py-20 text-center relative">
            {/* Floating Live Panel */}
            <div className="fixed top-24 left-6 z-40 hidden lg:block">
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
              />
            </div>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shift">
                🧠 {t("30 أداة ذكاء اصطناعي")}
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                {t("خصوصية كاملة • بلا رقابة • معالجة محلية متقدمة")}
              </p>

              {/* Feature Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge className="glass px-6 py-3 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
                  <i className="fas fa-microchip text-cyan-400 mr-2"></i>
                  <span className="text-cyan-400 font-semibold">
                    Local Inference Engine
                  </span>
                </Badge>
                <Badge className="glass px-6 py-3 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                  <i className="fas fa-brain text-purple-400 mr-2"></i>
                  <span className="text-purple-400 font-semibold">
                    Deep Multi-Modal Models
                  </span>
                </Badge>
                <Badge className="glass px-6 py-3 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                  <i className="fas fa-project-diagram text-green-400 mr-2"></i>
                  <span className="text-green-400 font-semibold">
                    Modular Architecture
                  </span>
                </Badge>
                <Badge className="glass px-6 py-3 border border-pink-400/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105">
                  <i className="fas fa-shield-alt text-pink-400 mr-2"></i>
                  <span className="text-pink-400 font-semibold">
                    Zero Network Dependency
                  </span>
                </Badge>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <Card className="glass-strong p-4 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
                  <div className="text-center">
                    <i className="fas fa-robot text-2xl text-cyan-400 mb-2"></i>
                    <div className="text-xl font-bold text-cyan-400">
                      {stats.totalTools}
                    </div>
                    <div className="text-xs text-gray-400">AI Tools</div>
                  </div>
                </Card>
                <Card className="glass-strong p-4 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                  <div className="text-center">
                    <i className="fas fa-users text-2xl text-green-400 mb-2"></i>
                    <div className="text-xl font-bold text-green-400">
                      {stats.activeUsers.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Active Users</div>
                  </div>
                </Card>
                <Card className="glass-strong p-4 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                  <div className="text-center">
                    <i className="fas fa-images text-2xl text-purple-400 mb-2"></i>
                    <div className="text-xl font-bold text-purple-400">
                      {stats.processedImages.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      Images Processed
                    </div>
                  </div>
                </Card>
                <Card className="glass-strong p-4 border border-pink-400/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105">
                  <div className="text-center">
                    <i className="fas fa-heartbeat text-2xl text-pink-400 mb-2"></i>
                    <div className="text-xl font-bold text-pink-400">
                      {stats.uptime}
                    </div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                </Card>
              </div>

              {/* Success Motto */}
              <Card className="glass-strong max-w-2xl mx-auto p-6 border border-yellow-400/30">
                <div className="text-center">
                  <p className="text-yellow-400 font-bold text-lg mb-2">
                    🔥 {t("كلمة السر للنجاح")}
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    "حرية بلا حدود مع KnouxAI"
                  </p>
                </div>
              </Card>
            </div>
          </section>

          {/* Main Workspace */}
          <section className="pb-20">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 glass-strong rounded-2xl p-2 mb-8 border border-cyan-400/30">
                <TabsTrigger
                  value="local_ai"
                  className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_20px_rgba(0,255,239,0.2)] transition-all duration-300"
                >
                  <i className="fas fa-robot mr-2"></i>
                  <span className="hidden sm:inline">30 أداة AI محلية</span>
                </TabsTrigger>
                <TabsTrigger
                  value="technical"
                  className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400 data-[state=active]:shadow-[0_0_20px_rgba(251,146,60,0.2)] transition-all duration-300"
                >
                  <i className="fas fa-microchip mr-2"></i>
                  <span className="hidden sm:inline">وحدة تحكم تقنية</span>
                </TabsTrigger>
                <TabsTrigger
                  value="models"
                  className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-purple-400 data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300"
                >
                  <i className="fas fa-brain mr-2"></i>
                  <span className="hidden sm:inline">إدارة النماذج</span>
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-blue-400/20 data-[state=active]:text-blue-400 data-[state=active]:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300"
                >
                  <i className="fas fa-cloud mr-2"></i>
                  <span className="hidden sm:inline">خدمات السحابة</span>
                </TabsTrigger>
                <TabsTrigger
                  value="workspace"
                  className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400 data-[state=active]:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300"
                >
                  <i className="fas fa-magic mr-2"></i>
                  <span className="hidden sm:inline">ورشة العمل</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab Contents */}
              <div className="min-h-[600px]">
                <TabsContent value="local_ai" className="mt-0">
                  <Card className="glass-strong rounded-3xl border border-cyan-400/30 overflow-hidden">
                    <MainImageEditor />
                  </Card>
                </TabsContent>

                <TabsContent value="technical" className="mt-0">
                  <Card className="glass-strong rounded-3xl p-8 border border-orange-400/30">
                    <TechnicalDashboard />
                  </Card>
                </TabsContent>

                <TabsContent value="models" className="mt-0">
                  <Card className="glass-strong rounded-3xl p-8 border border-purple-400/30">
                    <ComprehensiveModelManager />
                  </Card>
                </TabsContent>

                <TabsContent value="services" className="mt-0">
                  <Card className="glass-strong rounded-3xl border border-blue-400/30 overflow-hidden">
                    <ServicesLayout
                      selectedService={selectedService}
                      onServiceChange={setSelectedService}
                      customizations={serviceCustomizations}
                      onCustomizationChange={handleCustomizationChange}
                    />
                  </Card>
                </TabsContent>

                <TabsContent value="workspace" className="mt-0">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                      <Card className="glass-strong rounded-2xl p-6 border border-green-400/30">
                        <SimpleImageCanvas
                          onImageUpload={handleImageUpload}
                          onSelectionChange={handleSelectionChange}
                          uploadedImage={uploadedImage}
                        />
                      </Card>
                    </div>
                    <div className="space-y-6">
                      <Card className="glass-strong rounded-2xl p-6 border border-green-400/30">
                        <PromptNexus
                          onTransform={handleTransform}
                          isProcessing={isProcessing || isLocalProcessing}
                          selectedService={selectedService}
                          customizations={
                            serviceCustomizations[selectedService]
                          }
                        />
                      </Card>
                      {result && (
                        <Card className="glass-strong rounded-2xl p-6 border border-green-400/30">
                          <ResultsComparison
                            transformation={result}
                            onNewTransform={reset}
                          />
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </section>
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
