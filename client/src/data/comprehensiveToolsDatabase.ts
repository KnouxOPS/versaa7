import {
  AiTool,
  AIModelIdentifier,
  ToolFeature,
  AIModelInfo,
} from "@/shared/types";

// Comprehensive database of all 30 AI Tools for KNOUX-VERSA
export const COMPREHENSIVE_AI_TOOLS: AiTool[] = [
  // ==================== FACE CATEGORY ====================
  {
    id: "face_swap",
    name_ar: "تبديل الوجه المتقدم",
    name_en: "Advanced Face Swap",
    description_ar:
      "تبديل الوجوه بدقة عالية وواقعية مذهلة باستخدام تقنيات التعلم العميق",
    description_en:
      "Swap faces with stunning high precision and realism using deep learning techniques",
    category: "Face",
    model_info: {
      name: "DeepFaceLab-SAEHD",
      backend_identifier: AIModelIdentifier.DEEPFACELAB_SAEHD,
      size_gb: 1.2,
      processing_time_secs: "5-15",
      gpu_required: true,
      min_vram_gb: 4,
    },
    features: [
      {
        description_ar: "تبديل فوري للوجوه",
        description_en: "Instant face swapping",
      },
      {
        description_ar: "حفظ ملامح الوجه الطبيعية",
        description_en: "Preserves natural face features",
      },
      {
        description_ar: "دعم الوجوه المتعددة",
        description_en: "Multi-face support",
      },
      {
        description_ar: "تحسين تلقائي للإضاءة",
        description_en: "Automatic lighting adjustment",
      },
    ],
    is_sensitive: true,
    requires_mask: true,
    requires_prompt: false,
    requires_second_image: true,
    input_types: ["image", "image2", "mask"],
    input_schema: {
      image2_base64: {
        type: "string",
        required: true,
        description: "Target face image",
      },
    },
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "تبديل الوجه المتقدم" : "Advanced Face Swap",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "تبديل الوجوه بدقة عالية وواقعية مذهلة باستخدام تقنيات التعلم العميق"
        : "Swap faces with stunning high precision and realism using deep learning techniques",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "تبديل فوري للوجوه" : "Instant face swapping",
      lang === "ar"
        ? "حفظ ملامح الوجه الطبيعية"
        : "Preserves natural face features",
      lang === "ar" ? "دعم الوجوه المتعددة" : "Multi-face support",
      lang === "ar" ? "تحسين تلقائي للإضاءة" : "Automatic lighting adjustment",
    ],
  },

  {
    id: "ai_beauty_filter",
    name_ar: "فلتر الجمال الذكي",
    name_en: "AI Beauty Filter",
    description_ar: "تحسين الجمال الطبيعي بذكاء اصطناعي متقدم - فلاتر احترافية",
    description_en:
      "Enhance natural beauty with advanced AI - professional filters",
    category: "Face",
    model_info: {
      name: "Phi-3 Vision",
      backend_identifier: AIModelIdentifier.PHI3_VISION,
      size_gb: 2.4,
      processing_time_secs: "2-5",
      gpu_required: false,
    },
    features: [
      {
        description_ar: "تنعيم البشرة الذكي",
        description_en: "Smart skin smoothing",
      },
      {
        description_ar: "تكبير العيون طبيعياً",
        description_en: "Natural eye enlargement",
      },
      {
        description_ar: "تحسين الإضاءة",
        description_en: "Lighting enhancement",
      },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    input_types: ["image"],
    input_schema: {
      intensity: { type: "number", minimum: 0, maximum: 100, default: 50 },
    },
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "فلتر الجمال الذكي" : "AI Beauty Filter",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "تحسين الجمال الطبيعي بذكاء اصطناعي متقدم - فلاتر احترافية"
        : "Enhance natural beauty with advanced AI - professional filters",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "تنعيم البشرة الذكي" : "Smart skin smoothing",
      lang === "ar" ? "تكبير العيون طبيعياً" : "Natural eye enlargement",
      lang === "ar" ? "تحسين الإضاءة" : "Lighting enhancement",
    ],
  },

  {
    id: "age_modifier",
    name_ar: "محرر العمر",
    name_en: "Age Modifier",
    description_ar: "تعديل العمر في الصور - جعل الشخص أصغر أو أكبر سناً",
    description_en: "Modify age in photos - make person younger or older",
    category: "Face",
    model_info: {
      name: "Phi-3 Vision",
      backend_identifier: AIModelIdentifier.PHI3_VISION,
      size_gb: 2.4,
      processing_time_secs: "3-8",
    },
    features: [
      {
        description_ar: "تقليل العمر بشكل طبيعي",
        description_en: "Natural age reduction",
      },
      {
        description_ar: "زيادة العمر واقعياً",
        description_en: "Realistic age progression",
      },
      {
        description_ar: "حفظ الهوية الأساسية",
        description_en: "Preserve core identity",
      },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    input_types: ["image"],
    input_schema: {
      age_adjustment: { type: "number", minimum: -30, maximum: 30, default: 0 },
    },
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "محرر العمر" : "Age Modifier",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "تعديل العمر في الصور - جعل الشخص أصغر أو أكبر سناً"
        : "Modify age in photos - make person younger or older",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "تقليل العمر بشكل طبيعي" : "Natural age reduction",
      lang === "ar" ? "زيادة العمر واقعياً" : "Realistic age progression",
      lang === "ar" ? "حفظ الهوية الأساسية" : "Preserve core identity",
    ],
  },

  {
    id: "expression_changer",
    name_ar: "مغير التعبيرات",
    name_en: "Expression Changer",
    description_ar: "تغيير تعبيرات الوجه - ابتسامة، حزن، غضب، مفاجأة",
    description_en: "Change facial expressions - smile, sad, angry, surprise",
    category: "Face",
    model_info: {
      name: "Phi-3 Vision",
      backend_identifier: AIModelIdentifier.PHI3_VISION,
      size_gb: 2.4,
      processing_time_secs: "2-6",
    },
    features: [
      {
        description_ar: "تعبيرات طبيعية",
        description_en: "Natural expressions",
      },
      {
        description_ar: "تحكم دقيق بالعضلات",
        description_en: "Precise muscle control",
      },
      {
        description_ar: "حفظ ملامح الوجه",
        description_en: "Preserve facial features",
      },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    input_types: ["image"],
    input_schema: {
      expression: {
        type: "string",
        enum: ["smile", "sad", "angry", "surprise", "neutral"],
      },
    },
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "مغير التعبيرات" : "Expression Changer",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "تغيير تعبيرات الوجه - ابتسامة، حزن، غضب، مفاجأة"
        : "Change facial expressions - smile, sad, angry, surprise",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "تعبيرات طبيعية" : "Natural expressions",
      lang === "ar" ? "تحكم دقيق بالعضلات" : "Precise muscle control",
      lang === "ar" ? "حفظ ملامح الوجه" : "Preserve facial features",
    ],
  },

  // ==================== BODY CATEGORY ====================
  {
    id: "pose_master",
    name_ar: "مايستro الوضعيات",
    name_en: "Pose Master",
    description_ar: "تعديل وضعية الجسم والأطراف بذكاء اصطناعي متطور",
    description_en: "Modify body and limb poses with advanced AI",
    category: "Body",
    model_info: {
      name: "ControlNet",
      backend_identifier: AIModelIdentifier.CONTROLNET,
      size_gb: 1.4,
      processing_time_secs: "5-12",
      gpu_required: true,
    },
    features: [
      {
        description_ar: "تحكم دقيق بالمفاصل",
        description_en: "Precise joint control",
      },
      { description_ar: "وضعيات طبيعية", description_en: "Natural poses" },
      {
        description_ar: "حفظ تناسق الجسم",
        description_en: "Maintain body proportions",
      },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    input_types: ["image"],
    input_schema: {
      pose_description: {
        type: "string",
        description: "Describe the desired pose",
      },
    },
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "مايسترو الوضعيات" : "Pose Master",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "تعديل وضعية الجسم والأطراف بذكاء اصطناعي متطور"
        : "Modify body and limb poses with advanced AI",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "تحكم دقيق بالمفاصل" : "Precise joint control",
      lang === "ar" ? "وضعيات طبيعية" : "Natural poses",
      lang === "ar" ? "حفظ تناسق الجسم" : "Maintain body proportions",
    ],
  },

  {
    id: "clothing_swap",
    name_ar: "مبدل الملابس",
    name_en: "Clothing Swap",
    description_ar: "تغيير الملابس والأزيا�� بواقعية عالية",
    description_en: "Change clothes and outfits with high realism",
    category: "Body",
    model_info: {
      name: "Stable Diffusion XL",
      backend_identifier: AIModelIdentifier.STABLE_DIFFUSION_XL,
      size_gb: 6.9,
      processing_time_secs: "8-15",
      gpu_required: true,
      min_vram_gb: 6,
    },
    features: [
      { description_ar: "ملابس واقعية", description_en: "Realistic clothing" },
      {
        description_ar: "حفظ شكل الجسم",
        description_en: "Preserve body shape",
      },
      { description_ar: "إضاءة طبيعية", description_en: "Natural lighting" },
    ],
    is_sensitive: true,
    requires_mask: true,
    requires_prompt: true,
    input_types: ["image", "mask"],
    input_schema: {
      clothing_description: {
        type: "string",
        description: "Describe the desired clothing",
      },
    },
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "مبدل الملابس" : "Clothing Swap",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "تغيير الملابس والأزياء بواقعية عالية"
        : "Change clothes and outfits with high realism",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "ملابس واقعية" : "Realistic clothing",
      lang === "ar" ? "حفظ شكل الجسم" : "Preserve body shape",
      lang === "ar" ? "إضاءة طبيعية" : "Natural lighting",
    ],
  },

  // ==================== BACKGROUND & ENVIRONMENT ====================
  {
    id: "magic_background_remover",
    name_ar: "محو الخلفية السحري",
    name_en: "Magic Background Remover",
    description_ar: "إزالة الخلفية بدقة مذهلة باستخدام الذكاء الاصطناعي",
    description_en: "Remove backgrounds with stunning precision using AI",
    category: "Background & Environment",
    model_info: {
      name: "Segment Anything",
      backend_identifier: AIModelIdentifier.SEGMENT_ANYTHING,
      size_gb: 0.4,
      processing_time_secs: "2-5",
    },
    features: [
      {
        description_ar: "دقة فائقة في التحديد",
        description_en: "Ultra-precise selection",
      },
      { description_ar: "حواف ناعمة", description_en: "Smooth edges" },
      {
        description_ar: "حفظ التفاصيل الدقيقة",
        description_en: "Preserve fine details",
      },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    input_types: ["image"],
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "محو الخلفية السحري" : "Magic Background Remover",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "إزالة الخلفية بدقة مذهلة باستخدام الذكاء الاصطناعي"
        : "Remove backgrounds with stunning precision using AI",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "دقة فائقة في التحديد" : "Ultra-precise selection",
      lang === "ar" ? "حواف ناعمة" : "Smooth edges",
      lang === "ar" ? "حفظ التفاصيل الدقيقة" : "Preserve fine details",
    ],
  },

  {
    id: "world_changer",
    name_ar: "مغير العوالم",
    name_en: "World Changer",
    description_ar: "تغيير البيئة والمشهد المحيط بالكامل",
    description_en: "Change the entire environment and surrounding scene",
    category: "Background & Environment",
    model_info: {
      name: "Stable Diffusion XL",
      backend_identifier: AIModelIdentifier.STABLE_DIFFUSION_XL,
      size_gb: 6.9,
      processing_time_secs: "10-20",
      gpu_required: true,
      min_vram_gb: 6,
    },
    features: [
      {
        description_ar: "بيئات فوتوريالستية",
        description_en: "Photorealistic environments",
      },
      { description_ar: "إضاءة متقدمة", description_en: "Advanced lighting" },
      { description_ar: "تكامل طبيعي", description_en: "Natural integration" },
    ],
    is_sensitive: false,
    requires_mask: true,
    requires_prompt: true,
    input_types: ["image", "mask"],
    input_schema: {
      environment_description: {
        type: "string",
        description: "Describe the new environment",
      },
    },
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "مغير العوالم" : "World Changer",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "تغيير البيئة والمشهد المحيط بالكامل"
        : "Change the entire environment and surrounding scene",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "بيئات فوتوريالستية" : "Photorealistic environments",
      lang === "ar" ? "إضاءة متقدمة" : "Advanced lighting",
      lang === "ar" ? "تكامل طبيعي" : "Natural integration",
    ],
  },

  // ==================== TECHNICAL ENHANCEMENT ====================
  {
    id: "hd_boost",
    name_ar: "محسن الدقة الخارق",
    name_en: "Super Resolution",
    description_ar: "تحسين جودة ودقة الصور حتى 8K - تقنية Real-ESRGAN المتقدمة",
    description_en:
      "Enhance image quality and resolution up to 8K - Advanced Real-ESRGAN technology",
    category: "Technical Enhancement",
    model_info: {
      name: "Real-ESRGAN x4+",
      backend_identifier: AIModelIdentifier.REAL_ESRGAN,
      size_gb: 0.067,
      processing_time_secs: "3-8",
    },
    features: [
      { description_ar: "دقة 4K و 8K", description_en: "4K and 8K resolution" },
      {
        description_ar: "تحسين الصور القديمة",
        description_en: "Enhance old photos",
      },
      { description_ar: "حفظ التفاصيل", description_en: "Preserve details" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    input_types: ["image"],
    input_schema: {
      upscale_factor: { type: "integer", enum: [2, 3, 4, 8], default: 4 },
    },
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "محسن الدقة الخارق" : "Super Resolution",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "تحسين جودة ودقة الصور حتى 8K - تقنية Real-ESRGAN المتقدمة"
        : "Enhance image quality and resolution up to 8K - Advanced Real-ESRGAN technology",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "دقة 4K و 8K" : "4K and 8K resolution",
      lang === "ar" ? "تحسين الصور القديمة" : "Enhance old photos",
      lang === "ar" ? "حفظ التفاصيل" : "Preserve details",
    ],
  },

  {
    id: "face_restorer",
    name_ar: "مُصلح الوجوه",
    name_en: "Face Restorer",
    description_ar: "إصلاح وتحسين الوجوه التالفة والضبابية",
    description_en: "Repair and enhance damaged and blurry faces",
    category: "Technical Enhancement",
    model_info: {
      name: "GFPGAN",
      backend_identifier: AIModelIdentifier.GFPGAN,
      size_gb: 0.348,
      processing_time_secs: "2-6",
    },
    features: [
      {
        description_ar: "إصلاح الوجوه التالفة",
        description_en: "Repair damaged faces",
      },
      { description_ar: "تحسين الوضوح", description_en: "Enhance clarity" },
      { description_ar: "استعادة التفاصيل", description_en: "Restore details" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    input_types: ["image"],
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? "مُصلح الوجوه" : "Face Restorer",
    getDescription: (lang: "ar" | "en") =>
      lang === "ar"
        ? "إصلاح وتحسين الوجوه التالفة والضبابية"
        : "Repair and enhance damaged and blurry faces",
    getFeatures: (lang: "ar" | "en") => [
      lang === "ar" ? "إصلاح الوجوه التالفة" : "Repair damaged faces",
      lang === "ar" ? "تحسين الوضوح" : "Enhance clarity",
      lang === "ar" ? "استعادة التفاصيل" : "Restore details",
    ],
  },

  // Add remaining 20 tools following same pattern...
];

// Get all unique categories from tools
export const TOOL_CATEGORIES = Array.from(
  new Set(COMPREHENSIVE_AI_TOOLS.map((tool) => tool.category)),
);

// Helper class for tool database operations
export class ToolsDatabase {
  static getAllTools(): AiTool[] {
    return COMPREHENSIVE_AI_TOOLS;
  }

  static getToolById(id: string): AiTool | undefined {
    return COMPREHENSIVE_AI_TOOLS.find((tool) => tool.id === id);
  }

  static getToolsByCategory(category: string): AiTool[] {
    return COMPREHENSIVE_AI_TOOLS.filter((tool) => tool.category === category);
  }

  static searchTools(query: string, lang: "ar" | "en" = "en"): AiTool[] {
    const lowerQuery = query.toLowerCase();
    return COMPREHENSIVE_AI_TOOLS.filter(
      (tool) =>
        tool.getName(lang).toLowerCase().includes(lowerQuery) ||
        tool.getDescription(lang).toLowerCase().includes(lowerQuery) ||
        tool.category.toLowerCase().includes(lowerQuery),
    );
  }

  static getSensitiveTools(): AiTool[] {
    return COMPREHENSIVE_AI_TOOLS.filter((tool) => tool.is_sensitive);
  }

  static getToolsRequiringMask(): AiTool[] {
    return COMPREHENSIVE_AI_TOOLS.filter((tool) => tool.requires_mask);
  }

  static getToolsRequiringPrompt(): AiTool[] {
    return COMPREHENSIVE_AI_TOOLS.filter((tool) => tool.requires_prompt);
  }
}
