import { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";

// أنواع الملفات المدعومة
const SUPPORTED_IMAGE_TYPES = {
  "image/jpeg": { ext: ".jpg", maxSize: 50 * 1024 * 1024 }, // 50MB
  "image/jpg": { ext: ".jpg", maxSize: 50 * 1024 * 1024 },
  "image/png": { ext: ".png", maxSize: 50 * 1024 * 1024 },
  "image/webp": { ext: ".webp", maxSize: 50 * 1024 * 1024 },
  "image/tiff": { ext: ".tiff", maxSize: 100 * 1024 * 1024 }, // 100MB للـ TIFF
  "image/bmp": { ext: ".bmp", maxSize: 50 * 1024 * 1024 },
};

// حد أدنى وأقصى لأبعاد الصورة
const IMAGE_DIMENSIONS = {
  minWidth: 64,
  minHeight: 64,
  maxWidth: 8192,
  maxHeight: 8192,
  maxPixels: 50 * 1024 * 1024, // 50 ميجا بكسل
};

// كاش للتحقق من الصور
const validationCache = new Map<string, boolean>();
const CACHE_TTL = 5 * 60 * 1000; // 5 دقائق

// التحقق من صحة مدخلات الصورة
export function validateImageInput(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // التحقق من وجود ملف أو ملفات
    if (
      !req.file &&
      (!req.files || (Array.isArray(req.files) && req.files.length === 0))
    ) {
      return res.status(400).json({
        success: false,
        error: "مطلوب رفع صورة واحدة على الأقل",
        code: "NO_IMAGE_PROVIDED",
      });
    }

    // التحقق من ملف واحد
    if (req.file) {
      const validation = validateSingleImage(req.file);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: validation.error,
          code: validation.code,
        });
      }
    }

    // التحقق من ملفات متعددة
    if (req.files && Array.isArray(req.files)) {
      for (let i = 0; i < req.files.length; i++) {
        const validation = validateSingleImage(req.files[i]);
        if (!validation.isValid) {
          return res.status(400).json({
            success: false,
            error: `الصورة ${i + 1}: ${validation.error}`,
            code: validation.code,
            imageIndex: i,
          });
        }
      }

      // التحقق من عدد الصور
      if (req.files.length > 20) {
        return res.status(400).json({
          success: false,
          error: "الحد الأقصى 20 صورة في الطلب الواحد",
          code: "TOO_MANY_FILES",
        });
      }
    }

    console.log(
      `✅ تم التحقق من صحة ${req.file ? "1" : req.files?.length || 0} صورة`,
    );
    next();
  } catch (error) {
    console.error("خطأ في التحقق من صحة الصورة:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في التحقق من صحة الصورة",
      code: "VALIDATION_ERROR",
    });
  }
}

// التحقق من صورة واحدة
function validateSingleImage(file: Express.Multer.File): {
  isValid: boolean;
  error?: string;
  code?: string;
} {
  // التحقق من نوع الملف
  if (
    !SUPPORTED_IMAGE_TYPES[file.mimetype as keyof typeof SUPPORTED_IMAGE_TYPES]
  ) {
    return {
      isValid: false,
      error: `نوع ملف غير مدعوم: ${file.mimetype}. الأنواع المدعومة: JPEG, PNG, WebP, TIFF, BMP`,
      code: "UNSUPPORTED_FILE_TYPE",
    };
  }

  const typeInfo =
    SUPPORTED_IMAGE_TYPES[file.mimetype as keyof typeof SUPPORTED_IMAGE_TYPES];

  // التحقق من حجم الملف
  if (file.size > typeInfo.maxSize) {
    const maxSizeMB = Math.round(typeInfo.maxSize / (1024 * 1024));
    const fileSizeMB = Math.round((file.size / (1024 * 1024)) * 100) / 100;

    return {
      isValid: false,
      error: `حجم الملف كبير جداً: ${fileSizeMB}MB. الحد الأقصى: ${maxSizeMB}MB`,
      code: "FILE_TOO_LARGE",
    };
  }

  // التحقق من حجم أدنى
  if (file.size < 1024) {
    // 1KB
    return {
      isValid: false,
      error: "حجم الملف صغير جداً (أقل من 1KB)",
      code: "FILE_TOO_SMALL",
    };
  }

  // التحقق من صحة بنية الصورة (أساسي)
  if (!isValidImageStructure(file.buffer)) {
    return {
      isValid: false,
      error: "بنية الصورة غير صحيحة أو ملف تالف",
      code: "CORRUPTED_IMAGE",
    };
  }

  // التحقق من الأبعاد (سيتم تنفيذه أثناء المعالجة)
  // هذا مجرد فحص أولي للبايتات

  return { isValid: true };
}

// التحقق الأساسي من بنية الصورة
function isValidImageStructure(buffer: Buffer): boolean {
  if (buffer.length < 10) return false;

  // التحقق من JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // التحقق من PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }

  // التحقق من WebP
  if (
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  // التحقق من BMP
  if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
    return true;
  }

  // التحقق من TIFF
  if (
    (buffer[0] === 0x49 && buffer[1] === 0x49) ||
    (buffer[0] === 0x4d && buffer[1] === 0x4d)
  ) {
    return true;
  }

  return false;
}

// التحقق من صحة إعدادات الخدمة
export function validateServiceSettings(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { serviceId, settings } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: "معرف الخدمة مطلوب",
        code: "MISSING_SERVICE_ID",
      });
    }

    // التحقق من صحة معرف الخدمة
    const validServiceIds = [
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
      "vip_magic_morph",
    ];

    if (!validServiceIds.includes(serviceId)) {
      return res.status(400).json({
        success: false,
        error: `معرف خدمة غير صحيح: ${serviceId}`,
        code: "INVALID_SERVICE_ID",
        validServices: validServiceIds,
      });
    }

    // التحقق من الإعدادات إذا كانت موجودة
    if (settings) {
      let parsedSettings;

      try {
        parsedSettings =
          typeof settings === "string" ? JSON.parse(settings) : settings;
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "إعدادات غير صحيحة (يجب أن تكون JSON صالح)",
          code: "INVALID_SETTINGS_FORMAT",
        });
      }

      // التحقق من إعدادات محددة لكل خدمة
      const validation = validateSpecificServiceSettings(
        serviceId,
        parsedSettings,
      );
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: validation.error,
          code: "INVALID_SERVICE_SETTINGS",
        });
      }

      // تحديث الإعدادات المحللة
      req.body.settings = parsedSettings;
    }

    next();
  } catch (error) {
    console.error("خطأ في التحق�� من إعدادات الخدمة:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في التحقق من الإعدادات",
      code: "SETTINGS_VALIDATION_ERROR",
    });
  }
}

// التحقق من إعدادات خدمة محددة
function validateSpecificServiceSettings(
  serviceId: string,
  settings: any,
): { isValid: boolean; error?: string } {
  // قواعد التحقق لكل خدمة
  const validationRules: Record<
    string,
    (settings: any) => { isValid: boolean; error?: string }
  > = {
    face_swap: (s) => {
      if (s.blendStrength && (s.blendStrength < 0 || s.blendStrength > 1)) {
        return { isValid: false, error: "blendStrength يجب أن يكون بين 0 و 1" };
      }
      return { isValid: true };
    },

    beauty_filter: (s) => {
      if (s.skinSmoothing && (s.skinSmoothing < 0 || s.skinSmoothing > 100)) {
        return {
          isValid: false,
          error: "skinSmoothing يجب أن يكون بين 0 و 100",
        };
      }
      if (s.eyeEnhancement && (s.eyeEnhancement < 0 || s.eyeEnhancement > 50)) {
        return {
          isValid: false,
          error: "eyeEnhancement يجب أن يكون بين 0 و 50",
        };
      }
      return { isValid: true };
    },

    face_expression: (s) => {
      const validExpressions = [
        "smile",
        "laugh",
        "sad",
        "angry",
        "surprised",
        "neutral",
        "wink",
      ];
      if (s.expression && !validExpressions.includes(s.expression)) {
        return {
          isValid: false,
          error: `expression غير صحيح. القيم المسموحة: ${validExpressions.join(", ")}`,
        };
      }
      return { isValid: true };
    },

    age_transform: (s) => {
      const validDirections = ["younger", "older"];
      if (s.ageDirection && !validDirections.includes(s.ageDirection)) {
        return {
          isValid: false,
          error: `ageDirection غير صحيح. القيم المسموحة: ${validDirections.join(", ")}`,
        };
      }
      if (s.ageAmount && (s.ageAmount < 0 || s.ageAmount > 50)) {
        return { isValid: false, error: "ageAmount يجب أن يكون بين 0 و 50" };
      }
      return { isValid: true };
    },

    style_transfer: (s) => {
      const validStyles = [
        "anime",
        "van_gogh",
        "picasso",
        "oil_painting",
        "watercolor",
        "sketch",
      ];
      if (s.style && !validStyles.includes(s.style)) {
        return {
          isValid: false,
          error: `style غير صحيح. القيم المسموحة: ${validStyles.join(", ")}`,
        };
      }
      if (s.strength && (s.strength < 0 || s.strength > 1)) {
        return { isValid: false, error: "strength يجب أن يكون بين 0 و 1" };
      }
      return { isValid: true };
    },

    super_resolution: (s) => {
      const validFactors = [2, 4, 8];
      if (s.scaleFactor && !validFactors.includes(s.scaleFactor)) {
        return {
          isValid: false,
          error: `scaleFactor غير صحيح. القيم المسموحة: ${validFactors.join(", ")}`,
        };
      }
      return { isValid: true };
    },

    vip_magic_morph: (s) => {
      if (
        !s.prompt ||
        typeof s.prompt !== "string" ||
        s.prompt.trim().length === 0
      ) {
        return {
          isValid: false,
          error: "prompt مطلوب ولا يمكن أن يكون فارغاً",
        };
      }
      if (s.prompt.length > 1000) {
        return { isValid: false, error: "prompt يجب أن يكون أقل من 1000 حرف" };
      }
      if (s.strength && (s.strength < 0 || s.strength > 1)) {
        return { isValid: false, error: "strength يجب أن يكون بين 0 و 1" };
      }
      if (s.steps && (s.steps < 10 || s.steps > 100)) {
        return { isValid: false, error: "steps يجب أن يكون بين 10 و 100" };
      }
      return { isValid: true };
    },
  };

  // التحقق من وجود قاعدة للخدمة
  const validator = validationRules[serviceId];
  if (!validator) {
    return { isValid: true }; // لا توجد قواعد محددة، الإعدادات صحيحة
  }

  return validator(settings);
}

// التحقق من معدل الطلبات للمستخدم
export function validateUserRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userIp = req.ip || req.connection.remoteAddress || "unknown";
  const isVIP = !!(req as any).isVIP;

  // معدلات مختلفة حسب نوع المستخدم
  const limits = {
    standard: { windowMs: 15 * 60 * 1000, max: 20 }, // 20 طلب كل 15 دقيقة
    vip: { windowMs: 5 * 60 * 1000, max: 100 }, // 100 طلب كل 5 دقائق للـ VIP
  };

  const currentLimit = isVIP ? limits.vip : limits.standard;

  // هنا يمكن تطبيق منطق rate limiting أكثر تعقيداً
  // مع استخدام Redis أو قاعدة بيانات لتتبع الطلبات

  next();
}

// إنشاء hash للتحقق من التكرار
export function createImageHash(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

// التحقق من تكرار الصورة
export function checkImageDuplication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.file) {
    return next();
  }

  const imageHash = createImageHash(req.file.buffer);

  // التحقق من الكاش
  if (validationCache.has(imageHash)) {
    console.log(
      `💾 تم العثور على صورة مكررة: ${imageHash.substring(0, 16)}...`,
    );

    // يمكن إما منع المعالجة أو السماح بها حسب المنطق التجاري
    req.imageHash = imageHash;
    req.isDuplicate = true;
  } else {
    // إضافة للكاش
    validationCache.set(imageHash, true);

    // تنظيف الكاش بعد TTL
    setTimeout(() => {
      validationCache.delete(imageHash);
    }, CACHE_TTL);

    req.imageHash = imageHash;
    req.isDuplicate = false;
  }

  next();
}

// تصدير أنواع البيانات المخصصة
declare global {
  namespace Express {
    interface Request {
      imageHash?: string;
      isDuplicate?: boolean;
    }
  }
}

// إحصائيات التحقق
export function getValidationStats() {
  return {
    cacheSize: validationCache.size,
    supportedFormats: Object.keys(SUPPORTED_IMAGE_TYPES),
    imageLimits: IMAGE_DIMENSIONS,
  };
}
