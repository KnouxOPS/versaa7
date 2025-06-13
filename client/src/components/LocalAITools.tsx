import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";

// تعريف أنواع الأدوات
interface LocalAITool {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  category:
    | "face"
    | "body"
    | "background"
    | "artistic"
    | "enhancement"
    | "advanced";
  rating: "⭐" | "🔞";
  description: string;
  model: string;
  features: string[];
  settings?: Record<string, any>;
  isLocal: boolean;
  size: string;
  processingTime: string;
}

// الأدوات الـ30 الكاملة
const LOCAL_AI_TOOLS: LocalAITool[] = [
  // 🔥 أدوات تعديل الوجه
  {
    id: "face_swap",
    name: "تبديل الوجه",
    nameEn: "Face Swap",
    icon: "fas fa-exchange-alt",
    category: "face",
    rating: "🔞",
    description:
      "تبديل الوجوه بدقة عالية وواقعية مذهلة - تقنية DeepFaceLab المتقدمة",
    model: "DeepFaceLab SAEHD",
    features: [
      "تبديل فوري للوجوه",
      "حفظ ملامح الوجه الطبيعية",
      "دعم الفيديو والصور",
      "تعديل الإضاءة تلقائياً",
    ],
    isLocal: true,
    size: "1.2GB",
    processingTime: "5-15 ثانية",
  },
  {
    id: "beauty_filter",
    name: "فلتر الجمال الذكي",
    nameEn: "AI Beauty Filter",
    icon: "fas fa-magic",
    category: "face",
    rating: "⭐",
    description: "تحسين الجمال الطبيعي بذكاء اصطناعي متقدم - فلاتر احترافية",
    model: "Phi-3 Vision",
    features: [
      "تنعيم البشرة الذكي",
      "تكبير العيون طبيعياً",
      "تحديد الفك والخدود",
      "إزالة العيوب والبقع",
    ],
    isLocal: true,
    size: "2.4GB",
    processingTime: "2-5 ثواني",
  },
  {
    id: "face_expression",
    name: "تغيير التعبيرات",
    nameEn: "Expression Changer",
    icon: "fas fa-smile",
    category: "face",
    rating: "⭐",
    description: "تعديل تعبيرات الوجه (ابتسامة، حزن، مفاجأة...) بواقعية مذهلة",
    model: "Phi-3 Vision",
    features: [
      "تعديل الابتسامة والضحك",
      "تغيير نظرة العينين",
      "تعديل حركة الحواجب",
      "تحكم كامل في التعبيرات",
    ],
    isLocal: true,
    size: "2.4GB",
    processingTime: "3-8 ثواني",
  },
  {
    id: "age_transform",
    name: "آلة الزمن",
    nameEn: "Age Transformation",
    icon: "fas fa-clock",
    category: "face",
    rating: "⭐",
    description: "تصغير أو تكبير السن بواقعية مذهلة - سافر عبر الزمن!",
    model: "Stable Diffusion XL",
    features: [
      "تصغير السن طبيعياً",
      "تكبير السن بواقعية",
      "الحفاظ على ملامح الهوية",
      "تدرج عمري متقدم",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "8-15 ثانية",
  },
  {
    id: "gender_swap",
    name: "تحويل الجنس",
    nameEn: "Gender Swap",
    icon: "fas fa-venus-mars",
    category: "face",
    rating: "🔞",
    description: "تحويل الجنس بواقعية كاملة مع الحفاظ على الهوية الأساسية",
    model: "Stable Diffusion XL",
    features: [
      "تأنيث أو تذكير الملامح",
      "الحفاظ على الهوية",
      "تعديل ملامح الوجه",
      "واقعية عالية الدقة",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "10-20 ثانية",
  },
  {
    id: "makeup_artist",
    name: "فنان المكياج الرقمي",
    nameEn: "AI Makeup Artist",
    icon: "fas fa-palette",
    category: "face",
    rating: "⭐",
    description: "إضافة أو إزالة المكياج بأساليب مختلفة - كأنك في صالون تجميل!",
    model: "Phi-3 Vision",
    features: [
      "مكياج طبيعي وجلامور",
      "أساليب عربية وآسيوية",
      "إزالة المكياج الموجود",
      "تجربة ألوان مختلفة",
    ],
    isLocal: true,
    size: "2.4GB",
    processingTime: "3-7 ثواني",
  },

  // 🎨 أدوات تعديل الجسم
  {
    id: "body_reshape",
    name: "نحت الجسم الرقمي",
    nameEn: "Body Reshape",
    icon: "fas fa-dumbbell",
    category: "body",
    rating: "🔞",
    description: "تنحيف أو تضخ��م أجزاء الجسم بدقة احترافية - جراح تجميل رقمي!",
    model: "Segment Anything + SD",
    features: [
      "تنحيف الخصر والبطن",
      "تكبير أو تصغير الأرداف",
      "تعديل حجم الصدر",
      "تقوية العضلات",
    ],
    isLocal: true,
    size: "9.5GB",
    processingTime: "10-25 ثانية",
  },
  {
    id: "clothing_swap",
    name: "خزانة الملابس السحرية",
    nameEn: "Clothing Swap",
    icon: "fas fa-tshirt",
    category: "body",
    rating: "🔞",
    description: "إضافة أو إزالة أو تغيير الملابس بأي أسلوب - حرية كاملة!",
    model: "Stable Diffusion XL",
    features: [
      "إضافة ملابس جديدة",
      "تغيير أنماط الأزياء",
      "إزالة الملابس بذكاء",
      "ملابس تقليدية وعصرية",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "12-20 ثانية",
  },
  {
    id: "tattoo_artist",
    name: "استوديو الوشم الرقمي",
    nameEn: "Tattoo Artist",
    icon: "fas fa-dragon",
    category: "body",
    rating: "⭐",
    description: "إضافة أو إزالة الوشوم والرسوم على الجسم - فنان وشم محترف!",
    model: "Stable Diffusion XL",
    features: [
      "وشوم مخصصة بأي تصميم",
      "إزالة الوشوم الموجودة",
      "وشوم عربية وآسيوية",
      "تعديل ألوان الوشوم",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "8-15 ثانية",
  },
  {
    id: "muscle_enhancer",
    name: "مقوي العضلات",
    nameEn: "Muscle Enhancer",
    icon: "fas fa-fist-raised",
    category: "body",
    rating: "⭐",
    description: "تقوية وتحديد عضلات الجسم بشكل طبيعي - صالة جيم رقمية!",
    model: "Stable Diffusion XL",
    features: [
      "تقوية العضلات طبيعياً",
      "تحديد عضلات البطن",
      "تكبير العضلات بواقعية",
      "شكل رياضي احترافي",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "8-18 ثانية",
  },

  // 🌟 أدوات الخلفية والبيئة
  {
    id: "bg_remover",
    name: "ممحاة الخلفية السحرية",
    nameEn: "Magic Background Remover",
    icon: "fas fa-eraser",
    category: "background",
    rating: "⭐",
    description: "إزالة الخلفية بدقة عالية مع الحفاظ على أدق التفاصيل",
    model: "Segment Anything",
    features: [
      "كشف الحواف الذكي",
      "حفظ تفاصيل الشعر",
      "خلفية شفافة فورية",
      "دقة احترافية",
    ],
    isLocal: true,
    size: "2.6GB",
    processingTime: "1-3 ثواني",
  },
  {
    id: "bg_replacer",
    name: "بوابة الأبعاد",
    nameEn: "Dimension Portal",
    icon: "fas fa-globe",
    category: "background",
    rating: "⭐",
    description: "استبدال الخلفية بأي منظر أو بيئة - سافر لأي مكان في العالم!",
    model: "Stable Diffusion XL",
    features: [
      "خلفيات طبيعية خلابة",
      "مدن ومعالم عالمية",
      "فضاء ونجوم",
      "خلفيات خيالية",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "5-12 ثانية",
  },
  {
    id: "lighting_master",
    name: "سيد الإضاءة",
    nameEn: "Lighting Master",
    icon: "fas fa-lightbulb",
    category: "background",
    rating: "⭐",
    description: "تعديل الإضاءة والظلال بشكل احترافي - مصور محترف!",
    model: "Phi-3 Vision",
    features: [
      "إضاءة طبيعية ودافئة",
      "إضاءة استوديو احترافية",
      "إضاءة درامية وسينمائية",
      "تحكم كامل في الظلال",
    ],
    isLocal: true,
    size: "2.4GB",
    processingTime: "4-8 ثواني",
  },

  // 🎭 أدوات التحويل الفني
  {
    id: "style_transfer",
    name: "آلة الفن السحرية",
    nameEn: "Art Magic Machine",
    icon: "fas fa-paint-brush",
    category: "artistic",
    rating: "⭐",
    description: "تحويل الصورة لأي أسلوب فني أو رسم - كن فناناً عالمياً!",
    model: "Stable Diffusion XL",
    features: [
      "أنمي ياباني احترافي",
      "فان جوخ وبيكاسو",
      "فن إسلامي تقليدي",
      "رسم رقمي عصري",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "8-15 ثانية",
  },
  {
    id: "cartoonizer",
    name: "محول عالم الكرتون",
    nameEn: "Cartoon World",
    icon: "fas fa-smile-beam",
    category: "artistic",
    rating: "⭐",
    description: "تحويل الصور الحقيقية إلى رسم كرتوني - ادخل عالم ديزني!",
    model: "Stable Diffusion XL",
    features: [
      "كرتون ديزني كلاسيكي",
      "أنمي مانجا ياباني",
      "كرتون أطفال مرح",
      "رسم كاريكاتوري",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "6-12 ثانية",
  },
  {
    id: "colorizer",
    name: "آلة الزمن الملونة",
    nameEn: "Time Color Machine",
    icon: "fas fa-rainbow",
    category: "artistic",
    rating: "⭐",
    description: "تلوين الصور الأبيض والأسود بذكاء - أحيي ذكرياتك القديمة!",
    model: "Stable Diffusion XL",
    features: [
      "تلوين تلقائي ذكي",
      "ألوان طبيعية وواقعية",
      "تلوين الصور التاريخية",
      "إعادة إحياء الذكريات",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "5-10 ثواني",
  },

  // 🔧 أدوات التحسين التقني
  {
    id: "super_resolution",
    name: "محسن الدقة الخارق",
    nameEn: "Super Resolution",
    icon: "fas fa-search-plus",
    category: "enhancement",
    rating: "⭐",
    description: "تحسين جودة ودقة الصور حتى 8K - تقنية Real-ESRGAN المتقدمة",
    model: "Real-ESRGAN x4+",
    features: [
      "دقة 4K و 8K",
      "تحسين الصور القديمة",
      "استعادة التفاصيل",
      "وضوح خارق",
    ],
    isLocal: true,
    size: "67MB",
    processingTime: "3-8 ثواني",
  },
  {
    id: "denoiser",
    name: "منظف الصور الذكي",
    nameEn: "Smart Image Cleaner",
    icon: "fas fa-broom",
    category: "enhancement",
    rating: "⭐",
    description: "إزالة الضوضاء والتشويش من الصور بدقة خارقة",
    model: "Real-ESRGAN",
    features: [
      "إزالة التشويش كاملة",
      "تنظيف الصور القديمة",
      "تحسين وضوح الكتابة",
      "إزالة العيوب التقنية",
    ],
    isLocal: true,
    size: "67MB",
    processingTime: "2-5 ثواني",
  },
  {
    id: "sharpener",
    name: "مقوي الحدة الاحترافي",
    nameEn: "Pro Sharpener",
    icon: "fas fa-eye",
    category: "enhancement",
    rating: "⭐",
    description: "تحسين حدة وتفاصيل الصور مع الحفاظ على الطبيعية",
    model: "Real-ESRGAN",
    features: [
      "حدة طبيعية متقدمة",
      "تحسين التفاصيل الدقيقة",
      "حفظ الجودة الأصلية",
      "تحسين صور السيلفي",
    ],
    isLocal: true,
    size: "67MB",
    processingTime: "1-3 ثواني",
  },

  // 🎯 أدوات التعديل المتقدم
  {
    id: "object_remover",
    name: "ممحاة العناصر السحرية",
    nameEn: "Magic Object Eraser",
    icon: "fas fa-magic",
    category: "advanced",
    rating: "⭐",
    description: "إزالة أي عنصر من الصورة بذكاء خارق - كأنه لم يكن موجوداً!",
    model: "Segment Anything",
    features: [
      "إزالة فورية للعناصر",
      "ملء ذكي للفراغات",
      "حفظ الخلفية الطبيعية",
      "دقة احترافية",
    ],
    isLocal: true,
    size: "2.6GB",
    processingTime: "3-8 ثواني",
  },
  {
    id: "object_replacer",
    name: "مبدل العوالم",
    nameEn: "World Changer",
    icon: "fas fa-exchange-alt",
    category: "advanced",
    rating: "⭐",
    description: "استبدال أي عنصر بعنصر آخر بذكاء خارق",
    model: "Stable Diffusion + SAM",
    features: [
      "استبدال السيارات بأخرى",
      "تغيير الحيوانات والطيور",
      "استبدال الأثاث",
      "تحويل المباني",
    ],
    isLocal: true,
    size: "9.5GB",
    processingTime: "8-15 ثانية",
  },
  {
    id: "smart_crop",
    name: "القاص الذكي",
    nameEn: "Smart Cropper",
    icon: "fas fa-crop",
    category: "advanced",
    rating: "⭐",
    description: "قص الصور بتركيز على العناصر المهمة - مصور محترف!",
    model: "Segment Anything",
    features: [
      "قص تلقائي ذكي",
      "تركيز على الوجوه",
      "قص للسوشيال ميديا",
      "حفظ العناصر المهمة",
    ],
    isLocal: true,
    size: "2.6GB",
    processingTime: "1-3 ثواني",
  },
  {
    id: "image_merger",
    name: "دامج الأبعاد",
    nameEn: "Dimension Merger",
    icon: "fas fa-layer-group",
    category: "advanced",
    rating: "⭐",
    description: "دمج صورتين أو أكثر بطريقة ذكية وسحرية",
    model: "Stable Diffusion XL",
    features: [
      "دمج ذكي للصور",
      "تكوين فني احترافي",
      "دمج الوجوه والأجسام",
      "إبداع صور خيالية",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "10-20 ثانية",
  },
  {
    id: "pose_editor",
    name: "محرر الوضعيات",
    nameEn: "Pose Master",
    icon: "fas fa-running",
    category: "advanced",
    rating: "🔞",
    description: "تعديل وضعية الجسم والأطراف بحرية كاملة",
    model: "ControlNet + SD",
    features: [
      "تعديل وضعية الجسم",
      "تحريك الأطراف",
      "وضعيات رياضية",
      "وضعيات فنية",
    ],
    isLocal: true,
    size: "8.3GB",
    processingTime: "12-25 ثانية",
  },
  {
    id: "hair_stylist",
    name: "مصفف الشعر الرقمي",
    nameEn: "Digital Hair Stylist",
    icon: "fas fa-cut",
    category: "advanced",
    rating: "⭐",
    description: "تغيير تسريحة ولون الشعر - صالون تجميل رقمي!",
    model: "Stable Diffusion XL",
    features: [
      "تسريحات عصرية وكلاسيكية",
      "ألوان شعر طبيعية وجريئة",
      "شعر قصير وطويل",
      "تسريحات عربية وعالمية",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "6-12 ثانية",
  },

  // أدوات إضافية متقدمة
  {
    id: "eye_color_changer",
    name: "مغير لون العيون",
    nameEn: "Eye Color Changer",
    icon: "fas fa-eye",
    category: "face",
    rating: "⭐",
    description: "تغيير لون العيون بألوان طبيعية وخيالية",
    model: "Phi-3 Vision",
    features: [
      "ألوان عيون طبيعية",
      "عيون ملونة خيالية",
      "عيون متدرجة اللون",
      "تأثيرات نيون وسحرية",
    ],
    isLocal: true,
    size: "2.4GB",
    processingTime: "2-5 ثواني",
  },
  {
    id: "teeth_whitener",
    name: "مبيض الأسنان",
    nameEn: "Teeth Whitener",
    icon: "fas fa-tooth",
    category: "face",
    rating: "⭐",
    description: "تبييض الأسنان وتحسين الابتسامة بشكل طبيعي",
    model: "Phi-3 Vision",
    features: [
      "تبييض طبيعي للأسنان",
      "تحسين شكل الأسنان",
      "ابتسامة هوليوود",
      "تعديل اللثة",
    ],
    isLocal: true,
    size: "2.4GB",
    processingTime: "2-4 ثواني",
  },
  {
    id: "scar_remover",
    name: "مزيل الندوب والعيوب",
    nameEn: "Scar & Blemish Remover",
    icon: "fas fa-band-aid",
    category: "face",
    rating: "⭐",
    description: "إزالة الندوب والعيوب والحبوب من البشرة",
    model: "Phi-3 Vision",
    features: [
      "إزالة الندوب القديمة",
      "علاج الحبوب والبقع",
      "تنعيم البشرة",
      "بشرة مثالية طبيعية",
    ],
    isLocal: true,
    size: "2.4GB",
    processingTime: "3-6 ثواني",
  },
  {
    id: "virtual_jewelry",
    name: "مجوهرات افتراضية",
    nameEn: "Virtual Jewelry",
    icon: "fas fa-gem",
    category: "advanced",
    rating: "⭐",
    description: "إضافة مجوهرات وإكسسوارات افتراضية بواقعية عالية",
    model: "Stable Diffusion XL",
    features: [
      "أقراط وخواتم ذهبية",
      "قلادات وأساور فضية",
      "مجوهرات ماسية",
      "إكسسوارات عصرية",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "5-10 ثواني",
  },
  {
    id: "vintage_filter",
    name: "فلتر الحنين",
    nameEn: "Vintage Time Filter",
    icon: "fas fa-history",
    category: "artistic",
    rating: "⭐",
    description: "تحويل الصور لأساليب فوتوغرافية قديمة وكلاسيكية",
    model: "Stable Diffusion XL",
    features: [
      "صور بالأبيض والأسود",
      "تأثير السينما القديمة",
      "فلاتر السبعينات والثمانينات",
      "صور عتيقة أنيقة",
    ],
    isLocal: true,
    size: "6.9GB",
    processingTime: "4-8 ثواني",
  },
];

interface LocalAIToolsProps {
  onToolSelect: (tool: LocalAITool) => void;
  selectedTool: string | null;
}

export function LocalAITools({
  onToolSelect,
  selectedTool,
}: LocalAIToolsProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>(
    {},
  );
  const [downloadProgress, setDownloadProgress] = useState<
    Record<string, number>
  >({});
  const [installedModels, setInstalledModels] = useState<Set<string>>(
    new Set(),
  );

  const categories = [
    {
      id: "all",
      name: "جميع الأدوات",
      nameEn: "All Tools",
      icon: "fas fa-th-large",
      color: "text-white",
    },
    {
      id: "face",
      name: "تعديل الوجه",
      nameEn: "Face Tools",
      icon: "fas fa-smile",
      color: "text-cyan-400",
    },
    {
      id: "body",
      name: "تعديل الجسم",
      nameEn: "Body Tools",
      icon: "fas fa-user",
      color: "text-purple-400",
    },
    {
      id: "background",
      name: "الخلفية والبيئة",
      nameEn: "Background",
      icon: "fas fa-image",
      color: "text-green-400",
    },
    {
      id: "artistic",
      name: "الفن والإبداع",
      nameEn: "Artistic",
      icon: "fas fa-palette",
      color: "text-pink-400",
    },
    {
      id: "enhancement",
      name: "التحسين التقني",
      nameEn: "Enhancement",
      icon: "fas fa-sparkles",
      color: "text-emerald-400",
    },
    {
      id: "advanced",
      name: "أدوات متقدمة",
      nameEn: "Advanced",
      icon: "fas fa-cogs",
      color: "text-orange-400",
    },
  ];

  const filteredTools = LOCAL_AI_TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadModel = async (tool: LocalAITool) => {
    setIsDownloading((prev) => ({ ...prev, [tool.id]: true }));
    setDownloadProgress((prev) => ({ ...prev, [tool.id]: 0 }));

    // محاكاة تحميل النموذج
    for (let progress = 0; progress <= 100; progress += 2) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setDownloadProgress((prev) => ({ ...prev, [tool.id]: progress }));
    }

    setIsDownloading((prev) => ({ ...prev, [tool.id]: false }));
    setInstalledModels((prev) => new Set([...prev, tool.model]));
  };

  const isModelInstalled = (tool: LocalAITool) => {
    return installedModels.has(tool.model);
  };

  const getRatingIcon = (rating: string) => {
    return rating === "🔞" ? (
      <Badge
        variant="destructive"
        className="text-xs bg-red-500/20 text-red-400"
      >
        <i className="fas fa-exclamation-triangle mr-1"></i>
        +18
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="text-xs bg-green-500/20 text-green-400"
      >
        <i className="fas fa-star mr-1"></i>
        آمن
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* عنوان رئيسي */}
      <div className="text-center">
        <h1 className="text-4xl font-bold neon-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
          🚀 KNOUX VERSA - النظام المحلي الكامل
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          {t("30 أداة ذكاء اصطناعي متقدمة - تعمل بالكامل على جهازك")}
        </p>
        <div className="flex justify-center items-center space-x-4 mb-6">
          <Badge className="bg-cyan-400/20 text-cyan-400 px-4 py-2">
            <i className="fas fa-shield-alt mr-2"></i>
            {t("100% محلي وآمن")}
          </Badge>
          <Badge className="bg-purple-400/20 text-purple-400 px-4 py-2">
            <i className="fas fa-infinity mr-2"></i>
            {t("حرية بلا حدود")}
          </Badge>
          <Badge className="bg-green-400/20 text-green-400 px-4 py-2">
            <i className="fas fa-bolt mr-2"></i>
            {t("معالجة فورية")}
          </Badge>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder={t("ابحث عن أي أداة...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-cyan-400/30 rounded-full px-4 py-3 pl-12 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-all duration-300"
          />
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400"></i>
        </div>
      </div>

      {/* فلتر الفئات */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              glass rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105
              ${
                selectedCategory === category.id
                  ? `border-2 ${category.color} bg-opacity-20 neon-glow transform scale-105`
                  : "border border-gray-600 hover:border-gray-400"
              }
            `}
          >
            <i className={`${category.icon} mr-2 ${category.color}`}></i>
            {t(category.name)}
          </button>
        ))}
      </div>

      {/* عداد الأدوات */}
      <div className="text-center">
        <p className="text-gray-400">
          <span className="text-cyan-400 font-bold text-2xl">
            {filteredTools.length}
          </span>{" "}
          {t("أداة ذكاء اصطناعي متاحة")}
          {selectedCategory !== "all" && (
            <span className="ml-2">
              •{" "}
              <span className="text-purple-400">
                {t(
                  categories.find((c) => c.id === selectedCategory)?.name || "",
                )}
              </span>
            </span>
          )}
        </p>
      </div>

      {/* شبكة الأدوات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool, index) => (
          <Card
            key={tool.id}
            className={`
              glass-strong rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:shadow-2xl group animate-float relative overflow-hidden
              ${selectedTool === tool.id ? "border-cyan-400 bg-cyan-400/10 neon-glow scale-105" : "hover:border-cyan-400/50 hover:scale-105"}
              ${tool.rating === "🔞" ? "border-red-500/30" : "border-green-500/30"}
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onToolSelect(tool)}
          >
            {/* التقييم */}
            <div className="absolute top-3 right-3">
              {getRatingIcon(tool.rating)}
            </div>

            {/* أيقونة الأداة */}
            <div className="w-16 h-16 rounded-xl mb-4 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
              <i
                className={`${tool.icon} text-2xl text-cyan-400 group-hover:text-white transition-colors duration-300`}
              ></i>
              {isModelInstalled(tool) && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
              )}
            </div>

            {/* اسم الأداة */}
            <h3 className="text-lg font-bold text-cyan-400 neon-text mb-2 group-hover:text-white transition-colors duration-300">
              {t(tool.name)}
            </h3>
            <p className="text-sm text-gray-400 mb-1">{tool.nameEn}</p>

            {/* الوصف */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
              {tool.description}
            </p>

            {/* معلومات النموذج */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{t("النموذج")}:</span>
                <span className="text-purple-400 font-semibold">
                  {tool.model}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{t("الحجم")}:</span>
                <span className="text-cyan-400">{tool.size}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{t("زمن المعالجة")}:</span>
                <span className="text-green-400">{tool.processingTime}</span>
              </div>
            </div>

            {/* المميزات */}
            <div className="space-y-1 mb-4">
              {tool.features.slice(0, 2).map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center text-xs text-gray-300"
                >
                  <i className="fas fa-check text-green-400 mr-2"></i>
                  {feature}
                </div>
              ))}
            </div>

            {/* أزرار التحكم */}
            <div className="space-y-2">
              {!isModelInstalled(tool) && (
                <>
                  {isDownloading[tool.id] ? (
                    <div className="space-y-2">
                      <Progress
                        value={downloadProgress[tool.id]}
                        className="h-2"
                      />
                      <p className="text-xs text-cyan-400 text-center">
                        {t("جاري التحميل")} {downloadProgress[tool.id]}%
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadModel(tool);
                      }}
                      className="w-full bg-cyan-400/20 border-cyan-400 hover:bg-cyan-400/30 text-cyan-400 hover:text-white"
                      size="sm"
                    >
                      <i className="fas fa-download mr-2"></i>
                      {t("تحميل النموذج")}
                    </Button>
                  )}
                </>
              )}

              {isModelInstalled(tool) && (
                <Button
                  className="w-full bg-green-400/20 border-green-400 hover:bg-green-400/30 text-green-400 hover:text-white"
                  size="sm"
                >
                  <i className="fas fa-play mr-2"></i>
                  {t("استخدام الأداة")}
                </Button>
              )}
            </div>

            {/* مؤشر التحديد */}
            {selectedTool === tool.id && (
              <div className="absolute top-2 left-2">
                <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse-glow"></div>
              </div>
            )}

            {/* تأثير الهوفر */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/5 group-hover:to-purple-400/5 transition-all duration-300 rounded-2xl pointer-events-none"></div>
          </Card>
        ))}
      </div>

      {/* رسالة عدم وجود نتائج */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-search text-6xl text-gray-600 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            {t("لم يتم العثور على أدوات")}
          </h3>
          <p className="text-gray-500">
            {t("جرب البحث بكلمات مختلفة أو اختر فئة أخرى")}
          </p>
        </div>
      )}

      {/* معلومات إضافية */}
      <div className="text-center pt-8 border-t border-gray-700">
        <p className="text-gray-400 mb-4">
          🔥 <strong className="text-cyan-400">كلمة السر للنجاح:</strong> "حرية
          بلا حدود مع KnouxAI"
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="flex items-center text-green-400">
            <i className="fas fa-shield-alt mr-2"></i>
            خصوصية مطلقة
          </span>
          <span className="flex items-center text-cyan-400">
            <i className="fas fa-bolt mr-2"></i>
            معالجة فورية
          </span>
          <span className="flex items-center text-purple-400">
            <i className="fas fa-code mr-2"></i>
            مفتوح المصدر
          </span>
          <span className="flex items-center text-orange-400">
            <i className="fas fa-infinity mr-2"></i>
            بلا حدود
          </span>
        </div>
      </div>
    </div>
  );
}
