import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

interface SimplifiedUploadInterfaceProps {
  onProcess: (
    imageFile: File,
    prompt: string,
    service: string,
    quality: string,
  ) => void;
  isProcessing: boolean;
  selectedService: string;
  onServiceChange: (service: string) => void;
}

// خدمات AI المبسطة والجاهزة فوراً
const READY_AI_SERVICES = [
  {
    id: "magic_morph",
    name: "التحويل السحري",
    nameEn: "Magic Morph",
    icon: "fas fa-magic",
    description: "حول صورتك لأي شيء تريده بالذكاء الاصطناعي",
    ready: true,
    processingTime: "5-10 ثواني",
  },
  {
    id: "style_transfer",
    name: "نقل الأسلوب الفني",
    nameEn: "Art Style Transfer",
    icon: "fas fa-paint-brush",
    description: "حول صورتك للوحة فنية أو أسلوب أنمي",
    ready: true,
    processingTime: "8-15 ثانية",
  },
  {
    id: "face_beauty",
    name: "تحسين الجمال",
    nameEn: "Beauty Enhancement",
    icon: "fas fa-sparkles",
    description: "فلتر جمال ذكي لتحسين الصورة طبيعياً",
    ready: true,
    processingTime: "3-7 ثواني",
  },
  {
    id: "bg_remove_replace",
    name: "تغيير الخلفية",
    nameEn: "Background Magic",
    icon: "fas fa-image",
    description: "إزالة أو تغيير الخلفية لأي منظر تريده",
    ready: true,
    processingTime: "2-5 ثواني",
  },
  {
    id: "super_resolution",
    name: "تحسين الدقة",
    nameEn: "Super Resolution",
    icon: "fas fa-search-plus",
    description: "رفع جودة الصورة إلى 4K بتقنية AI",
    ready: true,
    processingTime: "3-8 ثواني",
  },
  {
    id: "age_gender_transform",
    name: "تحويل العمر والجنس",
    nameEn: "Age & Gender Transform",
    icon: "fas fa-user-clock",
    description: "غير عمرك أو جنسك بواقعية مذهلة",
    ready: true,
    processingTime: "10-20 ثانية",
  },
];

export function SimplifiedUploadInterface({
  onProcess,
  isProcessing,
  selectedService,
  onServiceChange,
}: SimplifiedUploadInterfaceProps) {
  const { t } = useLanguage();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [quality, setQuality] = useState("high");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);

      // إنشاء معاينة للصورة
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleProcess = () => {
    if (uploadedImage && prompt.trim()) {
      onProcess(uploadedImage, prompt, selectedService, quality);
    }
  };

  const selectedServiceInfo = READY_AI_SERVICES.find(
    (s) => s.id === selectedService,
  );

  return (
    <div className="space-y-6">
      {/* عنوان مبسط */}
      <div className="text-center">
        <h2 className="text-3xl font-bold neon-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-2">
          🚀 {t("ارفع صورة واكتب أمر واحد")}
        </h2>
        <p className="text-gray-400">
          {t("أبسط طريقة لتحويل صورك بالذكاء الاصطناعي - جاهز فوراً!")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* قسم رفع الصورة */}
        <Card className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
            <i className="fas fa-upload mr-3"></i>
            {t("1. ارفع صورتك")}
          </h3>

          {/* منطقة رفع الصورة */}
          <div
            className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
              ${
                imagePreview
                  ? "border-green-400 bg-green-400/10"
                  : "border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/10"
              }
            `}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="معاينة الصورة"
                  className="max-w-full max-h-48 mx-auto rounded-lg shadow-lg"
                />
                <div className="text-green-400">
                  <i className="fas fa-check-circle text-2xl mb-2"></i>
                  <p className="font-semibold">{t("الصورة جاهزة!")}</p>
                  <p className="text-sm text-gray-400">
                    {uploadedImage?.name} (
                    {Math.round((uploadedImage?.size || 0) / 1024)} KB)
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedImage(null);
                    setImagePreview(null);
                  }}
                  className="border-red-400 text-red-400 hover:bg-red-400/20"
                >
                  <i className="fas fa-times mr-2"></i>
                  {t("تغيير الصورة")}
                </Button>
              </div>
            ) : (
              <div className="text-cyan-400">
                <i className="fas fa-cloud-upload-alt text-4xl mb-4"></i>
                <p className="text-lg font-semibold mb-2">
                  {t("اضغط أو اسحب صورة هنا")}
                </p>
                <p className="text-sm text-gray-400">
                  {t("يدعم: JPG, PNG, WebP, TIFF - حتى 50MB")}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* قسم الخدمة والأوامر */}
        <Card className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
            <i className="fas fa-brain mr-3"></i>
            {t("2. اختر نوع التحويل")}
          </h3>

          {/* اختيار الخدمة */}
          <div className="space-y-4 mb-6">
            <Select value={selectedService} onValueChange={onServiceChange}>
              <SelectTrigger className="bg-gray-800/50 border-purple-400/30">
                <SelectValue placeholder={t("اختر نوع التحويل")} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-purple-400/30">
                {READY_AI_SERVICES.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center space-x-3">
                      <i className={`${service.icon} text-cyan-400`}></i>
                      <div>
                        <div className="font-semibold">{t(service.name)}</div>
                        <div className="text-xs text-gray-400">
                          {service.nameEn}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* معلومات الخدمة المختارة */}
            {selectedServiceInfo && (
              <Card className="glass p-4 border-purple-400/30">
                <div className="flex items-start space-x-3">
                  <i
                    className={`${selectedServiceInfo.icon} text-purple-400 mt-1`}
                  ></i>
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-400 mb-1">
                      {t(selectedServiceInfo.name)}
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                      {selectedServiceInfo.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-500/20 text-green-400">
                        <i className="fas fa-bolt mr-1"></i>
                        {t("جاهز فوراً")}
                      </Badge>
                      <span className="text-xs text-cyan-400">
                        ⏱️ {selectedServiceInfo.processingTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <h4 className="text-lg font-bold text-orange-400 mb-4 flex items-center">
            <i className="fas fa-edit mr-3"></i>
            {t("3. اكتب أمرك")}
          </h4>

          {/* مربع النص للأوامر */}
          <div className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("مثال: حول الصورة لأسلوب أنمي ياباني جميل...")}
              className="bg-gray-800/50 border-orange-400/30 min-h-24 text-white placeholder-gray-400 focus:border-orange-400"
              disabled={isProcessing}
            />

            {/* اختيار الجودة */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">
                {t("جودة المعالجة:")}
              </label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="w-32 bg-gray-800/50 border-orange-400/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-orange-400/30">
                  <SelectItem value="standard">{t("عادية")}</SelectItem>
                  <SelectItem value="high">{t("عالية")}</SelectItem>
                  <SelectItem value="ultra">{t("فائقة")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* عدد الأحرف */}
            <div className="text-right text-xs text-gray-400">
              {prompt.length}/500 {t("حرف")}
            </div>
          </div>
        </Card>
      </div>

      {/* زر البدء الرئيسي */}
      <Card className="glass-strong rounded-2xl p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center justify-center">
            <i className="fas fa-rocket mr-3"></i>
            {t("4. ابدأ التحويل السحري")}
          </h3>

          <Button
            onClick={handleProcess}
            disabled={!uploadedImage || !prompt.trim() || isProcessing}
            className={`
              text-xl font-bold py-6 px-12 rounded-xl transition-all duration-300 transform
              ${
                !uploadedImage || !prompt.trim() || isProcessing
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-cyan-500 text-white hover:from-green-400 hover:to-cyan-400 hover:scale-105 shadow-lg hover:shadow-green-500/50"
              }
            `}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-3"></i>
                {t("جاري المعالجة...")}
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-3"></i>
                {t("🚀 ابدأ التحويل الآن!")}
              </>
            )}
          </Button>

          {(!uploadedImage || !prompt.trim()) && (
            <p className="text-sm text-gray-400 mt-3">
              {!uploadedImage && !prompt.trim()
                ? t("👆 ارفع صورة واكتب أمر للبدء")
                : !uploadedImage
                  ? t("👆 ارفع صورة للبدء")
                  : t("👆 اكتب أمر للبدء")}
            </p>
          )}

          {uploadedImage && prompt.trim() && !isProcessing && (
            <div className="mt-4 text-green-400">
              <p className="text-sm font-semibold">
                ✅ {t("كل شيء جاهز! اضغط للبدء")}
              </p>
              {selectedServiceInfo && (
                <p className="text-xs text-gray-400">
                  {t("الوقت المتوقع:")} {selectedServiceInfo.processingTime}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* نصائح سريعة */}
      <Card className="glass p-4 border-yellow-400/30">
        <h4 className="text-yellow-400 font-semibold mb-2 flex items-center">
          <i className="fas fa-lightbulb mr-2"></i>
          {t("💡 نصائح للحصول على أفضل النتائج")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
          <div>• {t("استخدم صور واضحة وعالية الجودة")}</div>
          <div>• {t("اكتب أوامر واضحة ومحددة")}</div>
          <div>• {t("جرب أساليب مختلفة للحصول على تنوع")}</div>
          <div>• {t("الصور الشخصية تعطي نتائج أفضل")}</div>
        </div>
      </Card>
    </div>
  );
}
