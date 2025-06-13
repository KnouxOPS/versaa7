import { Router, Request, Response } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { aiServiceManager } from "../core/AIServiceManager";
import { validateVIPAccess } from "../middleware/vipAuth";
import { validateImageInput } from "../middleware/validation";
import { monitorPerformance } from "../middleware/monitoring";

const router = Router();

// إعداد multer للصور
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|tiff/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (JPEG, PNG, WebP, TIFF)"));
    }
  },
  storage: multer.memoryStorage(),
});

// معدلات الطلبات
const standardRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 50, // 50 طلب لكل 15 دقيقة
  message: {
    error: "تم تجاوز حد الطلبات المسموح. حاول مرة أخرى بعد 15 دقيقة.",
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const vipRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 دقائق
  max: 100, // 100 طلب لكل 5 دقائق للـ VIP
  message: {
    error: "تم تجاوز حد طلبات VIP. حاول مرة أخرى بعد 5 دقائق.",
    retryAfter: 5 * 60,
  },
});

// نقطة صحة الخدمة
router.get("/health", (req: Request, res: Response) => {
  const status = aiServiceManager.getServicesStatus();

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    services: status,
    uptime: process.uptime(),
  });
});

// الحصول على قائمة الخدمات
router.get("/services", (req: Request, res: Response) => {
  const status = aiServiceManager.getServicesStatus();

  res.json({
    success: true,
    services: status.services,
    total: Object.keys(status.services).length,
    available: Object.values(status.services).filter((s: any) => s.workersReady)
      .length,
  });
});

// معلومات خدمة محددة
router.get("/services/:serviceId", (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const serviceInfo = aiServiceManager.getServiceInfo(serviceId);

  if (!serviceInfo) {
    return res.status(404).json({
      success: false,
      error: `خدمة غير موجودة: ${serviceId}`,
    });
  }

  const status = aiServiceManager.getServicesStatus();

  res.json({
    success: true,
    service: {
      ...serviceInfo,
      status: status.services[serviceId],
    },
  });
});

// معالجة الصور - نقطة موحدة
router.post(
  "/process",
  monitorPerformance,
  upload.single("image"),
  validateImageInput,
  async (req: Request, res: Response) => {
    try {
      const { serviceId, settings = "{}", userId, isVIP = false } = req.body;

      if (!serviceId) {
        return res.status(400).json({
          success: false,
          error: "serviceId مطلوب",
        });
      }

      const serviceInfo = aiServiceManager.getServiceInfo(serviceId);
      if (!serviceInfo) {
        return res.status(404).json({
          success: false,
          error: `خدمة غير موجودة: ${serviceId}`,
        });
      }

      // التحقق من VIP للخدمات المميزة
      if (serviceInfo.isVIP && !isVIP) {
        return res.status(403).json({
          success: false,
          error: "هذه الخدمة متاحة للـ VIP فقط",
          requiresVIP: true,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "ملف الصورة مطلوب",
        });
      }

      let parsedSettings;
      try {
        parsedSettings = JSON.parse(settings);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "إعدادات غير صحيحة (يجب أن تكون JSON صالح)",
        });
      }

      // إضافة الطلب للمعالجة
      const requestId = await aiServiceManager.processRequest({
        serviceId,
        imageData: req.file.buffer,
        settings: parsedSettings,
        userId,
        isVIP: Boolean(isVIP),
      });

      // إعداد Server-Sent Events للتحديثات المباشرة
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      });

      res.write(
        `data: ${JSON.stringify({
          type: "started",
          requestId,
          message: "بدأت المعالجة...",
        })}\n\n`,
      );

      // الاستماع للتحديثات
      const handleStarted = (data: any) => {
        if (data.id === requestId) {
          res.write(
            `data: ${JSON.stringify({
              type: "progress",
              progress: 10,
              message: `بدأت المعالجة - الوقت المتوقع: ${Math.round(data.estimatedTime / 1000)} ثانية`,
            })}\n\n`,
          );
        }
      };

      const handleResult = (data: any) => {
        if (data.id === requestId) {
          aiServiceManager.removeListener("started", handleStarted);
          aiServiceManager.removeListener("result", handleResult);

          if (data.success) {
            res.write(
              `data: ${JSON.stringify({
                type: "completed",
                success: true,
                processedImage: data.processedImage.toString("base64"),
                metadata: data.metadata,
              })}\n\n`,
            );
          } else {
            res.write(
              `data: ${JSON.stringify({
                type: "error",
                success: false,
                error: data.error,
              })}\n\n`,
            );
          }

          res.end();
        }
      };

      aiServiceManager.on("started", handleStarted);
      aiServiceManager.on("result", handleResult);

      // إلغاء الاتصال عند قطع الاتصال
      req.on("close", () => {
        aiServiceManager.removeListener("started", handleStarted);
        aiServiceManager.removeListener("result", handleResult);
      });
    } catch (error) {
      console.error("خطأ في معالجة الطلب:", error);
      res.status(500).json({
        success: false,
        error: "خطأ داخلي في الخادم",
      });
    }
  },
);

// معالجة متعددة الصور (Batch Processing)
router.post(
  "/batch-process",
  monitorPerformance,
  upload.array("images", 10),
  validateImageInput,
  async (req: Request, res: Response) => {
    try {
      const { serviceId, settings = "{}", userId, isVIP = false } = req.body;

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "مطلوب صورة واحدة على الأقل",
        });
      }

      const serviceInfo = aiServiceManager.getServiceInfo(serviceId);
      if (!serviceInfo) {
        return res.status(404).json({
          success: false,
          error: `خدمة غير موجودة: ${serviceId}`,
        });
      }

      if (serviceInfo.isVIP && !isVIP) {
        return res.status(403).json({
          success: false,
          error: "هذه الخدمة متاحة للـ VIP فقط",
          requiresVIP: true,
        });
      }

      let parsedSettings;
      try {
        parsedSettings = JSON.parse(settings);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: "إعدادات غير صحيحة",
        });
      }

      // معالجة جميع الصور
      const requestIds = await Promise.all(
        req.files.map(async (file: Express.Multer.File) => {
          return await aiServiceManager.processRequest({
            serviceId,
            imageData: file.buffer,
            settings: parsedSettings,
            userId,
            isVIP: Boolean(isVIP),
          });
        }),
      );

      res.json({
        success: true,
        message: "تم إرسال جميع الصور للمعالجة",
        requestIds,
        totalImages: req.files.length,
      });
    } catch (error) {
      console.error("خطأ في المعالجة المتعددة:", error);
      res.status(500).json({
        success: false,
        error: "خطأ في المعالجة المتعددة",
      });
    }
  },
);

// خدمات VIP مخصصة
router.use("/vip", validateVIPAccess, vipRateLimit);

router.post(
  "/vip/magic-morph",
  upload.single("image"),
  validateImageInput,
  async (req: Request, res: Response) => {
    try {
      const { prompt, strength = 0.9, steps = 50, guidance = 7.5 } = req.body;

      if (!prompt) {
        return res.status(400).json({
          success: false,
          error: "prompt مطلوب للـ VIP Magic Morph",
        });
      }

      const requestId = await aiServiceManager.processRequest({
        serviceId: "vip_magic_morph",
        imageData: req.file!.buffer,
        settings: {
          prompt,
          strength: parseFloat(strength),
          steps: parseInt(steps),
          guidance: parseFloat(guidance),
        },
        userId: req.body.userId,
        isVIP: true,
      });

      res.json({
        success: true,
        requestId,
        message: "بدأت معالجة VIP Magic Morph",
        estimatedTime: 45000,
      });
    } catch (error) {
      console.error("خطأ في VIP Magic Morph:", error);
      res.status(500).json({
        success: false,
        error: "خطأ في VIP Magic Morph",
      });
    }
  },
);

// تطبيق معدلات مختلفة للخدمات العادية
router.use(standardRateLimit);

// خدمات سريعة (بدون GPU)
const fastServices = ["denoiser", "sharpener", "bg_remover"];
router.post(
  "/fast/:serviceId",
  upload.single("image"),
  validateImageInput,
  async (req: Request, res: Response) => {
    const { serviceId } = req.params;

    if (!fastServices.includes(serviceId)) {
      return res.status(400).json({
        success: false,
        error: "هذه الخدمة غير متاحة في المسار السريع",
      });
    }

    try {
      const requestId = await aiServiceManager.processRequest({
        serviceId,
        imageData: req.file!.buffer,
        settings: req.body.settings ? JSON.parse(req.body.settings) : {},
        userId: req.body.userId,
        isVIP: false,
      });

      res.json({
        success: true,
        requestId,
        message: "بدأت المعالجة السريعة",
      });
    } catch (error) {
      console.error(`خطأ في المعالجة السريعة ${serviceId}:`, error);
      res.status(500).json({
        success: false,
        error: "خطأ في المعالجة السريعة",
      });
    }
  },
);

// إحصائيات الاستخدام
router.get("/stats", (req: Request, res: Response) => {
  const status = aiServiceManager.getServicesStatus();

  res.json({
    success: true,
    stats: {
      totalServices: Object.keys(status.services).length,
      activeProcessing: status.totalActive,
      queueLength: status.queueLength,
      cacheStats: status.cacheStats,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    },
  });
});

// تحسين الأداء
router.get("/optimize", async (req: Request, res: Response) => {
  try {
    // تنظيف الكاش
    global.gc && global.gc();

    res.json({
      success: true,
      message: "تم تحسين الأداء",
      memoryUsage: process.memoryUsage(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "فشل في تحسين الأداء",
    });
  }
});

// معالجة الأخطاء
router.use((error: any, req: Request, res: Response, next: any) => {
  console.error("خطأ في AI Routes:", error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "حجم الملف كبير جداً (الحد الأقصى 50MB)",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "عدد الملفات كبير جداً",
      });
    }
  }

  res.status(500).json({
    success: false,
    error: "خطأ داخلي في خادم AI",
  });
});

export default router;

// دالة مساعدة للحصول على عنوان الخدمة
function getServiceTitle(serviceId: string): string {
  const titles: Record<string, string> = {
    face_swap: "تبديل الوجه",
    beauty_filter: "فلتر الجمال",
    face_expression: "تغيير التعبيرات",
    age_transform: "تحويل العمر",
    gender_swap: "تحويل الجنس",
    makeup_artist: "فنان المكياج",
    body_reshape: "نحت الجسم",
    clothing_swap: "تغيير الملابس",
    tattoo_artist: "استوديو الوشم",
    muscle_enhancer: "تقوية العضلات",
    bg_remover: "إزالة الخلفية",
    bg_replacer: "استبدال الخلفية",
    lighting_master: "سيد الإضاءة",
    style_transfer: "نقل الأسلوب",
    cartoonizer: "محول الكرتون",
    colorizer: "ملون الصور",
    super_resolution: "الدقة الفائقة",
    denoiser: "مزيل الضوضاء",
    sharpener: "محسن الحدة",
    object_remover: "مزيل العناصر",
    pose_editor: "محرر الوضعيات",
    vip_magic_morph: "VIP Magic Morph",
  };
  return titles[serviceId] || serviceId;
}
