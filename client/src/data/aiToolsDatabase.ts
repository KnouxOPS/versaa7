import { AiTool, AIModelIdentifier, ToolFeature } from "@/types/aiTools";

// Comprehensive database of all 30 AI Tools for KNOUX-VERSA
export const AI_TOOLS_DATABASE: AiTool[] = [
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
      backend_identifier: "deepfacelab_saehd",
      size_gb: 1.2,
      processing_time_secs: "5-15 ثانية",
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
    input_schema: {
      image2_base64: {
        type: "string",
        required: true,
        description: "Target face image",
      },
      face_enhancement: {
        type: "boolean",
        default: true,
        description: "Enhance face quality",
      },
      blend_ratio: {
        type: "number",
        default: 0.8,
        description: "Face blending ratio (0.1-1.0)",
      },
    },
    output_schema: {
      swapped_image: {
        type: "string",
        description: "Base64 encoded result image",
      },
      confidence_score: {
        type: "number",
        description: "Face detection confidence",
      },
    },
    processing_complexity: "high",
    quality_modes: ["fast", "balanced", "quality", "extreme"],
  },

  {
    id: "beauty_filter",
    name_ar: "فلتر الجمال الذكي",
    name_en: "AI Beauty Filter",
    description_ar: "تحسين ملامح الوجه وإزالة العيوب بشكل طبيعي وذكي",
    description_en:
      "Enhance facial features and remove imperfections naturally and intelligently",
    category: "Face",
    model_info: {
      name: "GFPGAN + CodeFormer",
      backend_identifier: AIModelIdentifier.GFPGAN,
      size_gb: 0.8,
      processing_time_secs: "3-8 ثواني",
      gpu_required: true,
      min_vram_gb: 2,
    },
    features: [
      {
        description_ar: "إزالة التجاعيد والعيوب",
        description_en: "Remove wrinkles and blemishes",
      },
      {
        description_ar: "تنعيم البشرة الطبيعي",
        description_en: "Natural skin smoothing",
      },
      {
        description_ar: "تحسين ملامح العين",
        description_en: "Eye feature enhancement",
      },
      { description_ar: "تبييض الأسنان", description_en: "Teeth whitening" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      intensity: {
        type: "number",
        default: 0.7,
        description: "Enhancement intensity (0.1-1.0)",
      },
      preserve_identity: {
        type: "boolean",
        default: true,
        description: "Preserve facial identity",
      },
      skin_tone_adjustment: {
        type: "boolean",
        default: false,
        description: "Adjust skin tone",
      },
    },
    output_schema: {
      enhanced_image: { type: "string", description: "Beauty enhanced image" },
    },
    processing_complexity: "medium",
    quality_modes: ["natural", "enhanced", "glamour"],
  },

  {
    id: "face_expression",
    name_ar: "تعديل التعابير الوجهية",
    name_en: "Facial Expression Editor",
    description_ar: "تغيير تعابير الوجه من حزين إلى سعيد أو أي تعبير آخر",
    description_en:
      "Change facial expressions from sad to happy or any other expression",
    category: "Face",
    model_info: {
      name: "Phi3-Vision + ControlNet",
      backend_identifier: AIModelIdentifier.PHI3_VISION,
      size_gb: 2.1,
      processing_time_secs: "8-20 ثانية",
      gpu_required: true,
      min_vram_gb: 6,
    },
    features: [
      {
        description_ar: "تغيير تعابير الوجه",
        description_en: "Change facial expressions",
      },
      {
        description_ar: "تحكم في شدة التعبير",
        description_en: "Control expression intensity",
      },
      {
        description_ar: "حفظ ملامح الوجه الأساسية",
        description_en: "Preserve basic facial features",
      },
      { description_ar: "معاينة فورية", description_en: "Real-time preview" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      target_expression: {
        type: "string",
        enum: ["happy", "sad", "angry", "surprised", "neutral"],
        required: true,
      },
      intensity: {
        type: "number",
        default: 0.8,
        description: "Expression intensity",
      },
      preserve_age: {
        type: "boolean",
        default: true,
        description: "Preserve age characteristics",
      },
    },
    output_schema: {
      modified_image: {
        type: "string",
        description: "Image with new expression",
      },
    },
    processing_complexity: "high",
    quality_modes: ["subtle", "moderate", "dramatic"],
  },

  {
    id: "age_transform",
    name_ar: "تحويل العمر",
    name_en: "Age Transformation",
    description_ar: "جعل الشخص يبدو أصغر أو أكبر سناً بواقعية مذهلة",
    description_en: "Make a person look younger or older with stunning realism",
    category: "Face",
    model_info: {
      name: "StyleGAN + AgeMapper",
      backend_identifier: AIModelIdentifier.STABLE_DIFFUSION_XL,
      size_gb: 3.2,
      processing_time_secs: "10-25 ثانية",
      gpu_required: true,
      min_vram_gb: 8,
    },
    features: [
      {
        description_ar: "تقليل أو زيادة العمر",
        description_en: "Decrease or increase age",
      },
      {
        description_ar: "تحكم دقيق في السن",
        description_en: "Precise age control",
      },
      { description_ar: "حفظ الشخصية", description_en: "Preserve personality" },
      { description_ar: "تأثيرات واقعية", description_en: "Realistic effects" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      age_direction: {
        type: "string",
        enum: ["younger", "older"],
        required: true,
      },
      age_years: {
        type: "number",
        default: 10,
        description: "Number of years to add/subtract",
      },
      maintain_gender: {
        type: "boolean",
        default: true,
        description: "Maintain gender characteristics",
      },
    },
    output_schema: {
      aged_image: { type: "string", description: "Age-transformed image" },
    },
    processing_complexity: "extreme",
    quality_modes: ["fast", "realistic", "ultra_realistic"],
  },

  {
    id: "gender_swap",
    name_ar: "تبديل الجنس",
    name_en: "Gender Swap",
    description_ar: "تحويل الوجه من ذكر إلى أنثى أو العكس بدقة عالية",
    description_en:
      "Transform face from male to female or vice versa with high accuracy",
    category: "Face",
    model_info: {
      name: "GenderNet + StyleGAN3",
      backend_identifier: AIModelIdentifier.STABLE_DIFFUSION_XL,
      size_gb: 2.8,
      processing_time_secs: "12-30 ثانية",
      gpu_required: true,
      min_vram_gb: 6,
    },
    features: [
      {
        description_ar: "تحويل جنس واقعي",
        description_en: "Realistic gender transformation",
      },
      {
        description_ar: "حفظ الملامح الأساسية",
        description_en: "Preserve basic features",
      },
      {
        description_ar: "تع��يل الشعر والمكياج",
        description_en: "Hair and makeup adjustment",
      },
      {
        description_ar: "تحكم في شدة التحويل",
        description_en: "Control transformation intensity",
      },
    ],
    is_sensitive: true,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      target_gender: {
        type: "string",
        enum: ["male", "female"],
        required: true,
      },
      include_makeup: {
        type: "boolean",
        default: true,
        description: "Apply gender-appropriate makeup",
      },
      hair_style_change: {
        type: "boolean",
        default: true,
        description: "Change hair style",
      },
    },
    output_schema: {
      transformed_image: {
        type: "string",
        description: "Gender-swapped image",
      },
    },
    processing_complexity: "extreme",
    quality_modes: ["subtle", "moderate", "complete"],
  },

  // ==================== BODY CATEGORY ====================
  {
    id: "body_reshape",
    name_ar: "إعادة تشكيل الجسم",
    name_en: "Body Reshape",
    description_ar: "تعديل شكل الجسم وتحسين القوام بشكل طبيعي",
    description_en: "Modify body shape and improve physique naturally",
    category: "Body",
    model_info: {
      name: "BodyNet + Segment Anything",
      backend_identifier: AIModelIdentifier.SEGMENT_ANYTHING,
      size_gb: 1.8,
      processing_time_secs: "8-18 ثانية",
      gpu_required: true,
      min_vram_gb: 4,
    },
    features: [
      {
        description_ar: "تنحيف أو تكبير أجزاء الجسم",
        description_en: "Slim or enlarge body parts",
      },
      { description_ar: "تحسين القوام", description_en: "Improve posture" },
      {
        description_ar: "تعديل طبيعي",
        description_en: "Natural modifications",
      },
      {
        description_ar: "حفظ نسب الجسم",
        description_en: "Preserve body proportions",
      },
    ],
    is_sensitive: true,
    requires_mask: true,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      body_part: {
        type: "string",
        enum: ["waist", "arms", "legs", "chest", "overall"],
        required: true,
      },
      adjustment_intensity: {
        type: "number",
        default: 0.3,
        description: "Adjustment intensity (0.1-1.0)",
      },
      maintain_proportions: {
        type: "boolean",
        default: true,
        description: "Maintain natural proportions",
      },
    },
    output_schema: {
      reshaped_image: { type: "string", description: "Body reshaped image" },
    },
    processing_complexity: "high",
    quality_modes: ["subtle", "moderate", "dramatic"],
  },

  {
    id: "clothing_swap",
    name_ar: "تبديل الملابس",
    name_en: "Clothing Swap",
    description_ar: "تغيير الملابس أو إضافة ملابس جديدة بواقعية عالية",
    description_en: "Change clothes or add new clothing with high realism",
    category: "Body",
    model_info: {
      name: "ClothingNet + ControlNet",
      backend_identifier: AIModelIdentifier.CONTROLNET,
      size_gb: 2.4,
      processing_time_secs: "10-25 ثانية",
      gpu_required: true,
      min_vram_gb: 6,
    },
    features: [
      {
        description_ar: "تبديل الملابس بالكامل",
        description_en: "Complete clothing swap",
      },
      { description_ar: "إضافة إكسسوارات", description_en: "Add accessories" },
      { description_ar: "تناسق الألوان", description_en: "Color coordination" },
      {
        description_ar: "تعديل الإضاءة",
        description_en: "Lighting adjustment",
      },
    ],
    is_sensitive: false,
    requires_mask: true,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      clothing_type: {
        type: "string",
        required: true,
        description: "Type of clothing to add",
      },
      color_preference: {
        type: "string",
        description: "Preferred color scheme",
      },
      style: {
        type: "string",
        enum: ["casual", "formal", "sporty", "vintage"],
        default: "casual",
      },
    },
    output_schema: {
      clothed_image: { type: "string", description: "Image with new clothing" },
    },
    processing_complexity: "high",
    quality_modes: ["quick", "detailed", "professional"],
  },

  // ==================== BACKGROUND & ENVIRONMENT CATEGORY ====================
  {
    id: "bg_remover",
    name_ar: "إزالة الخلفية الذكية",
    name_en: "Smart Background Remover",
    description_ar: "إزالة الخلفية بدقة عالية مع الحفاظ على التفاصيل الدقيقة",
    description_en:
      "Remove background with high precision while preserving fine details",
    category: "Background & Environment",
    model_info: {
      name: "MODNet + REMBG",
      backend_identifier: AIModelIdentifier.MODNET,
      size_gb: 0.3,
      processing_time_secs: "2-5 ثواني",
      gpu_required: false,
      min_vram_gb: 1,
    },
    features: [
      {
        description_ar: "إزالة دقيقة للخلفية",
        description_en: "Precise background removal",
      },
      {
        description_ar: "حفظ الحواف الدقيقة",
        description_en: "Preserve fine edges",
      },
      {
        description_ar: "دعم الشعر المعقد",
        description_en: "Complex hair support",
      },
      { description_ar: "معالجة فورية", description_en: "Instant processing" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      edge_refinement: {
        type: "boolean",
        default: true,
        description: "Refine edges",
      },
      hair_detail_mode: {
        type: "boolean",
        default: true,
        description: "Enhanced hair detail processing",
      },
    },
    output_schema: {
      transparent_image: {
        type: "string",
        description: "Image with transparent background",
      },
      mask_image: { type: "string", description: "Generated mask" },
    },
    processing_complexity: "low",
    quality_modes: ["fast", "balanced", "precision"],
  },

  {
    id: "bg_replacer",
    name_ar: "استبدال الخلفية التوليدي",
    name_en: "Generative Background Replacer",
    description_ar: "استبدال الخلفية بخلفيات مولدة أو مخصصة",
    description_en: "Replace background with generated or custom backgrounds",
    category: "Background & Environment",
    model_info: {
      name: "Stable Diffusion + ControlNet",
      backend_identifier: AIModelIdentifier.STABLE_DIFFUSION_V21,
      size_gb: 4.1,
      processing_time_secs: "8-20 ثانية",
      gpu_required: true,
      min_vram_gb: 6,
    },
    features: [
      {
        description_ar: "توليد خلفيات مخصصة",
        description_en: "Generate custom backgrounds",
      },
      { description_ar: "مطابقة الإضاءة", description_en: "Lighting matching" },
      { description_ar: "تناسق الألوان", description_en: "Color harmony" },
      { description_ar: "عمق طبيعي", description_en: "Natural depth" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      background_prompt: {
        type: "string",
        required: true,
        description: "Background description",
      },
      lighting_match: {
        type: "boolean",
        default: true,
        description: "Match subject lighting",
      },
      perspective_correction: {
        type: "boolean",
        default: true,
        description: "Correct perspective",
      },
    },
    output_schema: {
      composite_image: {
        type: "string",
        description: "Image with new background",
      },
    },
    processing_complexity: "high",
    quality_modes: ["quick", "realistic", "cinematic"],
  },

  // ==================== ARTISTIC & CREATIVE CATEGORY ====================
  {
    id: "style_transfer",
    name_ar: "نقل الأنماط الفنية",
    name_en: "Artistic Style Transfer",
    description_ar:
      "تحويل الصور إلى أنماط فنية مختلفة مثل الرسم الزيتي أو الأنمي",
    description_en:
      "Transform images into different artistic styles like oil painting or anime",
    category: "Artistic & Creative",
    model_info: {
      name: "StyleGAN + Neural Style Transfer",
      backend_identifier: AIModelIdentifier.STABLE_DIFFUSION_XL,
      size_gb: 2.9,
      processing_time_secs: "6-15 ثانية",
      gpu_required: true,
      min_vram_gb: 4,
    },
    features: [
      {
        description_ar: "أنماط فنية متنوعة",
        description_en: "Diverse artistic styles",
      },
      {
        description_ar: "تحكم في شدة التأثير",
        description_en: "Control effect intensity",
      },
      {
        description_ar: "حفظ التفاصيل المهمة",
        description_en: "Preserve important details",
      },
      { description_ar: "أنماط مخصصة", description_en: "Custom styles" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      style_type: {
        type: "string",
        enum: [
          "oil_painting",
          "watercolor",
          "anime",
          "cartoon",
          "sketch",
          "impressionist",
        ],
        required: true,
      },
      intensity: {
        type: "number",
        default: 0.8,
        description: "Style transfer intensity",
      },
      preserve_colors: {
        type: "boolean",
        default: false,
        description: "Preserve original colors",
      },
    },
    output_schema: {
      stylized_image: { type: "string", description: "Stylized image" },
    },
    processing_complexity: "medium",
    quality_modes: ["fast", "balanced", "high_quality"],
  },

  {
    id: "cartoonizer",
    name_ar: "محول الكرتون",
    name_en: "AI Cartoonizer",
    description_ar: "تحويل الصور الحقيقية إلى أسلوب كرتوني جذاب",
    description_en: "Transform real photos into attractive cartoon style",
    category: "Artistic & Creative",
    model_info: {
      name: "CartoonGAN + AnimeGAN",
      backend_identifier: AIModelIdentifier.ANYTHING_V6,
      size_gb: 1.6,
      processing_time_secs: "4-10 ثواني",
      gpu_required: true,
      min_vram_gb: 3,
    },
    features: [
      {
        description_ar: "تحويل كرتوني واقعي",
        description_en: "Realistic cartoon conversion",
      },
      { description_ar: "ألوان زاهية", description_en: "Vibrant colors" },
      { description_ar: "خطوط نظيفة", description_en: "Clean lines" },
      { description_ar: "حفظ الهوية", description_en: "Identity preservation" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      cartoon_style: {
        type: "string",
        enum: ["disney", "anime", "comic", "pixar"],
        default: "anime",
      },
      color_enhancement: {
        type: "boolean",
        default: true,
        description: "Enhance colors",
      },
      edge_thickness: {
        type: "number",
        default: 0.5,
        description: "Edge line thickness",
      },
    },
    output_schema: {
      cartoon_image: { type: "string", description: "Cartoonized image" },
    },
    processing_complexity: "medium",
    quality_modes: ["simple", "detailed", "professional"],
  },

  // ==================== TECHNICAL ENHANCEMENT CATEGORY ====================
  {
    id: "hd_boost",
    name_ar: "تحسين فائق الجودة",
    name_en: "HD Boost",
    description_ar: "تكبير وتوضيح الصور بدقة تصل لـ 4K بدون فقدان التفاصيل",
    description_en: "Enlarge and clarify images up to 4K without detail loss",
    category: "Technical Enhancement",
    model_info: {
      name: "Real-ESRGAN x4+",
      backend_identifier: AIModelIdentifier.REAL_ESRGAN,
      size_gb: 0.067,
      processing_time_secs: "3-8 ثواني",
      gpu_required: true,
      min_vram_gb: 2,
    },
    features: [
      { description_ar: "دقة 4K و 8K", description_en: "4K and 8K resolution" },
      {
        description_ar: "تحسين الصور القديمة",
        description_en: "Enhance old photos",
      },
      { description_ar: "إزالة التشويش", description_en: "Noise reduction" },
      {
        description_ar: "تحسين التفاصيل",
        description_en: "Detail enhancement",
      },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      upscale_factor: {
        type: "integer",
        enum: [2, 4, 8],
        default: 4,
        description: "Upscaling factor",
      },
      denoise_strength: {
        type: "number",
        default: 0.5,
        description: "Noise reduction strength",
      },
      enhance_face: {
        type: "boolean",
        default: true,
        description: "Enhanced face processing",
      },
    },
    output_schema: {
      upscaled_image: { type: "string", description: "High resolution image" },
      scale_factor: { type: "number", description: "Applied scale factor" },
    },
    processing_complexity: "medium",
    quality_modes: ["fast", "balanced", "maximum_quality"],
  },

  {
    id: "denoiser",
    name_ar: "إزالة التشويش الذكي",
    name_en: "Smart Denoiser",
    description_ar: "إزالة التشويش والحبيبات من الصور مع الحفاظ على التفاصيل",
    description_en:
      "Remove noise and grain from images while preserving details",
    category: "Technical Enhancement",
    model_info: {
      name: "DnCNN + Real-ESRGAN",
      backend_identifier: AIModelIdentifier.REAL_ESRGAN,
      size_gb: 0.2,
      processing_time_secs: "2-6 ثواني",
      gpu_required: true,
      min_vram_gb: 1,
    },
    features: [
      {
        description_ar: "إزالة تشويش متقدمة",
        description_en: "Advanced noise removal",
      },
      {
        description_ar: "حفظ التفاصيل الدقيقة",
        description_en: "Preserve fine details",
      },
      {
        description_ar: "تحسين وضوح الصورة",
        description_en: "Improve image clarity",
      },
      {
        description_ar: "معالجة تلقائية",
        description_en: "Automatic processing",
      },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      noise_level: {
        type: "string",
        enum: ["light", "medium", "heavy"],
        default: "medium",
      },
      preserve_texture: {
        type: "boolean",
        default: true,
        description: "Preserve natural texture",
      },
      sharpening: {
        type: "number",
        default: 0.3,
        description: "Sharpening amount",
      },
    },
    output_schema: {
      denoised_image: { type: "string", description: "Noise-free image" },
    },
    processing_complexity: "low",
    quality_modes: ["gentle", "standard", "aggressive"],
  },

  // Additional 18 tools would continue here with similar detailed definitions...
  // For brevity, I'll include a few more key ones:

  {
    id: "object_remover",
    name_ar: "إزالة الكائنات الذكية",
    name_en: "Smart Object Remover",
    description_ar: "إزالة أي كائن من الصورة وملء المنطقة بشكل طبيعي",
    description_en: "Remove any object from image and fill the area naturally",
    category: "Advanced Tools",
    model_info: {
      name: "CLIP + SAM + Stable Diffusion",
      backend_identifier: AIModelIdentifier.CLIP_SAM,
      size_gb: 3.8,
      processing_time_secs: "10-25 ثانية",
      gpu_required: true,
      min_vram_gb: 6,
    },
    features: [
      {
        description_ar: "تحديد ذكي للكائنات",
        description_en: "Smart object detection",
      },
      {
        description_ar: "ملء طبيعي للمنطقة",
        description_en: "Natural area filling",
      },
      {
        description_ar: "حفظ الخلفية",
        description_en: "Background preservation",
      },
      { description_ar: "دقة عالية", description_en: "High precision" },
    ],
    is_sensitive: false,
    requires_mask: true,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      object_description: {
        type: "string",
        required: true,
        description: "Description of object to remove",
      },
      fill_method: {
        type: "string",
        enum: ["inpaint", "extend", "smart_fill"],
        default: "inpaint",
      },
      edge_feathering: {
        type: "number",
        default: 0.1,
        description: "Edge softening amount",
      },
    },
    output_schema: {
      cleaned_image: {
        type: "string",
        description: "Image with object removed",
      },
      mask_used: { type: "string", description: "Mask that was applied" },
    },
    processing_complexity: "extreme",
    quality_modes: ["quick", "standard", "perfect"],
  },

  {
    id: "lighting_master",
    name_ar: "سيد الإضاءة",
    name_en: "Lighting Master",
    description_ar: "تعديل وتحسين الإضاءة في الصور بشكل احترافي",
    description_en: "Adjust and enhance lighting in images professionally",
    category: "Technical Enhancement",
    model_info: {
      name: "LightingNet + ControlNet",
      backend_identifier: AIModelIdentifier.CONTROLNET,
      size_gb: 1.9,
      processing_time_secs: "6-12 ثانية",
      gpu_required: true,
      min_vram_gb: 4,
    },
    features: [
      {
        description_ar: "تعديل الإضاءة الديناميكي",
        description_en: "Dynamic lighting adjustment",
      },
      {
        description_ar: "إضافة مصادر ضوء",
        description_en: "Add light sources",
      },
      { description_ar: "تحسين الظلال", description_en: "Shadow enhancement" },
      { description_ar: "تصحيح التعرض", description_en: "Exposure correction" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      lighting_direction: {
        type: "string",
        enum: ["top", "bottom", "left", "right", "front"],
        required: true,
      },
      intensity: {
        type: "number",
        default: 0.7,
        description: "Lighting intensity",
      },
      color_temperature: {
        type: "number",
        default: 5500,
        description: "Light color temperature in Kelvin",
      },
      add_shadows: {
        type: "boolean",
        default: true,
        description: "Add realistic shadows",
      },
    },
    output_schema: {
      lit_image: {
        type: "string",
        description: "Image with enhanced lighting",
      },
    },
    processing_complexity: "medium",
    quality_modes: ["natural", "dramatic", "studio"],
  },

  {
    id: "pose_master",
    name_ar: "سيد الوضعيات",
    name_en: "Pose Master",
    description_ar: "تعديل وضعيات الجسم والحصول على الوضعية المثالية",
    description_en: "Adjust body poses and achieve the perfect posture",
    category: "Body",
    model_info: {
      name: "ControlNet + PoseNet",
      backend_identifier: AIModelIdentifier.POSEMASTER,
      size_gb: 2.1,
      processing_time_secs: "8-15 ثانية",
      gpu_required: true,
      min_vram_gb: 4,
    },
    features: [
      {
        description_ar: "تعديل وضعيات متقدم",
        description_en: "Advanced pose adjustment",
      },
      {
        description_ar: "كشف تلقائي للوضعية",
        description_en: "Automatic pose detection",
      },
      {
        description_ar: "تحكم في نقاط المفاصل",
        description_en: "Joint point control",
      },
      { description_ar: "وضعيات طبيعية", description_en: "Natural poses" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      pose_type: {
        type: "string",
        enum: ["standing", "sitting", "action", "custom"],
        default: "standing",
      },
      adjustment_intensity: {
        type: "number",
        default: 0.7,
        description: "Pose adjustment intensity",
      },
    },
    processing_complexity: "high",
    quality_modes: ["natural", "dramatic", "artistic"],
  },

  {
    id: "makeup_artist",
    name_ar: "فنان المكياج الذكي",
    name_en: "AI Makeup Artist",
    description_ar: "تطبيق مكياج احترافي بأنماط متنوعة وألوان مخصصة",
    description_en:
      "Apply professional makeup with diverse styles and custom colors",
    category: "Face",
    model_info: {
      name: "MakeupGAN + StyleTransfer",
      backend_identifier: AIModelIdentifier.MAKEUPGAN,
      size_gb: 1.8,
      processing_time_secs: "4-12 ثانية",
      gpu_required: true,
      min_vram_gb: 3,
    },
    features: [
      {
        description_ar: "مكياج عيون متقدم",
        description_en: "Advanced eye makeup",
      },
      { description_ar: "أحمر شفاه مخصص", description_en: "Custom lipstick" },
      {
        description_ar: "كونتورينغ طبيعي",
        description_en: "Natural contouring",
      },
      { description_ar: "ألوان متنوعة", description_en: "Diverse colors" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      makeup_style: {
        type: "string",
        enum: ["natural", "glamour", "evening", "artistic"],
        default: "natural",
      },
      color_theme: {
        type: "string",
        enum: ["warm", "cool", "neutral", "bold"],
        default: "neutral",
      },
      intensity: {
        type: "number",
        default: 0.6,
        description: "Makeup intensity",
      },
    },
    processing_complexity: "medium",
    quality_modes: ["natural", "enhanced", "professional"],
  },

  {
    id: "hair_stylist",
    name_ar: "مصفف الشعر الذكي",
    name_en: "AI Hair Stylist",
    description_ar: "تغيير تسريحات الشعر والألوان بأحدث الصيحات",
    description_en: "Change hairstyles and colors with the latest trends",
    category: "Face",
    model_info: {
      name: "HairGAN + StyleNet",
      backend_identifier: AIModelIdentifier.HAIRSTYLIST,
      size_gb: 2.3,
      processing_time_secs: "6-18 ثانية",
      gpu_required: true,
      min_vram_gb: 5,
    },
    features: [
      { description_ar: "تسريحات عصرية", description_en: "Modern hairstyles" },
      { description_ar: "تلوين طبيعي", description_en: "Natural coloring" },
      { description_ar: "تحكم في الطول", description_en: "Length control" },
      { description_ar: "نسيج الشعر", description_en: "Hair texture" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      hairstyle: {
        type: "string",
        required: true,
        description: "Desired hairstyle",
      },
      hair_color: { type: "string", description: "Hair color preference" },
      hair_length: {
        type: "string",
        enum: ["short", "medium", "long"],
        default: "medium",
      },
    },
    processing_complexity: "high",
    quality_modes: ["natural", "stylized", "fashion"],
  },

  {
    id: "tattoo_artist",
    name_ar: "فنان الوشم الرقمي",
    name_en: "Digital Tattoo Artist",
    description_ar: "إضافة وشوم فنية احترافية في أي مكان بالجسم",
    description_en: "Add artistic professional tattoos anywhere on the body",
    category: "Body",
    model_info: {
      name: "TattooNet + StyleGAN",
      backend_identifier: AIModelIdentifier.TATTOONET,
      size_gb: 1.5,
      processing_time_secs: "5-12 ثانية",
      gpu_required: true,
      min_vram_gb: 3,
    },
    features: [
      { description_ar: "تصاميم مخصصة", description_en: "Custom designs" },
      { description_ar: "أنماط متنوعة", description_en: "Diverse styles" },
      { description_ar: "تكيف مع الجسم", description_en: "Body adaptation" },
      { description_ar: "واقعية عالية", description_en: "High realism" },
    ],
    is_sensitive: true,
    requires_mask: true,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      tattoo_style: {
        type: "string",
        enum: ["traditional", "realistic", "tribal", "geometric", "watercolor"],
        default: "realistic",
      },
      size: {
        type: "string",
        enum: ["small", "medium", "large"],
        default: "medium",
      },
      color_type: {
        type: "string",
        enum: ["black", "colored"],
        default: "black",
      },
    },
    processing_complexity: "medium",
    quality_modes: ["artistic", "realistic", "stylized"],
  },

  {
    id: "virtual_jewelry",
    name_ar: "المجوهرات الافتراضية",
    name_en: "Virtual Jewelry",
    description_ar: "إضافة مجوهرات وإكسسوارات فاخرة بواقعية مذهلة",
    description_en: "Add luxury jewelry and accessories with stunning realism",
    category: "Body",
    model_info: {
      name: "JewelryNet + 3D Renderer",
      backend_identifier: AIModelIdentifier.JEWELRYNET,
      size_gb: 1.2,
      processing_time_secs: "4-10 ثواني",
      gpu_required: true,
      min_vram_gb: 2,
    },
    features: [
      { description_ar: "مجوهرات فاخرة", description_en: "Luxury jewelry" },
      {
        description_ar: "إكسسوارات متنوعة",
        description_en: "Diverse accessories",
      },
      { description_ar: "إضاءة واقعية", description_en: "Realistic lighting" },
      { description_ar: "تكيف تلقائي", description_en: "Auto adaptation" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      jewelry_type: {
        type: "string",
        enum: ["necklace", "earrings", "bracelet", "ring", "watch"],
        required: true,
      },
      material: {
        type: "string",
        enum: ["gold", "silver", "diamond", "pearl"],
        default: "gold",
      },
      style: {
        type: "string",
        enum: ["classic", "modern", "vintage"],
        default: "modern",
      },
    },
    processing_complexity: "medium",
    quality_modes: ["elegant", "luxury", "statement"],
  },

  {
    id: "muscle_enhancer",
    name_ar: "محسن العضلات",
    name_en: "Muscle Enhancer",
    description_ar: "تحسين وتعزيز العضلات للحصول على جسم رياضي مثالي",
    description_en: "Enhance and boost muscles for the perfect athletic body",
    category: "Body",
    model_info: {
      name: "MuscleNet + BodyGAN",
      backend_identifier: AIModelIdentifier.MUSCLEENHANCER,
      size_gb: 2.0,
      processing_time_secs: "8-20 ثانية",
      gpu_required: true,
      min_vram_gb: 4,
    },
    features: [
      { description_ar: "تعزيز طبيعي", description_en: "Natural enhancement" },
      { description_ar: "تحكم دقيق", description_en: "Precise control" },
      { description_ar: "نسب متوازنة", description_en: "Balanced proportions" },
      { description_ar: "واقعية عالية", description_en: "High realism" },
    ],
    is_sensitive: true,
    requires_mask: true,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      enhancement_level: {
        type: "number",
        default: 0.5,
        description: "Enhancement intensity (0.1-1.0)",
      },
      muscle_groups: {
        type: "string",
        enum: ["arms", "chest", "abs", "legs", "full_body"],
        default: "full_body",
      },
      definition: {
        type: "number",
        default: 0.7,
        description: "Muscle definition level",
      },
    },
    processing_complexity: "high",
    quality_modes: ["natural", "athletic", "bodybuilder"],
  },

  {
    id: "colorizer",
    name_ar: "ملون الصور القديمة",
    name_en: "Photo Colorizer",
    description_ar: "تلوين الصور القديمة بالأبيض والأسود بألوان طبيعية",
    description_en: "Colorize old black and white photos with natural colors",
    category: "Technical Enhancement",
    model_info: {
      name: "DeOldify + ColorNet",
      backend_identifier: AIModelIdentifier.REAL_ESRGAN,
      size_gb: 0.8,
      processing_time_secs: "4-12 ثانية",
      gpu_required: true,
      min_vram_gb: 2,
    },
    features: [
      { description_ar: "ألوان طبيعية", description_en: "Natural colors" },
      { description_ar: "تحليل تاريخي", description_en: "Historical analysis" },
      { description_ar: "حفظ التفاصيل", description_en: "Detail preservation" },
      { description_ar: "تلوين ذكي", description_en: "Smart coloring" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      color_intensity: {
        type: "number",
        default: 0.8,
        description: "Color intensity",
      },
      historical_period: {
        type: "string",
        enum: ["auto", "1920s", "1940s", "1960s", "1980s"],
        default: "auto",
      },
    },
    processing_complexity: "medium",
    quality_modes: ["conservative", "balanced", "vibrant"],
  },

  {
    id: "sharpener",
    name_ar: "محسن الوضوح الذكي",
    name_en: "Smart Sharpener",
    description_ar: "تحسين وضوح الصور الضبابية وزيادة حدة التفاصيل",
    description_en:
      "Enhance clarity of blurry images and increase detail sharpness",
    category: "Technical Enhancement",
    model_info: {
      name: "Unsharp Mask + AI Filter",
      backend_identifier: AIModelIdentifier.REAL_ESRGAN,
      size_gb: 0.3,
      processing_time_secs: "2-6 ثواني",
      gpu_required: false,
      min_vram_gb: 1,
    },
    features: [
      { description_ar: "وضوح متقدم", description_en: "Advanced clarity" },
      { description_ar: "حفظ الألوان", description_en: "Color preservation" },
      { description_ar: "تقليل الضوضاء", description_en: "Noise reduction" },
      { description_ar: "تحكم دقيق", description_en: "Precise control" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      sharpness_level: {
        type: "number",
        default: 0.6,
        description: "Sharpening intensity",
      },
      edge_enhancement: {
        type: "boolean",
        default: true,
        description: "Enhance edges",
      },
      noise_reduction: {
        type: "boolean",
        default: true,
        description: "Reduce noise",
      },
    },
    processing_complexity: "low",
    quality_modes: ["gentle", "moderate", "strong"],
  },

  {
    id: "object_replacer",
    name_ar: "مبدل الكائنات الذكي",
    name_en: "Smart Object Replacer",
    description_ar: "استبدال أي كائن في الصورة بكائن آخر بواقعية تامة",
    description_en:
      "Replace any object in the image with another object with complete realism",
    category: "Advanced Tools",
    model_info: {
      name: "CLIP + SAM + SDXL Inpainting",
      backend_identifier: AIModelIdentifier.CLIP_SAM,
      size_gb: 4.2,
      processing_time_secs: "12-30 ثانية",
      gpu_required: true,
      min_vram_gb: 8,
    },
    features: [
      { description_ar: "استبدال ذكي", description_en: "Smart replacement" },
      {
        description_ar: "تناسق الإضاءة",
        description_en: "Lighting consistency",
      },
      { description_ar: "تكامل طبيعي", description_en: "Natural integration" },
      { description_ar: "دقة عالية", description_en: "High precision" },
    ],
    is_sensitive: false,
    requires_mask: true,
    requires_prompt: true,
    requires_second_image: false,
    input_schema: {
      original_object: {
        type: "string",
        required: true,
        description: "Object to replace",
      },
      replacement_object: {
        type: "string",
        required: true,
        description: "New object description",
      },
      match_style: {
        type: "boolean",
        default: true,
        description: "Match original style",
      },
      preserve_lighting: {
        type: "boolean",
        default: true,
        description: "Preserve lighting",
      },
    },
    processing_complexity: "extreme",
    quality_modes: ["quick", "balanced", "perfect"],
  },

  {
    id: "smart_crop",
    name_ar: "القص الذكي المتقدم",
    name_en: "Advanced Smart Crop",
    description_ar: "قص ذكي للصور مع التركيز على العناصر المهمة تلقائياً",
    description_en:
      "Smart image cropping with automatic focus on important elements",
    category: "Technical Enhancement",
    model_info: {
      name: "AttentionNet + Saliency",
      backend_identifier: AIModelIdentifier.SEGMENT_ANYTHING,
      size_gb: 0.5,
      processing_time_secs: "3-8 ثواني",
      gpu_required: true,
      min_vram_gb: 2,
    },
    features: [
      { description_ar: "تحليل ذكي", description_en: "Smart analysis" },
      { description_ar: "نسب مثالية", description_en: "Perfect ratios" },
      {
        description_ar: "حفظ العناصر المهمة",
        description_en: "Preserve important elements",
      },
      { description_ar: "قوالب متعددة", description_en: "Multiple templates" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      aspect_ratio: {
        type: "string",
        enum: ["1:1", "4:3", "16:9", "9:16", "auto"],
        default: "auto",
      },
      focus_priority: {
        type: "string",
        enum: ["faces", "objects", "center", "rule_of_thirds"],
        default: "faces",
      },
      preserve_quality: {
        type: "boolean",
        default: true,
        description: "Maintain image quality",
      },
    },
    processing_complexity: "low",
    quality_modes: ["quick", "balanced", "precise"],
  },

  {
    id: "image_merger",
    name_ar: "دامج الصور الإبداعي",
    name_en: "Creative Image Merger",
    description_ar: "دمج عدة صور في تركيبة فنية واحدة بطريقة إبداعية",
    description_en:
      "Merge multiple images into one creative artistic composition",
    category: "Artistic & Creative",
    model_info: {
      name: "BlendNet + CompositeAI",
      backend_identifier: AIModelIdentifier.STABLE_DIFFUSION_XL,
      size_gb: 3.1,
      processing_time_secs: "10-25 ثانية",
      gpu_required: true,
      min_vram_gb: 6,
    },
    features: [
      { description_ar: "دمج إبداعي", description_en: "Creative blending" },
      { description_ar: "تناسق الألوان", description_en: "Color harmony" },
      {
        description_ar: "انتقالات ناعمة",
        description_en: "Smooth transitions",
      },
      { description_ar: "تحكم في الشفافية", description_en: "Opacity control" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: true,
    requires_second_image: true,
    input_schema: {
      blend_mode: {
        type: "string",
        enum: ["seamless", "overlay", "multiply", "screen", "artistic"],
        default: "seamless",
      },
      composition_style: {
        type: "string",
        enum: ["collage", "panorama", "artistic", "realistic"],
        default: "artistic",
      },
      transition_smoothness: {
        type: "number",
        default: 0.8,
        description: "Transition smoothness",
      },
    },
    processing_complexity: "high",
    quality_modes: ["artistic", "realistic", "creative"],
  },

  {
    id: "eye_color_changer",
    name_ar: "مغير لون العيون",
    name_en: "Eye Color Changer",
    description_ar: "تغيير لون العيون بدقة عالية مع الحفاظ على الطبيعية",
    description_en:
      "Change eye color with high precision while maintaining naturalness",
    category: "Face",
    model_info: {
      name: "EyeNet + ColorTransfer",
      backend_identifier: AIModelIdentifier.PHI3_VISION,
      size_gb: 0.8,
      processing_time_secs: "3-8 ثواني",
      gpu_required: true,
      min_vram_gb: 2,
    },
    features: [
      { description_ar: "ألوان طبيعية", description_en: "Natural colors" },
      { description_ar: "حفظ التفاصيل", description_en: "Detail preservation" },
      { description_ar: "تدرج لوني", description_en: "Color gradients" },
      { description_ar: "واقعية عالية", description_en: "High realism" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      eye_color: {
        type: "string",
        enum: ["blue", "green", "brown", "hazel", "gray", "violet"],
        required: true,
      },
      intensity: {
        type: "number",
        default: 0.8,
        description: "Color intensity",
      },
      preserve_natural_pattern: {
        type: "boolean",
        default: true,
        description: "Keep natural iris patterns",
      },
    },
    processing_complexity: "medium",
    quality_modes: ["natural", "enhanced", "dramatic"],
  },

  {
    id: "teeth_whitener",
    name_ar: "مبيض الأسنان المتقدم",
    name_en: "Advanced Teeth Whitener",
    description_ar: "تبييض الأسنان وتحسين الابتسامة بشكل طبيعي ومثالي",
    description_en: "Whiten teeth and enhance smile naturally and perfectly",
    category: "Face",
    model_info: {
      name: "TeethNet + SmileGAN",
      backend_identifier: AIModelIdentifier.GFPGAN,
      size_gb: 0.6,
      processing_time_secs: "2-6 ثواني",
      gpu_required: true,
      min_vram_gb: 1,
    },
    features: [
      { description_ar: "تبييض طبيعي", description_en: "Natural whitening" },
      {
        description_ar: "تحسين الابتسامة",
        description_en: "Smile enhancement",
      },
      { description_ar: "حفظ الشكل", description_en: "Shape preservation" },
      { description_ar: "نتائج فورية", description_en: "Instant results" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      whitening_level: {
        type: "number",
        default: 0.7,
        description: "Whitening intensity",
      },
      enhance_smile: {
        type: "boolean",
        default: true,
        description: "Enhance overall smile",
      },
      preserve_natural_texture: {
        type: "boolean",
        default: true,
        description: "Keep natural tooth texture",
      },
    },
    processing_complexity: "low",
    quality_modes: ["subtle", "moderate", "bright"],
  },

  {
    id: "scar_remover",
    name_ar: "مزيل الندوب والعيوب",
    name_en: "Scar & Blemish Remover",
    description_ar: "إزالة الندوب والعيوب والبقع بدقة عالية وطبيعية",
    description_en:
      "Remove scars, blemishes and spots with high precision and naturalness",
    category: "Face",
    model_info: {
      name: "ScarNet + InpaintGAN",
      backend_identifier: AIModelIdentifier.GFPGAN,
      size_gb: 1.1,
      processing_time_secs: "4-10 ثواني",
      gpu_required: true,
      min_vram_gb: 2,
    },
    features: [
      { description_ar: "إزالة دقيقة", description_en: "Precise removal" },
      { description_ar: "نسيج طبيعي", description_en: "Natural texture" },
      { description_ar: "تلقائي وذكي", description_en: "Auto and smart" },
      { description_ar: "مطابقة البشرة", description_en: "Skin matching" },
    ],
    is_sensitive: false,
    requires_mask: true,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      removal_strength: {
        type: "number",
        default: 0.8,
        description: "Removal intensity",
      },
      skin_matching: {
        type: "boolean",
        default: true,
        description: "Match surrounding skin",
      },
      preserve_texture: {
        type: "boolean",
        default: true,
        description: "Preserve skin texture",
      },
    },
    processing_complexity: "medium",
    quality_modes: ["gentle", "standard", "complete"],
  },

  {
    id: "vintage_filter",
    name_ar: "فلاتر الطراز القديم",
    name_en: "Vintage Style Filters",
    description_ar:
      "تطبيق فلاتر عتيقة وطراز قديم لإعطاء الصور طابعاً كلاسيكياً",
    description_en:
      "Apply vintage and retro filters to give images a classic character",
    category: "Artistic & Creative",
    model_info: {
      name: "VintageNet + StyleGAN",
      backend_identifier: AIModelIdentifier.VINTAGEFILTER,
      size_gb: 0.9,
      processing_time_secs: "3-8 ثواني",
      gpu_required: true,
      min_vram_gb: 2,
    },
    features: [
      { description_ar: "أساليب عتيقة", description_en: "Vintage styles" },
      { description_ar: "تأثيرات كلاسيكية", description_en: "Classic effects" },
      { description_ar: "ألوان دافئة", description_en: "Warm tones" },
      { description_ar: "نسيج فيلم", description_en: "Film texture" },
    ],
    is_sensitive: false,
    requires_mask: false,
    requires_prompt: false,
    requires_second_image: false,
    input_schema: {
      vintage_era: {
        type: "string",
        enum: ["1920s", "1950s", "1970s", "1980s", "film"],
        default: "1970s",
      },
      intensity: {
        type: "number",
        default: 0.7,
        description: "Filter intensity",
      },
      color_tone: {
        type: "string",
        enum: ["sepia", "warm", "cool", "original"],
        default: "warm",
      },
      add_grain: {
        type: "boolean",
        default: true,
        description: "Add film grain",
      },
    },
    processing_complexity: "low",
    quality_modes: ["subtle", "authentic", "dramatic"],
  },
];

// Helper functions for working with the tools database
export class ToolsDatabase {
  static getAllTools(): AiTool[] {
    return AI_TOOLS_DATABASE;
  }

  static getToolById(id: string): AiTool | undefined {
    return AI_TOOLS_DATABASE.find((tool) => tool.id === id);
  }

  static getToolsByCategory(category: string): AiTool[] {
    return AI_TOOLS_DATABASE.filter((tool) => tool.category === category);
  }

  static getSensitiveTools(): AiTool[] {
    return AI_TOOLS_DATABASE.filter((tool) => tool.is_sensitive);
  }

  static getToolsByComplexity(complexity: string): AiTool[] {
    return AI_TOOLS_DATABASE.filter(
      (tool) => tool.processing_complexity === complexity,
    );
  }

  static searchTools(query: string, language: "ar" | "en" = "ar"): AiTool[] {
    const searchField = language === "ar" ? "name_ar" : "name_en";
    const descField = language === "ar" ? "description_ar" : "description_en";

    return AI_TOOLS_DATABASE.filter(
      (tool) =>
        tool[searchField].toLowerCase().includes(query.toLowerCase()) ||
        tool[descField].toLowerCase().includes(query.toLowerCase()),
    );
  }

  static getToolsRequiringGPU(): AiTool[] {
    return AI_TOOLS_DATABASE.filter((tool) => tool.model_info.gpu_required);
  }

  static getTotalDatabaseSize(): number {
    return AI_TOOLS_DATABASE.reduce(
      (total, tool) => total + tool.model_info.size_gb,
      0,
    );
  }

  static getCategories(): string[] {
    return [...new Set(AI_TOOLS_DATABASE.map((tool) => tool.category))];
  }
}
