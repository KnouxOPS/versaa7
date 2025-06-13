import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useAIService,
  useAIJobs,
  useVIP,
  type AIService,
} from "./providers/AIServiceProvider";

interface ServiceDetailProps {
  service: AIService;
  onClose: () => void;
  uploadedImage: File | null;
}

interface ServiceCustomizations {
  [key: string]: any;
}

export function ServiceDetail({
  service,
  onClose,
  uploadedImage,
}: ServiceDetailProps) {
  const { t } = useLanguage();
  const { state } = useAIService();
  const { submitJob } = useAIJobs();
  const { vipSession, submitVIPJob } = useVIP();

  const [customizations, setCustomizations] = useState<ServiceCustomizations>(
    {},
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingJob, setProcessingJob] = useState<string | null>(null);

  // إعدادات مخصصة لكل خدمة
  const getServiceCustomizations = (serviceId: string) => {
    const customizationOptions: Record<string, any> = {
      face_swap: {
        blendStrength: {
          type: "slider",
          min: 0,
          max: 1,
          step: 0.1,
          default: 0.8,
          label: "قوة المزج",
        },
        preserveIdentity: {
          type: "toggle",
          default: true,
          label: "الحفاظ على الهوية",
        },
        faceModel: {
          type: "select",
          options: ["auto", "refined", "detailed"],
          default: "auto",
          label: "نموذج الوجه",
        },
      },
      beauty_filter: {
        skinSmoothing: {
          type: "slider",
          min: 0,
          max: 100,
          step: 5,
          default: 70,
          label: "تنعيم البشرة",
        },
        eyeEnhancement: {
          type: "slider",
          min: 0,
          max: 50,
          step: 2,
          default: 20,
          label: "تحسين العيون",
        },
        jawlineDefine: {
          type: "slider",
          min: 0,
          max: 80,
          step: 5,
          default: 30,
          label: "تحديد الفك",
        },
        lipEnhancement: {
          type: "toggle",
          default: false,
          label: "تحسين الشفاه",
        },
      },
      face_expression: {
        expression: {
          type: "select",
          options: [
            "smile",
            "laugh",
            "sad",
            "angry",
            "surprised",
            "neutral",
            "wink",
          ],
          default: "smile",
          label: "نوع التعبير",
        },
        intensity: {
          type: "slider",
          min: 0,
          max: 1,
          step: 0.1,
          default: 0.8,
          label: "شدة التعبير",
        },
        naturalness: {
          type: "slider",
          min: 0,
          max: 1,
          step: 0.1,
          default: 0.9,
          label: "الطبيعية",
        },
      },
      age_transform: {
        ageDirection: {
          type: "select",
          options: ["younger", "older"],
          default: "younger",
          label: "اتجاه التغيير",
        },
        ageAmount: {
          type: "slider",
          min: 5,
          max: 50,
          step: 5,
          default: 15,
          label: "مقدار التغيير",
        },
        preserveFeatures: {
          type: "toggle",
          default: true,
          label: "الحفاظ على الملامح",
        },
      },
      gender_swap: {
        targetGender: {
          type: "select",
          options: ["female", "male"],
          default: "female",
          label: "الجنس المطلوب",
        },
        intensity: {
          type: "slider",
          min: 0,
          max: 1,
          step: 0.1,
          default: 0.8,
          label: "شدة التحويل",
        },
        preserveIdentity: {
          type: "toggle",
          default: true,
          label: "الحفاظ على الهوية",
        },
      },
      makeup_artist: {
        makeupStyle: {
          type: "select",
          options: [
            "natural",
            "glamour",
            "smoky",
            "arabic",
            "korean",
            "gothic",
          ],
          default: "natural",
          label: "نوع المكياج",
        },
        intensity: {
          type: "slider",
          min: 0,
          max: 1,
          step: 0.1,
          default: 0.7,
          label: "شدة المكياج",
        },
        lipstick: { type: "toggle", default: true, label: "أحمر الشفاه" },
        eyeshadow: { type: "toggle", default: true, label: "ظلال العيون" },
      },
      body_reshape: {
        waistScale: {
          type: "slider",
          min: 0.5,
          max: 1.5,
          step: 0.05,
          default: 1.0,
          label: "حجم الخصر",
        },
        hipScale: {
          type: "slider",
          min: 0.5,
          max: 1.5,
          step: 0.05,
          default: 1.0,
          label: "حجم الأرداف",
        },
        chestScale: {
          type: "slider",
          min: 0.5,
          max: 1.5,
          step: 0.05,
          default: 1.0,
          label: "حجم الصدر",
        },
        shoulderScale: {
          type: "slider",
          min: 0.5,
          max: 1.5,
          step: 0.05,
          default: 1.0,
          label: "حجم الأكتاف",
        },
      },
      clothing_swap: {
        clothingType: {
          type: "select",
          options: [
            "casual",
            "formal",
            "swimwear",
            "lingerie",
            "traditional",
            "fantasy",
          ],
          default: "casual",
          label: "نوع الملابس",
        },
        color: { type: "color", default: "#0066cc", label: "اللون الأساسي" },
        preserveFit: {
          type: "toggle",
          default: true,
          label: "الحفاظ على القياس",
        },
      },
      style_transfer: {
        style: {
          type: "select",
          options: [
            "anime",
            "van_gogh",
            "picasso",
            "oil_painting",
            "watercolor",
            "sketch",
            "islamic_art",
          ],
          default: "anime",
          label: "النمط الفني",
        },
        strength: {
          type: "slider",
          min: 0,
          max: 1,
          step: 0.1,
          default: 0.8,
          label: "قوة النمط",
        },
        preserveContent: {
          type: "slider",
          min: 0,
          max: 1,
          step: 0.1,
          default: 0.6,
          label: "الحفاظ على المحتوى",
        },
      },
      super_resolution: {
        scaleFactor: {
          type: "select",
          options: [2, 4, 8],
          default: 4,
          label: "مقدار التكبير",
        },
        enhanceDetails: {
          type: "toggle",
          default: true,
          label: "تحسين التفاصيل",
        },
        preserveColors: {
          type: "toggle",
          default: true,
          label: "الحفاظ على الألوان",
        },
      },
      vip_magic_morph: {
        prompt: {
          type: "textarea",
          default: "",
          label: "وصف التحويل المطلوب",
          placeholder: "اكتب وصفاً تفصيلياً للتحويل المطلوب...",
        },
        strength: {
          type: "slider",
          min: 0,
          max: 1,
          step: 0.05,
          default: 0.9,
          label: "قوة التحويل",
        },
        steps: {
          type: "slider",
          min: 20,
          max: 100,
          step: 5,
          default: 50,
          label: "عدد الخطوات",
        },
        guidance: {
          type: "slider",
          min: 1,
          max: 20,
          step: 0.5,
          default: 7.5,
          label: "دقة التوجيه",
        },
      },
    };

    return customizationOptions[serviceId] || {};
  };

  // تهيئة الإعدادات الافتراضية
  useEffect(() => {
    const options = getServiceCustomizations(service.id);
    const defaultSettings: ServiceCustomizations = {};

    Object.keys(options).forEach((key) => {
      defaultSettings[key] = options[key].default;
    });

    setCustomizations(defaultSettings);
  }, [service.id]);

  // مراقبة حالة المعالجة
  useEffect(() => {
    if (processingJob) {
      const job = state.jobs[processingJob];
      if (job && (job.status === "completed" || job.status === "failed")) {
        setIsProcessing(false);
        setProcessingJob(null);
      }
    }
  }, [state.jobs, processingJob]);

  // بدء المعالجة
  const handleProcess = async () => {
    if (!uploadedImage) {
      alert(t("الرجاء رفع صورة أولاً"));
      return;
    }

    setIsProcessing(true);

    try {
      let jobId: string;

      if (service.isVIP && vipSession.isActive) {
        jobId = await submitVIPJob(service.id, uploadedImage, customizations);
      } else if (service.isVIP) {
        alert(t("هذه الخدمة تتطلب اشتراك VIP"));
        setIsProcessing(false);
        return;
      } else {
        jobId = await submitJob(service.id, uploadedImage, customizations);
      }

      setProcessingJob(jobId);
    } catch (error) {
      console.error("خطأ في المعالجة:", error);
      alert(t("فشل في بدء المعالجة. حاول مرة أخرى."));
      setIsProcessing(false);
    }
  };

  // رندر تحكم مخصص
  const renderCustomControl = (key: string, config: any) => {
    const value = customizations[key] ?? config.default;

    switch (config.type) {
      case "slider":
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-300">
                {t(config.label)}
              </label>
              <span className="text-sm text-cyan-400">{value}</span>
            </div>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step}
              value={value}
              onChange={(e) =>
                setCustomizations((prev) => ({
                  ...prev,
                  [key]: Number(e.target.value),
                }))
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
            />
          </div>
        );

      case "select":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {t(config.label)}
            </label>
            <select
              value={value}
              onChange={(e) =>
                setCustomizations((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            >
              {config.options.map((option: any) => (
                <option key={option} value={option}>
                  {t(option)}
                </option>
              ))}
            </select>
          </div>
        );

      case "toggle":
        return (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              {t(config.label)}
            </label>
            <button
              onClick={() =>
                setCustomizations((prev) => ({ ...prev, [key]: !value }))
              }
              className={`w-12 h-6 rounded-full transition-all duration-300 ${
                value ? "bg-cyan-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                  value ? "transform translate-x-6" : "transform translate-x-1"
                }`}
              />
            </button>
          </div>
        );

      case "color":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {t(config.label)}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={value}
                onChange={(e) =>
                  setCustomizations((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                className="w-12 h-8 rounded border border-gray-600 cursor-pointer"
              />
              <span className="text-sm text-gray-400">{value}</span>
            </div>
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {t(config.label)}
            </label>
            <textarea
              value={value}
              onChange={(e) =>
                setCustomizations((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
              placeholder={t(config.placeholder || "")}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none resize-none"
              rows={4}
            />
            <div className="text-xs text-gray-400 text-left">
              {value.length}/1000
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const customizationOptions = getServiceCustomizations(service.id);
  const currentJob = processingJob ? state.jobs[processingJob] : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-strong rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.isVIP ? "from-yellow-400/20 to-amber-500/20" : "from-cyan-400/20 to-purple-500/20"} flex items-center justify-center`}
            >
              <i
                className={`fas fa-magic text-xl ${service.isVIP ? "text-yellow-400" : "text-cyan-400"}`}
              ></i>
            </div>
            <div>
              <h2
                className={`text-2xl font-bold ${service.isVIP ? "text-yellow-400" : "text-cyan-400"} neon-text`}
              >
                {t(service.name)}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-500/20 text-green-400"
                >
                  <i className="fas fa-microchip mr-1"></i>
                  {service.model}
                </Badge>
                {service.isVIP && (
                  <Badge className="text-xs bg-yellow-500/20 text-yellow-400">
                    <i className="fas fa-crown mr-1"></i>
                    VIP
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="glass border-gray-600 hover:bg-gray-700"
          >
            <i className="fas fa-times mr-2"></i>
            {t("إغلاق")}
          </Button>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass rounded-xl">
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-cyan-400/20"
            >
              <i className="fas fa-cogs mr-2"></i>
              {t("الإعدادات")}
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-purple-400/20"
            >
              <i className="fas fa-eye mr-2"></i>
              {t("المعاينة")}
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="data-[state=active]:bg-green-400/20"
            >
              <i className="fas fa-images mr-2"></i>
              {t("أمثلة")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* الإعدادات */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                  {t("تخصيص الإعدادات")}
                </h3>

                {Object.keys(customizationOptions).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(customizationOptions).map(
                      ([key, config]) => (
                        <div key={key} className="glass p-4 rounded-xl">
                          {renderCustomControl(key, config)}
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <i className="fas fa-cog text-4xl mb-4"></i>
                    <p>{t("هذه الخدمة لا تحتاج إعدادات إضافية")}</p>
                  </div>
                )}
              </div>

              {/* معلومات الخدمة */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">
                  {t("معلومات الخدمة")}
                </h3>

                <div className="glass p-4 rounded-xl space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("النموذج")}:</span>
                    <span className="text-cyan-400 font-semibold">
                      {service.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("متطلبات GPU")}:</span>
                    <span
                      className={
                        service.gpuRequired
                          ? "text-orange-400"
                          : "text-green-400"
                      }
                    >
                      {service.gpuRequired ? t("مطلوب") : t("غير مطلوب")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("حد الذاكرة")}:</span>
                    <span className="text-cyan-400">{service.memoryLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("الوقت المتوقع")}:</span>
                    <span className="text-green-400">
                      {Math.round(service.estimatedTime / 1000)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {t("المعالجة النشطة")}:
                    </span>
                    <span className="text-yellow-400">
                      {service.activeProcessing}/{service.concurrentLimit}
                    </span>
                  </div>
                </div>

                {/* شريط الحالة */}
                <div className="glass p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      {t("حالة الخدمة")}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        service.status === "ready"
                          ? "bg-green-500/20 text-green-400"
                          : service.status === "busy"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : service.status === "offline"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {t(service.status)}
                    </Badge>
                  </div>
                  <Progress
                    value={
                      (service.activeProcessing / service.concurrentLimit) * 100
                    }
                    className="h-2"
                  />
                </div>

                {/* حالة المعالجة الحالية */}
                {currentJob && (
                  <div className="glass p-4 rounded-xl border border-cyan-400/30">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-3">
                      <i className="fas fa-cog fa-spin mr-2"></i>
                      {t("معالجة جارية")}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t("الحالة")}:</span>
                        <span className="text-cyan-400">
                          {t(currentJob.status)}
                        </span>
                      </div>
                      <Progress value={currentJob.progress} className="h-2" />
                      <p className="text-sm text-gray-300">
                        {currentJob.message}
                      </p>
                      {currentJob.progress > 0 && (
                        <div className="text-xs text-gray-400">
                          {t("التقدم")}: {currentJob.progress}%
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                {!uploadedImage && (
                  <p className="text-sm text-red-400">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    {t("الرجاء رفع صورة أولاً")}
                  </p>
                )}
                {service.isVIP && !vipSession.isActive && (
                  <p className="text-sm text-yellow-400">
                    <i className="fas fa-crown mr-1"></i>
                    {t("خدمة VIP - تسجيل دخول مطلوب")}
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="glass border-gray-600 hover:bg-gray-700"
                >
                  {t("إلغاء")}
                </Button>

                <Button
                  onClick={handleProcess}
                  disabled={
                    !uploadedImage ||
                    isProcessing ||
                    (service.isVIP && !vipSession.isActive)
                  }
                  className={`enhanced-button ${service.isVIP ? "bg-yellow-400/20 border-yellow-400 text-yellow-400" : "bg-cyan-400/20 border-cyan-400 text-cyan-400"}`}
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-cog fa-spin mr-2"></i>
                      {t("معالجة...")}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play mr-2"></i>
                      {t("بدء المعالجة")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="text-center py-12">
              <i className="fas fa-image text-6xl text-gray-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {t("معاينة النتائج")}
              </h3>
              <p className="text-gray-500">
                {t("ستظهر معاينة النتائج هنا بعد المعالجة")}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-6">
            <div className="text-center py-12">
              <i className="fas fa-images text-6xl text-gray-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {t("أمثلة النتائج")}
              </h3>
              <p className="text-gray-500">
                {t("أمثلة لنتائج هذه الخدمة ستظهر هنا قريباً")}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
