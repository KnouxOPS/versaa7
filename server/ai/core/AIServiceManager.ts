import { EventEmitter } from "events";
import { Worker } from "worker_threads";
import { performance } from "perf_hooks";
import NodeCache from "node-cache";

// أنواع البيانات الأساسية
interface AIServiceConfig {
  id: string;
  name: string;
  model: string;
  endpoint?: string;
  dockerImage?: string;
  gpuRequired: boolean;
  memoryLimit: string;
  concurrentLimit: number;
  estimatedTime: number;
  isVIP: boolean;
}

interface ProcessingRequest {
  id: string;
  serviceId: string;
  imageData: Buffer;
  settings: Record<string, any>;
  userId?: string;
  isVIP: boolean;
  priority: number;
  timestamp: number;
}

interface ProcessingResult {
  id: string;
  success: boolean;
  processedImage?: Buffer;
  error?: string;
  processingTime: number;
  metadata: {
    model: string;
    settings: Record<string, any>;
    cacheHit: boolean;
    queueTime: number;
    processingTime: number;
  };
}

// مدير خدمات الذكاء الاصطناعي المتقدم
export class AIServiceManager extends EventEmitter {
  private services: Map<string, AIServiceConfig> = new Map();
  private workers: Map<string, Worker[]> = new Map();
  private processingQueue: ProcessingRequest[] = [];
  private activeProcessing: Map<string, ProcessingRequest> = new Map();
  private cache: NodeCache;
  private isInitialized = false;

  constructor() {
    super();
    // إعداد الكاش مع انتهاء صلاحية ذكي
    this.cache = new NodeCache({
      stdTTL: 3600, // ساعة واحدة
      maxKeys: 1000,
      deleteOnExpire: true,
    });

    this.initializeServices();
  }

  // تهيئة جميع خدمات الـ AI
  private initializeServices() {
    const aiServices: AIServiceConfig[] = [
      // 🔥 خدمات تعديل الوجه
      {
        id: "face_swap",
        name: "تبديل الوجه المتقدم",
        model: "DeepFaceLab-SAEHD",
        dockerImage: "knoux/deepfacelab:latest",
        gpuRequired: true,
        memoryLimit: "4GB",
        concurrentLimit: 2,
        estimatedTime: 15000,
        isVIP: false,
      },
      {
        id: "beauty_filter",
        name: "فلتر الجمال الذكي",
        model: "Phi3-Vision-4B",
        dockerImage: "knoux/phi3-vision:latest",
        gpuRequired: true,
        memoryLimit: "3GB",
        concurrentLimit: 4,
        estimatedTime: 8000,
        isVIP: false,
      },
      {
        id: "face_expression",
        name: "تغيير التعبيرات",
        model: "EmotionNet-v2",
        dockerImage: "knoux/emotion-net:latest",
        gpuRequired: true,
        memoryLimit: "2GB",
        concurrentLimit: 6,
        estimatedTime: 6000,
        isVIP: false,
      },
      {
        id: "age_transform",
        name: "آلة الزمن العمرية",
        model: "AgeGAN-v3",
        dockerImage: "knoux/age-gan:latest",
        gpuRequired: true,
        memoryLimit: "3GB",
        concurrentLimit: 3,
        estimatedTime: 12000,
        isVIP: false,
      },
      {
        id: "gender_swap",
        name: "تحويل الجنس",
        model: "GenderGAN-HD",
        dockerImage: "knoux/gender-gan:latest",
        gpuRequired: true,
        memoryLimit: "4GB",
        concurrentLimit: 2,
        estimatedTime: 18000,
        isVIP: true,
      },
      {
        id: "makeup_artist",
        name: "فنان المكياج الرقمي",
        model: "MakeupGAN-Pro",
        dockerImage: "knoux/makeup-gan:latest",
        gpuRequired: true,
        memoryLimit: "2GB",
        concurrentLimit: 5,
        estimatedTime: 7000,
        isVIP: false,
      },

      // 🎨 خدمات تعديل الجسم
      {
        id: "body_reshape",
        name: "نحت الجسم الرقمي",
        model: "BodyGAN-Ultra",
        dockerImage: "knoux/body-gan:latest",
        gpuRequired: true,
        memoryLimit: "6GB",
        concurrentLimit: 1,
        estimatedTime: 25000,
        isVIP: true,
      },
      {
        id: "clothing_swap",
        name: "خزانة الملابس السحرية",
        model: "ClothingGAN-v2",
        dockerImage: "knoux/clothing-gan:latest",
        gpuRequired: true,
        memoryLimit: "5GB",
        concurrentLimit: 2,
        estimatedTime: 20000,
        isVIP: true,
      },
      {
        id: "tattoo_artist",
        name: "استوديو الوشم الرقمي",
        model: "TattooGAN-HD",
        dockerImage: "knoux/tattoo-gan:latest",
        gpuRequired: true,
        memoryLimit: "3GB",
        concurrentLimit: 3,
        estimatedTime: 10000,
        isVIP: false,
      },
      {
        id: "muscle_enhancer",
        name: "مقوي العضلات",
        model: "MuscleGAN-Pro",
        dockerImage: "knoux/muscle-gan:latest",
        gpuRequired: true,
        memoryLimit: "4GB",
        concurrentLimit: 3,
        estimatedTime: 15000,
        isVIP: false,
      },

      // 🌟 خدمات الخلفية والبيئة
      {
        id: "bg_remover",
        name: "ممحاة الخلفية السحرية",
        model: "SAM-ViT-H",
        dockerImage: "knoux/sam-bg:latest",
        gpuRequired: true,
        memoryLimit: "4GB",
        concurrentLimit: 8,
        estimatedTime: 3000,
        isVIP: false,
      },
      {
        id: "bg_replacer",
        name: "بوابة الأبعاد",
        model: "SDXL-Turbo",
        dockerImage: "knoux/sdxl-bg:latest",
        gpuRequired: true,
        memoryLimit: "8GB",
        concurrentLimit: 2,
        estimatedTime: 12000,
        isVIP: false,
      },
      {
        id: "lighting_master",
        name: "سيد الإضاءة",
        model: "LightingNet-v3",
        dockerImage: "knoux/lighting-net:latest",
        gpuRequired: true,
        memoryLimit: "3GB",
        concurrentLimit: 4,
        estimatedTime: 8000,
        isVIP: false,
      },

      // 🎭 خدمات التحويل الفني
      {
        id: "style_transfer",
        name: "آلة الفن السحرية",
        model: "StyleGAN3-T",
        dockerImage: "knoux/style-gan:latest",
        gpuRequired: true,
        memoryLimit: "6GB",
        concurrentLimit: 2,
        estimatedTime: 15000,
        isVIP: false,
      },
      {
        id: "cartoonizer",
        name: "محول عالم الكرتون",
        model: "CartoonGAN-v4",
        dockerImage: "knoux/cartoon-gan:latest",
        gpuRequired: true,
        memoryLimit: "4GB",
        concurrentLimit: 3,
        estimatedTime: 10000,
        isVIP: false,
      },
      {
        id: "colorizer",
        name: "آلة الزمن الملونة",
        model: "ColorizationNet-HD",
        dockerImage: "knoux/colorizer:latest",
        gpuRequired: true,
        memoryLimit: "3GB",
        concurrentLimit: 4,
        estimatedTime: 9000,
        isVIP: false,
      },

      // 🔧 خدمات التحسين التقني
      {
        id: "super_resolution",
        name: "محسن الدقة الخارق",
        model: "Real-ESRGAN-x4",
        dockerImage: "knoux/esrgan:latest",
        gpuRequired: true,
        memoryLimit: "4GB",
        concurrentLimit: 6,
        estimatedTime: 8000,
        isVIP: false,
      },
      {
        id: "denoiser",
        name: "منظف الصور الذكي",
        model: "DnCNN-Color",
        dockerImage: "knoux/denoiser:latest",
        gpuRequired: false,
        memoryLimit: "2GB",
        concurrentLimit: 8,
        estimatedTime: 5000,
        isVIP: false,
      },
      {
        id: "sharpener",
        name: "مقوي الحدة الاحترافي",
        model: "SharpNet-v2",
        dockerImage: "knoux/sharpener:latest",
        gpuRequired: false,
        memoryLimit: "1GB",
        concurrentLimit: 10,
        estimatedTime: 3000,
        isVIP: false,
      },

      // 🎯 خدمات متقدمة
      {
        id: "object_remover",
        name: "ممحاة العناصر السحرية",
        model: "InpaintingGAN-v3",
        dockerImage: "knoux/inpainting:latest",
        gpuRequired: true,
        memoryLimit: "5GB",
        concurrentLimit: 3,
        estimatedTime: 12000,
        isVIP: false,
      },
      {
        id: "pose_editor",
        name: "محرر الوضعيات",
        model: "PoseGAN-Ultra",
        dockerImage: "knoux/pose-gan:latest",
        gpuRequired: true,
        memoryLimit: "8GB",
        concurrentLimit: 1,
        estimatedTime: 30000,
        isVIP: true,
      },
      {
        id: "vip_magic_morph",
        name: "VIP Magic Morph",
        model: "MegaGAN-Turbo",
        dockerImage: "knoux/mega-gan:latest",
        gpuRequired: true,
        memoryLimit: "16GB",
        concurrentLimit: 1,
        estimatedTime: 45000,
        isVIP: true,
      },
    ];

    // تسجيل جميع الخدمات
    aiServices.forEach((service) => {
      this.services.set(service.id, service);
    });

    console.log(`✅ تم تهيئة ${aiServices.length} خدمة ذكاء اصطناعي`);
    this.isInitialized = true;
  }

  // تهيئة Workers للخدمة
  private async initializeWorkers(serviceId: string): Promise<void> {
    const service = this.services.get(serviceId);
    if (!service) throw new Error(`خدمة غير موجودة: ${serviceId}`);

    const workerCount = service.concurrentLimit;
    const workers: Worker[] = [];

    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker("./ai/workers/aiWorker.js", {
        workerData: {
          serviceId,
          config: service,
          workerId: i,
        },
      });

      worker.on("message", (result) => {
        this.handleWorkerResult(result);
      });

      worker.on("error", (error) => {
        console.error(`❌ خطأ في Worker ${serviceId}-${i}:`, error);
      });

      workers.push(worker);
    }

    this.workers.set(serviceId, workers);
    console.log(`🚀 تم تهيئة ${workerCount} Workers لخدمة ${service.name}`);
  }

  // معالجة طلب جديد
  async processRequest(
    request: Omit<ProcessingRequest, "id" | "timestamp" | "priority">,
  ): Promise<string> {
    const requestId = this.generateRequestId();
    const priority = request.isVIP
      ? 1
      : request.serviceId === "vip_magic_morph"
        ? 0
        : 2;

    const fullRequest: ProcessingRequest = {
      ...request,
      id: requestId,
      timestamp: Date.now(),
      priority,
    };

    // التحقق من الكاش أولاً
    const cacheKey = this.generateCacheKey(
      request.imageData,
      request.settings,
      request.serviceId,
    );
    const cachedResult = this.cache.get<ProcessingResult>(cacheKey);

    if (cachedResult) {
      console.log(`💾 تم العثور على نتيجة محفوظة لـ ${request.serviceId}`);
      this.emit("result", {
        ...cachedResult,
        id: requestId,
        metadata: {
          ...cachedResult.metadata,
          cacheHit: true,
          queueTime: 0,
        },
      });
      return requestId;
    }

    // إضافة إلى القائمة حسب الأولوية
    this.addToQueue(fullRequest);
    this.processQueue();

    return requestId;
  }

  // إضافة للقائمة مع ترتيب الأولوية
  private addToQueue(request: ProcessingRequest): void {
    // VIP له أولوية عليا
    if (request.isVIP) {
      const vipIndex = this.processingQueue.findIndex((r) => !r.isVIP);
      if (vipIndex === -1) {
        this.processingQueue.push(request);
      } else {
        this.processingQueue.splice(vipIndex, 0, request);
      }
    } else {
      this.processingQueue.push(request);
    }

    console.log(
      `📋 تمت إضافة طلب ${request.id} للقائمة (المجموع: ${this.processingQueue.length})`,
    );
  }

  // معالجة القائمة
  private async processQueue(): Promise<void> {
    if (this.processingQueue.length === 0) return;

    const request = this.processingQueue.shift()!;
    const service = this.services.get(request.serviceId);

    if (!service) {
      this.emit("error", {
        id: request.id,
        error: `خدمة غير موجودة: ${request.serviceId}`,
      });
      return;
    }

    // التحقق من حد المعالجة المتزامنة
    const activeCount = Array.from(this.activeProcessing.values()).filter(
      (r) => r.serviceId === request.serviceId,
    ).length;

    if (activeCount >= service.concurrentLimit) {
      // إعادة إلى القائمة مع تأخير
      setTimeout(() => {
        this.processingQueue.unshift(request);
        this.processQueue();
      }, 1000);
      return;
    }

    // بدء المعالجة
    this.activeProcessing.set(request.id, request);

    // تهيئة Workers إذا لم تكن موجودة
    if (!this.workers.has(request.serviceId)) {
      await this.initializeWorkers(request.serviceId);
    }

    // إرسال للمعالجة
    await this.sendToWorker(request);

    // معالجة الطلب التالي
    setTimeout(() => this.processQueue(), 100);
  }

  // إرسال للـ Worker
  private async sendToWorker(request: ProcessingRequest): Promise<void> {
    const workers = this.workers.get(request.serviceId);
    if (!workers || workers.length === 0) {
      throw new Error(`لا توجد Workers متاحة لـ ${request.serviceId}`);
    }

    // العثور على Worker متاح
    const availableWorker = workers[0]; // تحسين: يمكن إضافة load balancing

    const startTime = performance.now();
    const queueTime = startTime - request.timestamp;

    this.emit("started", {
      id: request.id,
      serviceId: request.serviceId,
      queueTime,
      estimatedTime:
        this.services.get(request.serviceId)?.estimatedTime || 10000,
    });

    // إرسال للمعالجة
    availableWorker.postMessage({
      type: "process",
      request: {
        ...request,
        queueTime,
      },
    });
  }

  // معالجة نتيجة Worker
  private handleWorkerResult(result: any): void {
    const processingTime = performance.now();
    this.activeProcessing.delete(result.id);

    if (result.success) {
      // حفظ في الكاش
      const request = result.originalRequest;
      const cacheKey = this.generateCacheKey(
        request.imageData,
        request.settings,
        request.serviceId,
      );

      this.cache.set(cacheKey, result, 3600); // حفظ لساعة

      console.log(
        `✅ تمت معالجة ${result.id} بنجاح في ${result.processingTime}ms`,
      );
    } else {
      console.error(`❌ فشلت معالجة ${result.id}:`, result.error);
    }

    this.emit("result", result);

    // معالجة الطلب التالي
    this.processQueue();
  }

  // توليد معرف الطلب
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // توليد مفتاح الكاش
  private generateCacheKey(
    imageData: Buffer,
    settings: any,
    serviceId: string,
  ): string {
    const crypto = require("crypto");
    const hash = crypto.createHash("sha256");
    hash.update(imageData);
    hash.update(JSON.stringify(settings));
    hash.update(serviceId);
    return hash.digest("hex");
  }

  // الحصول على حالة الخدمات
  getServicesStatus(): any {
    const status: any = {};

    this.services.forEach((service, id) => {
      const activeCount = Array.from(this.activeProcessing.values()).filter(
        (r) => r.serviceId === id,
      ).length;

      status[id] = {
        name: service.name,
        model: service.model,
        isVIP: service.isVIP,
        gpuRequired: service.gpuRequired,
        memoryLimit: service.memoryLimit,
        concurrentLimit: service.concurrentLimit,
        activeProcessing: activeCount,
        estimatedTime: service.estimatedTime,
        workersReady: this.workers.has(id),
      };
    });

    return {
      services: status,
      queueLength: this.processingQueue.length,
      totalActive: this.activeProcessing.size,
      cacheStats: this.cache.getStats(),
    };
  }

  // إيقاف الخدمة وتنظيف الموارد
  async shutdown(): Promise<void> {
    console.log("🛑 إيقاف AI Service Manager...");

    // إيقاف جميع Workers
    for (const [serviceId, workers] of this.workers.entries()) {
      console.log(`🔌 إيقاف Workers لخدمة ${serviceId}...`);
      workers.forEach((worker) => worker.terminate());
    }

    this.workers.clear();
    this.processingQueue.length = 0;
    this.activeProcessing.clear();
    this.cache.flushAll();

    console.log("✅ تم إيقاف AI Service Manager بنجاح");
  }

  // الحصول على معلومات خدمة محددة
  getServiceInfo(serviceId: string): AIServiceConfig | undefined {
    return this.services.get(serviceId);
  }

  // التحقق من حالة الاستعداد
  isReady(): boolean {
    return this.isInitialized;
  }
}

// تصدير singleton instance
export const aiServiceManager = new AIServiceManager();

// أنواع البيانات للتصدير
export type { AIServiceConfig, ProcessingRequest, ProcessingResult };
