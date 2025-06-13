import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

interface IntegratedImageEditorProps {
  imageFile: File | null;
  onEditComplete: (editedImageFile: File) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface EditingState {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sharpness: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  filterType: string;
  cropArea: { x: number; y: number; width: number; height: number } | null;
}

const FILTERS = [
  { id: "none", name: "بدون فلتر", nameEn: "None", filter: "" },
  {
    id: "vintage",
    name: "عتيق",
    nameEn: "Vintage",
    filter: "sepia(0.8) contrast(1.2)",
  },
  {
    id: "blackwhite",
    name: "أبيض وأسود",
    nameEn: "Black & White",
    filter: "grayscale(1)",
  },
  {
    id: "warm",
    name: "دافئ",
    nameEn: "Warm",
    filter: "sepia(0.3) saturate(1.4)",
  },
  {
    id: "cold",
    name: "بارد",
    nameEn: "Cold",
    filter: "hue-rotate(180deg) saturate(1.2)",
  },
  {
    id: "dramatic",
    name: "درامي",
    nameEn: "Dramatic",
    filter: "contrast(1.5) brightness(0.9)",
  },
  {
    id: "soft",
    name: "ناعم",
    nameEn: "Soft",
    filter: "blur(0.5px) brightness(1.1)",
  },
  {
    id: "vibrant",
    name: "حيوي",
    nameEn: "Vibrant",
    filter: "saturate(1.8) contrast(1.1)",
  },
];

export function IntegratedImageEditor({
  imageFile,
  onEditComplete,
  isVisible,
  onClose,
}: IntegratedImageEditorProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [editingState, setEditingState] = useState<EditingState>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sharpness: 0,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    filterType: "none",
    cropArea: null,
  });
  const [activeTab, setActiveTab] = useState("adjust");
  const [isEditing, setIsEditing] = useState(false);

  // تحميل الصورة الأصلية
  useEffect(() => {
    if (imageFile) {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        redrawCanvas(img, editingState);
      };
      img.src = URL.createObjectURL(imageFile);
    }
  }, [imageFile]);

  // إعادة رسم الكانفاس عند تغيير الإعدادات
  useEffect(() => {
    if (originalImage) {
      redrawCanvas(originalImage, editingState);
    }
  }, [editingState, originalImage]);

  const redrawCanvas = (img: HTMLImageElement, state: EditingState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // تحديد حجم الكانفاس
    const maxWidth = 800;
    const maxHeight = 600;
    let { width, height } = img;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }

    canvas.width = width;
    canvas.height = height;

    // تطبيق التحويلات
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.flipHorizontal ? -1 : 1, state.flipVertical ? -1 : 1);
    ctx.translate(-width / 2, -height / 2);

    // تطبيق الفلاتر
    const selectedFilter = FILTERS.find((f) => f.id === state.filterType);
    let filterString = selectedFilter?.filter || "";

    filterString += ` brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%) hue-rotate(${state.hue}deg)`;

    if (state.blur > 0) {
      filterString += ` blur(${state.blur}px)`;
    }

    ctx.filter = filterString;

    // رسم الصورة
    ctx.drawImage(img, 0, 0, width, height);

    // تطبيق الحدة (يحتاج معالجة خاصة)
    if (state.sharpness > 0) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const sharpened = applySharpenFilter(imageData, state.sharpness / 100);
      ctx.putImageData(sharpened, 0, 0);
    }

    ctx.restore();
  };

  const applySharpenFilter = (
    imageData: ImageData,
    amount: number,
  ): ImageData => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const result = new ImageData(width, height);

    // مرشح الحدة
    const sharpenKernel = [
      0,
      -amount,
      0,
      -amount,
      1 + 4 * amount,
      -amount,
      0,
      -amount,
      0,
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pos = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += data[pos] * sharpenKernel[(ky + 1) * 3 + (kx + 1)];
            }
          }
          const pos = (y * width + x) * 4 + c;
          result.data[pos] = Math.max(0, Math.min(255, sum));
        }
        // Alpha channel
        result.data[(y * width + x) * 4 + 3] = data[(y * width + x) * 4 + 3];
      }
    }

    return result;
  };

  const handleSliderChange = (
    property: keyof EditingState,
    value: number[],
  ) => {
    setEditingState((prev) => ({ ...prev, [property]: value[0] }));
  };

  const handleToggle = (property: keyof EditingState) => {
    setEditingState((prev) => ({ ...prev, [property]: !prev[property] }));
  };

  const handleFilterChange = (filterId: string) => {
    setEditingState((prev) => ({ ...prev, filterType: filterId }));
  };

  const resetAllSettings = () => {
    setEditingState({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      sharpness: 0,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      filterType: "none",
      cropArea: null,
    });
  };

  const saveEditedImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsEditing(true);

    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const editedFile = new File(
              [blob],
              `edited_${imageFile?.name || "image.png"}`,
              {
                type: "image/png",
              },
            );
            onEditComplete(editedFile);
          }
          setIsEditing(false);
        },
        "image/png",
        0.95,
      );
    } catch (error) {
      console.error("Error saving edited image:", error);
      setIsEditing(false);
    }
  };

  if (!isVisible || !imageFile) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-strong w-full max-w-6xl max-h-[90vh] overflow-auto rounded-2xl">
        {/* شريط العنوان */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <i className="fas fa-edit text-2xl text-cyan-400"></i>
            <div>
              <h2 className="text-xl font-bold text-cyan-400">
                {t("محرر الصور المتكامل")}
              </h2>
              <p className="text-sm text-gray-400">
                {t("قص، تدوير، فلاتر، وتعديلات احترافية")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-red-400 text-red-400 hover:bg-red-400/20"
          >
            <i className="fas fa-times mr-2"></i>
            {t("إغلاق")}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* منطقة عرض الصورة */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass p-4">
              <div className="text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto border border-cyan-400/30 rounded-lg shadow-lg"
                />
              </div>
            </Card>

            {/* أزرار التحكم السريع */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleSliderChange("rotation", [editingState.rotation + 90])
                }
                className="border-blue-400 text-blue-400 hover:bg-blue-400/20"
              >
                <i className="fas fa-redo mr-2"></i>
                {t("دوران 90°")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggle("flipHorizontal")}
                className={`border-green-400 text-green-400 hover:bg-green-400/20 ${
                  editingState.flipHorizontal ? "bg-green-400/20" : ""
                }`}
              >
                <i className="fas fa-arrows-alt-h mr-2"></i>
                {t("انعكاس أفقي")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggle("flipVertical")}
                className={`border-purple-400 text-purple-400 hover:bg-purple-400/20 ${
                  editingState.flipVertical ? "bg-purple-400/20" : ""
                }`}
              >
                <i className="fas fa-arrows-alt-v mr-2"></i>
                {t("انعكاس عمودي")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllSettings}
                className="border-orange-400 text-orange-400 hover:bg-orange-400/20"
              >
                <i className="fas fa-undo mr-2"></i>
                {t("إعادة تعيين")}
              </Button>
            </div>
          </div>

          {/* لوحة التحكم */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 glass">
                <TabsTrigger value="adjust" className="text-xs">
                  <i className="fas fa-sliders-h mr-1"></i>
                  {t("تعديل")}
                </TabsTrigger>
                <TabsTrigger value="filters" className="text-xs">
                  <i className="fas fa-magic mr-1"></i>
                  {t("فلاتر")}
                </TabsTrigger>
                <TabsTrigger value="transform" className="text-xs">
                  <i className="fas fa-crop mr-1"></i>
                  {t("تحويل")}
                </TabsTrigger>
              </TabsList>

              {/* تبويب التعديلات */}
              <TabsContent value="adjust" className="space-y-4">
                <Card className="glass p-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                    {t("تعديل الألوان والإضاءة")}
                  </h3>

                  <div className="space-y-4">
                    {/* السطوع */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        <i className="fas fa-sun mr-2"></i>
                        {t("السطوع")}: {editingState.brightness}%
                      </label>
                      <Slider
                        value={[editingState.brightness]}
                        onValueChange={(value) =>
                          handleSliderChange("brightness", value)
                        }
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* التباين */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        <i className="fas fa-adjust mr-2"></i>
                        {t("التباين")}: {editingState.contrast}%
                      </label>
                      <Slider
                        value={[editingState.contrast]}
                        onValueChange={(value) =>
                          handleSliderChange("contrast", value)
                        }
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* التشبع */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        <i className="fas fa-tint mr-2"></i>
                        {t("التشبع")}: {editingState.saturation}%
                      </label>
                      <Slider
                        value={[editingState.saturation]}
                        onValueChange={(value) =>
                          handleSliderChange("saturation", value)
                        }
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* درجة اللون */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        <i className="fas fa-palette mr-2"></i>
                        {t("درجة اللون")}: {editingState.hue}°
                      </label>
                      <Slider
                        value={[editingState.hue]}
                        onValueChange={(value) =>
                          handleSliderChange("hue", value)
                        }
                        min={-180}
                        max={180}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="glass p-4">
                  <h3 className="text-lg font-semibold text-purple-400 mb-4">
                    {t("تأثيرات متقدمة")}
                  </h3>

                  <div className="space-y-4">
                    {/* الضبابية */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        <i className="fas fa-circle mr-2"></i>
                        {t("الضبابية")}: {editingState.blur}px
                      </label>
                      <Slider
                        value={[editingState.blur]}
                        onValueChange={(value) =>
                          handleSliderChange("blur", value)
                        }
                        min={0}
                        max={20}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    {/* الحدة */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        <i className="fas fa-search-plus mr-2"></i>
                        {t("الحدة")}: {editingState.sharpness}%
                      </label>
                      <Slider
                        value={[editingState.sharpness]}
                        onValueChange={(value) =>
                          handleSliderChange("sharpness", value)
                        }
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* تبويب الفلاتر */}
              <TabsContent value="filters" className="space-y-4">
                <Card className="glass p-4">
                  <h3 className="text-lg font-semibold text-pink-400 mb-4">
                    {t("فلاتر احترافية")}
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {FILTERS.map((filter) => (
                      <Button
                        key={filter.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilterChange(filter.id)}
                        className={`text-xs p-2 ${
                          editingState.filterType === filter.id
                            ? "border-pink-400 bg-pink-400/20 text-pink-400"
                            : "border-gray-600 hover:border-pink-400/50"
                        }`}
                      >
                        {t(filter.name)}
                      </Button>
                    ))}
                  </div>

                  {editingState.filterType !== "none" && (
                    <div className="mt-4 p-3 bg-pink-400/10 rounded-lg">
                      <Badge className="bg-pink-400/20 text-pink-400">
                        {t("فلتر نشط")}:{" "}
                        {t(
                          FILTERS.find((f) => f.id === editingState.filterType)
                            ?.name || "",
                        )}
                      </Badge>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* تبويب التحويل */}
              <TabsContent value="transform" className="space-y-4">
                <Card className="glass p-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">
                    {t("التدوير والانعكاس")}
                  </h3>

                  <div className="space-y-4">
                    {/* التدوير */}
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        <i className="fas fa-redo mr-2"></i>
                        {t("التدوير")}: {editingState.rotation}°
                      </label>
                      <Slider
                        value={[editingState.rotation]}
                        onValueChange={(value) =>
                          handleSliderChange("rotation", value)
                        }
                        min={-180}
                        max={180}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* أزرار سريعة للتدوير */}
                    <div className="grid grid-cols-4 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSliderChange("rotation", [0])}
                        className="border-green-400 text-green-400 hover:bg-green-400/20"
                      >
                        0°
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSliderChange("rotation", [90])}
                        className="border-green-400 text-green-400 hover:bg-green-400/20"
                      >
                        90°
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSliderChange("rotation", [180])}
                        className="border-green-400 text-green-400 hover:bg-green-400/20"
                      >
                        180°
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSliderChange("rotation", [270])}
                        className="border-green-400 text-green-400 hover:bg-green-400/20"
                      >
                        270°
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* أزرار الحفظ والإلغاء */}
            <div className="space-y-3">
              <Button
                onClick={saveEditedImage}
                disabled={isEditing}
                className="w-full bg-gradient-to-r from-green-500 to-cyan-500 text-white hover:from-green-400 hover:to-cyan-400 py-3"
              >
                {isEditing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {t("جاري الحفظ...")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    {t("حفظ التعديلات")}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={onClose}
                className="w-full border-gray-600 text-gray-400 hover:bg-gray-700"
              >
                <i className="fas fa-times mr-2"></i>
                {t("إلغاء")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
