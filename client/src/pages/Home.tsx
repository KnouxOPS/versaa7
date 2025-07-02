import { useState, useEffect } from "react";
import { NeuralBackground } from "@/components/NeuralBackground";
import { SimpleImageCanvas } from "@/components/SimpleImageCanvas";
import { ServicesLayout } from "@/components/ServicesLayout";
import { AdvancedLocalAITools } from "@/components/AdvancedLocalAITools";
import { PromptNexus } from "@/components/PromptNexus";
import { ProcessingModal } from "@/components/ProcessingModal";
import { ResultsComparison } from "@/components/ResultsComparison";
import { VIPModal } from "@/components/VIPModal";
import { TechnicalDashboard } from "@/components/TechnicalDashboard";
import { AIModelsManager } from "@/components/AIModelsManager";
import { useLanguage } from "@/hooks/useLanguage";
import { useImageTransform } from "@/hooks/useImageTransform";
import { processImageLocally } from "@/lib/localAIProcessor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    reset(); // Clear any previous results
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
      "clothing_swap",
      "tattoo_artist",
      "muscle_enhancer",
      "bg_remover",
      "bg_replacer",
      "lighting_master",
      "style_transfer",
      "cartoonizer",
      "colorizer",
      "super_resolution",
      "denoiser",
      "sharpener",
      "object_remover",
      "object_replacer",
      "smart_crop",
      "image_merger",
      "pose_editor",
      "hair_stylist",
      "eye_color_changer",
      "teeth_whitener",
      "scar_remover",
      "virtual_jewelry",
      "vintage_filter",
    ];

    // استخدام المعالجة المحلية للأدوات المحلية
    if (localTools.includes(selectedService)) {
      setIsLocalProcessing(true);
      setLocalProgress(0);
      setLocalMessage("بدء المعالجة المحلية...");

      try {
        const result = await processImageLocally(
          selectedService,
          uploadedImage,
          {
            ...serviceCustomizations[selectedService],
            prompt,
            quality,
            selectionData,
          },
          (progress, message) => {
            setLocalProgress(progress);
            setLocalMessage(message);
          },
        );

        if (result.success && result.processedImage) {
          // إنشاء كائن transformation مؤقت للعرض
          const mockTransformation = {
            id: Date.now(),
            transformedImageUrl: result.processedImage,
            prompt,
            service: selectedService,
            quality,
            isVIP: false,
            createdAt: new Date(),
            processingTime: result.processingTime,
            metadata: result.metadata,
          };

          // عرض النتيجة
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
      // استخدام المعالجة السحابية للأدوات الأخرى
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

  // Electron API integration
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).electronAPI) {
      const electronAPI = (window as any).electronAPI;

      // Listen for menu events
      electronAPI.onNewTransformation(() => {
        reset();
        setUploadedImage(null);
        setSelectionData(null);
      });

      electronAPI.onOpenImage((filePath: string) => {
        // Convert file path to URL for display
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

      // Cleanup listeners on unmount
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

      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 animate-pulse-glow">
              <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-cyan-400 neon-text">
                  K
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold neon-text text-cyan-400">
                KNOUX VERSA
              </h1>
              <p className="text-xs text-gray-400">
                {t("The Uncensored AI Nexus")}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="glass border-cyan-400/30 hover:bg-cyan-400/10"
            >
              <i className="fas fa-globe mr-2"></i>
              {currentLanguage === "en" ? "العربية" : "English"}
            </Button>
            <Link href="/about">
              <Button
                variant="outline"
                size="sm"
                className="glass border-purple-400/30 hover:bg-purple-400/10"
              >
                <i className="fas fa-info-circle mr-2"></i>
                {t("About")}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-responsive-xl font-bold mb-4 neon-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 animate-float">
              🧠{" "}
              {t(
                "Knoux-VERSA | نظام متقدم لتحرير الصور المعتمد على الذكاء الاصطناعي",
              )}
            </h2>
            <p className="text-responsive-md text-gray-300 max-w-6xl mx-auto mb-6 leading-relaxed">
              {t(
                "بنية برمجية شاملة موجهة لمعالجة الصور باستخدام تقنيات الذكاء الاصطناعي التوليدي عبر نماذج عميقة متعددة الوسائط. صُمّم ليشكل بيئة معيارية ذات استقلالية تشغيلية عالية، ويتيح تحكمًا دلاليًا مرنًا في مكونات الصورة",
              )}
            </p>

            {/* شارات المميزات */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass rounded-full px-6 py-3 border border-cyan-400/30">
                <i className="fas fa-microchip text-cyan-400 mr-2"></i>
                <span className="text-cyan-400 font-semibold">
                  {t("Local Inference Engine")}
                </span>
              </div>
              <div className="glass rounded-full px-6 py-3 border border-purple-400/30">
                <i className="fas fa-brain text-purple-400 mr-2"></i>
                <span className="text-purple-400 font-semibold">
                  {t("Deep Multi-Modal Models")}
                </span>
              </div>
              <div className="glass rounded-full px-6 py-3 border border-green-400/30">
                <i className="fas fa-project-diagram text-green-400 mr-2"></i>
                <span className="text-green-400 font-semibold">
                  {t("Modular Architecture")}
                </span>
              </div>
              <div className="glass rounded-full px-6 py-3 border border-orange-400/30">
                <i className="fas fa-language text-orange-400 mr-2"></i>
                <span className="text-orange-400 font-semibold">
                  {t("Semantic Control")}
                </span>
              </div>
              <div className="glass rounded-full px-6 py-3 border border-pink-400/30">
                <i className="fas fa-shield-alt text-pink-400 mr-2"></i>
                <span className="text-pink-400 font-semibold">
                  {t("Zero Network Dependency")}
                </span>
              </div>
            </div>

            {/* كلمة السر للنجاح */}
            <div className="glass rounded-xl p-4 max-w-2xl mx-auto border border-yellow-400/30">
              <p className="text-yellow-400 font-bold text-lg mb-2">
                🔥 {t("كلمة السر للنجاح")}
              </p>
              <p className="text-2xl font-bold neon-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                "حرية بلا حدود مع KnouxAI"
              </p>
            </div>
          </div>

          {/* Main Interface with Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 glass rounded-2xl p-1">
              <TabsTrigger
                value="local_ai"
                className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400"
              >
                <i className="fas fa-robot mr-2"></i>
                {t("30 أداة AI محلية")}
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400"
              >
                <i className="fas fa-microchip mr-2"></i>
                {t("وحدة تحكم تقنية")}
              </TabsTrigger>
              <TabsTrigger
                value="models"
                className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-purple-400"
              >
                <i className="fas fa-brain mr-2"></i>
                {t("إدارة النماذج")}
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-blue-400/20 data-[state=active]:text-blue-400"
              >
                <i className="fas fa-cloud mr-2"></i>
                {t("خدمات السحابة")}
              </TabsTrigger>
              <TabsTrigger
                value="workspace"
                className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400"
              >
                <i className="fas fa-magic mr-2"></i>
                {t("ورشة العمل")}
              </TabsTrigger>
            </TabsList>

            {/* Local AI Tools Tab */}
            <TabsContent value="local_ai" className="mt-8">
              <AdvancedLocalAITools
                selectedTool={selectedService}
                onToolSelect={(tool) => {
                  setSelectedService(tool.id);
                  setActiveTab("workspace");
                }}
              />
            </TabsContent>

            {/* Technical Dashboard Tab */}
            <TabsContent value="technical" className="mt-8">
              <TechnicalDashboard />
            </TabsContent>

            {/* AI Models Manager Tab */}
            <TabsContent value="models" className="mt-8">
              <AIModelsManager />
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="mt-8">
              <ServicesLayout
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
                onVIPRequest={() => setShowVIPModal(true)}
                onCustomizationChange={handleCustomizationChange}
              />
            </TabsContent>

            {/* Workspace Tab */}
            <TabsContent value="workspace" className="mt-8">
              <Card
                className="glass-strong rounded-3xl p-8 mb-12 animate-float"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Upload & Selection */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold neon-text text-cyan-400">
                      {t("Upload & Select Area")}
                    </h3>

                    <SimpleImageCanvas
                      onImageUpload={handleImageUpload}
                      onSelectionChange={handleSelectionChange}
                      uploadedImage={uploadedImage}
                    />
                  </div>

                  {/* AI Command Center */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold neon-text text-purple-400">
                      {t("AI Command Center")}
                    </h3>

                    <PromptNexus
                      selectedService={selectedService}
                      onTransform={handleTransform}
                      disabled={!uploadedImage || isProcessing}
                    />

                    {/* Current Service Customizations Display */}
                    {serviceCustomizations[selectedService] &&
                      Object.keys(serviceCustomizations[selectedService])
                        .length > 0 && (
                        <Card className="glass p-4 border-purple-400/30">
                          <h4 className="text-sm font-semibold text-purple-400 mb-3">
                            <i className="fas fa-cogs mr-2"></i>
                            {t("Active Customizations")}
                          </h4>
                          <div className="text-xs text-gray-300 space-y-1">
                            {Object.entries(
                              serviceCustomizations[selectedService],
                            ).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">
                                  {key.replace("_", " ")}:
                                </span>
                                <span className="text-cyan-400">
                                  {String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Results Section */}
          {result && (
            <ResultsComparison
              originalImage={uploadedImage!}
              transformedImage={result.transformedImageUrl}
              onNewTransform={reset}
            />
          )}

          {/* Error Display */}
          {error && (
            <Card className="glass rounded-2xl p-6 mb-12 border-red-500/50 error-glow">
              <div className="text-center text-red-400">
                <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <h3 className="text-xl font-bold mb-2">
                  {t("Transformation Failed")}
                </h3>
                <p>{error}</p>
                <Button
                  onClick={reset}
                  className="mt-4 bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
                >
                  {t("Try Again")}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass mt-12 p-6">
        <div className="container mx-auto text-center">
          <div style={{ fontSize: "1.1em", color: "#999", marginTop: "24px" }}>
            <span>{t("Crafted with creativity by")}</span>{" "}
            <b style={{ color: "#00FFFF" }}>Sadek Elgazar</b> | © 2025 KNOUX
            VERSA.
            <br />
            <span style={{ fontSize: "0.9em", color: "#88f" }}>
              {t("Support the creator on")}{" "}
              <a
                href="https://buymeacoffee.com/knoux"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#a8f" }}
                className="hover:text-yellow-300 transition-colors"
              >
                BuyMeACoffee
              </a>{" "}
              ✨
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProcessingModal
        isOpen={isProcessing || isLocalProcessing}
        progress={isLocalProcessing ? localProgress : progress}
        message={isLocalProcessing ? localMessage : processingMessage}
      />

      <VIPModal
        isOpen={showVIPModal}
        onClose={() => setShowVIPModal(false)}
        onVIPAccess={handleVIPAccess}
      />
    </div>
  );
}
