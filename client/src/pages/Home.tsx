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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <NeuralBackground />

      {/* Header Navigation */}
      <header className="glass-strong border-b border-cyan-400/20 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 animate-pulse-glow">
                  <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-cyan-400 animate-neon-text">
                      K
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  KNOUX VERSA
                </h1>
                <p className="text-xs text-gray-400">
                  {t("The Uncensored AI Nexus")}
                </p>
              </div>
            </div>

            {/* Live Panel - في الهيدر */}
            <div className="flex-1 flex justify-center">
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
                className="max-w-sm"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControlRoom(true)}
                className="glass border-orange-400/30 hover:bg-orange-400/10 text-orange-400"
              >
                <i className="fas fa-cogs mr-2"></i>
                <span className="hidden md:inline">
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
                <span className="hidden md:inline">
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
                  <span className="hidden md:inline">{t("About")}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - ملء الشاشة */}
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-4 flex-1 flex flex-col">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Card className="glass-strong p-3 border border-cyan-400/30 text-center">
              <div className="text-lg font-bold text-cyan-400">30</div>
              <div className="text-xs text-gray-400">AI Tools</div>
            </Card>
            <Card className="glass-strong p-3 border border-green-400/30 text-center">
              <div className="text-lg font-bold text-green-400">1,247</div>
              <div className="text-xs text-gray-400">Active Users</div>
            </Card>
            <Card className="glass-strong p-3 border border-purple-400/30 text-center">
              <div className="text-lg font-bold text-purple-400">45.8K</div>
              <div className="text-xs text-gray-400">Images Processed</div>
            </Card>
            <Card className="glass-strong p-3 border border-pink-400/30 text-center">
              <div className="text-lg font-bold text-pink-400">99.9%</div>
              <div className="text-xs text-gray-400">Uptime</div>
            </Card>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-5 glass-strong rounded-xl p-1 mb-4 border border-cyan-400/30">
              <TabsTrigger
                value="local_ai"
                className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 transition-all duration-300"
              >
                <i className="fas fa-robot mr-1 md:mr-2"></i>
                <span className="text-xs md:text-sm">30 أداة AI</span>
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400 transition-all duration-300"
              >
                <i className="fas fa-microchip mr-1 md:mr-2"></i>
                <span className="text-xs md:text-sm">تحكم تقني</span>
              </TabsTrigger>
              <TabsTrigger
                value="models"
                className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-purple-400 transition-all duration-300"
              >
                <i className="fas fa-brain mr-1 md:mr-2"></i>
                <span className="text-xs md:text-sm">النماذج</span>
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-blue-400/20 data-[state=active]:text-blue-400 transition-all duration-300"
              >
                <i className="fas fa-cloud mr-1 md:mr-2"></i>
                <span className="text-xs md:text-sm">السحابة</span>
              </TabsTrigger>
              <TabsTrigger
                value="workspace"
                className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400 transition-all duration-300"
              >
                <i className="fas fa-magic mr-1 md:mr-2"></i>
                <span className="text-xs md:text-sm">ورشة العمل</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents - ملء المساحة المتبقية */}
            <div className="flex-1">
              <TabsContent value="local_ai" className="h-full mt-0">
                <Card className="glass-strong rounded-2xl border border-cyan-400/30 h-full overflow-hidden">
                  <MainImageEditor />
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="h-full mt-0">
                <Card className="glass-strong rounded-2xl border border-orange-400/30 h-full overflow-hidden">
                  <div className="p-4 h-full">
                    <TechnicalDashboard />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="models" className="h-full mt-0">
                <Card className="glass-strong rounded-2xl border border-purple-400/30 h-full overflow-hidden">
                  <div className="p-4 h-full">
                    <ComprehensiveModelManager />
                  </div>
                </Card>
              </TabsContent>

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

              <TabsContent value="workspace" className="h-full mt-0">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
                  {/* Image Canvas - أكبر مساحة */}
                  <div className="xl:col-span-2">
                    <Card className="glass-strong rounded-2xl border border-green-400/30 h-full overflow-hidden">
                      <div className="p-4 h-full">
                        <SimpleImageCanvas
                          onImageUpload={handleImageUpload}
                          onSelectionChange={handleSelectionChange}
                          uploadedImage={uploadedImage}
                        />
                      </div>
                    </Card>
                  </div>

                  {/* Controls Panel */}
                  <div className="space-y-4 flex flex-col h-full">
                    <Card className="glass-strong rounded-2xl border border-green-400/30 flex-1">
                      <div className="p-4 h-full">
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
                        <div className="p-4 h-full">
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
            </div>
          </Tabs>
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
