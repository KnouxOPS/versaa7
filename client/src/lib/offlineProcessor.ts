// معالج العمليات المحلية للذكاء الاصطناعي
// يدير المعالجة المحلية والتوازن بين الأونلاين والأوفلاين

import { localDB } from "./localDatabase";

interface ProcessingTask {
  id: string;
  type: "local" | "cloud" | "hybrid";
  service: string;
  imageFile: File;
  prompt: string;
  settings: Record<string, any>;
  priority: number;
  createdAt: number;
}

interface ProcessingResult {
  success: boolean;
  processedImage?: string; // base64
  error?: string;
  processingTime: number;
  metadata: Record<string, any>;
}

interface LocalAIModel {
  id: string;
  name: string;
  size: number;
  capabilities: string[];
  isLoaded: boolean;
  loadTime: number;
  worker?: Worker;
}

// قائمة النماذج المحلية المدمجة
const EMBEDDED_MODELS: Record<string, LocalAIModel> = {
  face_beauty: {
    id: "face_beauty",
    name: "Phi-3 Vision Beauty Filter",
    size: 2.4 * 1024 * 1024 * 1024, // 2.4GB
    capabilities: ["face_enhancement", "beauty_filter", "skin_smoothing"],
    isLoaded: false,
    loadTime: 0,
  },
  bg_remover: {
    id: "bg_remover",
    name: "Segment Anything Model",
    size: 2.6 * 1024 * 1024 * 1024, // 2.6GB
    capabilities: ["background_removal", "object_segmentation"],
    isLoaded: false,
    loadTime: 0,
  },
  super_resolution: {
    id: "super_resolution",
    name: "Real-ESRGAN x4+",
    size: 67 * 1024 * 1024, // 67MB
    capabilities: ["upscaling", "denoising", "sharpening"],
    isLoaded: false,
    loadTime: 0,
  },
  style_transfer: {
    id: "style_transfer",
    name: "Stable Diffusion XL",
    size: 6.9 * 1024 * 1024 * 1024, // 6.9GB
    capabilities: ["style_transfer", "art_generation", "cartoonize"],
    isLoaded: false,
    loadTime: 0,
  },
};

class OfflineProcessor {
  private processingQueue: ProcessingTask[] = [];
  private isProcessing = false;
  private loadedModels: Map<string, LocalAIModel> = new Map();
  private workers: Map<string, Worker> = new Map();
  private connectionStatus: "online" | "offline" | "slow" = "online";

  constructor() {
    this.initializeConnectionMonitoring();
    this.preloadCriticalModels();
  }

  // === مراقبة الاتصال ===
  private initializeConnectionMonitoring() {
    // مراقبة حالة الاتصال
    window.addEventListener("online", () => {
      this.connectionStatus = "online";
      console.log("🌐 اتصال الإنترنت متاح - التبديل للمعالجة المختلطة");
    });

    window.addEventListener("offline", () => {
      this.connectionStatus = "offline";
      console.log("📱 لا يوجد اتصال إنترنت - التبديل للمعالجة المحلية");
    });

    // اختبار سرعة الاتصال
    this.checkConnectionSpeed();
  }

  private async checkConnectionSpeed(): Promise<void> {
    try {
      const startTime = performance.now();
      const response = await fetch("/api/ping", {
        method: "HEAD",
        cache: "no-cache",
      });
      const endTime = performance.now();

      const latency = endTime - startTime;

      if (latency > 2000) {
        this.connectionStatus = "slow";
        console.log("🐌 اتصال بطيء - تفضيل المعالجة المحلية");
      } else {
        this.connectionStatus = "online";
        console.log("⚡ اتصال سريع - المعالجة المختلطة متاحة");
      }
    } catch (error) {
      this.connectionStatus = "offline";
      console.log("📱 لا يوجد اتصال - المعالجة المحلية فقط");
    }
  }

  // === تحميل النماذج المسبق ===
  private async preloadCriticalModels() {
    // تحميل النماذج الصغيرة والمهمة أولاً
    const criticalModels = ["super_resolution", "bg_remover"];

    for (const modelId of criticalModels) {
      try {
        await this.loadModel(modelId);
      } catch (error) {
        console.warn(`فشل في تحميل النموذج ${modelId}:`, error);
      }
    }
  }

  // === إدارة النماذج ===
  private async loadModel(modelId: string): Promise<boolean> {
    if (this.loadedModels.has(modelId)) {
      return true;
    }

    const modelInfo = EMBEDDED_MODELS[modelId];
    if (!modelInfo) {
      throw new Error(`نموذج غير موجود: ${modelId}`);
    }

    try {
      const startTime = performance.now();

      // محاولة تحميل من الكاش المحلي أولاً
      let modelData = await localDB.getCachedModel(modelId);

      if (!modelData) {
        // تحميل من الخادم
        console.log(`📥 تحميل النموذج ${modelInfo.name}...`);
        const response = await fetch(`/api/models/${modelId}`);
        if (!response.ok) {
          throw new Error(`فشل في تحميل النموذج: ${response.statusText}`);
        }

        modelData = await response.arrayBuffer();

        // حفظ في الكاش المحلي
        await localDB.cacheModel(modelId, modelData, "1.0");
      }

      // إنشاء Worker للنموذج
      const worker = new Worker(
        new URL("../workers/aiModelWorker.ts", import.meta.url),
      );

      // تهيئة النموذج في Worker
      await this.initializeWorker(worker, modelId, modelData);

      const loadTime = performance.now() - startTime;

      const loadedModel: LocalAIModel = {
        ...modelInfo,
        isLoaded: true,
        loadTime,
        worker,
      };

      this.loadedModels.set(modelId, loadedModel);
      this.workers.set(modelId, worker);

      console.log(
        `✅ تم تحميل النموذج ${modelInfo.name} في ${Math.round(loadTime)}ms`,
      );
      return true;
    } catch (error) {
      console.error(`❌ فشل في تحميل النموذج ${modelId}:`, error);
      return false;
    }
  }

  private async initializeWorker(
    worker: Worker,
    modelId: string,
    modelData: ArrayBuffer,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("انتهت مهلة تهيئة النموذج"));
      }, 30000);

      worker.onmessage = (event) => {
        const { type, success, error } = event.data;

        if (type === "model_ready") {
          clearTimeout(timeout);
          if (success) {
            resolve();
          } else {
            reject(new Error(error));
          }
        }
      };

      worker.postMessage({
        type: "load_model",
        modelId,
        modelData,
      });
    });
  }

  // === تحديد نوع المعالجة ===
  private determineProcessingType(
    service: string,
    imageSize: number,
  ): "local" | "cloud" | "hybrid" {
    // الخدمات التي تعمل محلياً دائماً
    const localOnlyServices = ["super_resolution", "bg_remover", "face_beauty"];

    // الخدمات التي تحتاج للسحابة
    const cloudOnlyServices = ["magic_morph", "age_gender_transform"];

    // عوامل اتخاذ القرار
    const isLargeImage = imageSize > 10 * 1024 * 1024; // أكبر من 10MB
    const isModelLoaded = this.loadedModels.has(service);
    const isOffline = this.connectionStatus === "offline";
    const isSlowConnection = this.connectionStatus === "slow";

    // منطق اتخاذ القرار
    if (isOffline) {
      return localOnlyServices.includes(service) ? "local" : "local"; // إجبار المحلي
    }

    if (localOnlyServices.includes(service) && isModelLoaded) {
      return "local";
    }

    if (cloudOnlyServices.includes(service)) {
      return isSlowConnection && isLargeImage ? "hybrid" : "cloud";
    }

    // للخدمات المختلطة
    if (isModelLoaded && (isSlowConnection || isLargeImage)) {
      return "local";
    }

    return "hybrid";
  }

  // === معالجة المهام ===
  async processImage(
    service: string,
    imageFile: File,
    prompt: string,
    settings: Record<string, any> = {},
    onProgress?: (progress: number, message: string) => void,
  ): Promise<ProcessingResult> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const task: ProcessingTask = {
      id: taskId,
      type: this.determineProcessingType(service, imageFile.size),
      service,
      imageFile,
      prompt,
      settings,
      priority: settings.priority || 1,
      createdAt: Date.now(),
    };

    onProgress?.(10, `تحديد نوع المعالجة: ${task.type}`);

    try {
      switch (task.type) {
        case "local":
          return await this.processLocally(task, onProgress);
        case "cloud":
          return await this.processInCloud(task, onProgress);
        case "hybrid":
          return await this.processHybrid(task, onProgress);
        default:
          throw new Error(`نوع معالجة غير مدعوم: ${task.type}`);
      }
    } catch (error) {
      console.error("فشل في معالجة الصورة:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "خطأ غير معروف",
        processingTime: 0,
        metadata: { taskId, type: task.type },
      };
    }
  }

  // === المعالجة المحلية ===
  private async processLocally(
    task: ProcessingTask,
    onProgress?: (progress: number, message: string) => void,
  ): Promise<ProcessingResult> {
    const startTime = performance.now();

    onProgress?.(20, "تحضير المعالجة المحلية...");

    // التأكد من تحميل النموذج
    if (!this.loadedModels.has(task.service)) {
      onProgress?.(30, `تحميل نموذج ${task.service}...`);
      const loaded = await this.loadModel(task.service);
      if (!loaded) {
        throw new Error(`فشل في تحميل النموذج: ${task.service}`);
      }
    }

    onProgress?.(50, "معالجة الصورة محلياً...");

    const worker = this.workers.get(task.service);
    if (!worker) {
      throw new Error(`Worker غير متاح للخدمة: ${task.service}`);
    }

    // تحويل الصورة إلى base64
    const imageBase64 = await this.fileToBase64(task.imageFile);

    // معالجة الصورة في Worker
    const result = await this.processInWorker(
      worker,
      {
        image: imageBase64,
        prompt: task.prompt,
        settings: task.settings,
      },
      onProgress,
    );

    const processingTime = performance.now() - startTime;

    onProgress?.(95, "حفظ النتيجة...");

    // حفظ في السجل المحلي
    await localDB.saveProcessingHistory({
      originalImage: imageBase64,
      processedImage: result.processedImage,
      prompt: task.prompt,
      service: task.service,
      settings: task.settings,
      timestamp: Date.now(),
      processingTime,
      metadata: { type: "local", taskId: task.id },
    });

    onProgress?.(100, "تمت المعالجة بنجاح! ✨");

    return {
      success: true,
      processedImage: result.processedImage,
      processingTime,
      metadata: {
        type: "local",
        taskId: task.id,
        modelUsed: task.service,
      },
    };
  }

  // === المعالجة السحابية ===
  private async processInCloud(
    task: ProcessingTask,
    onProgress?: (progress: number, message: string) => void,
  ): Promise<ProcessingResult> {
    const startTime = performance.now();

    onProgress?.(20, "إرسال للمعالجة السحابية...");

    const formData = new FormData();
    formData.append("image", task.imageFile);
    formData.append("serviceId", task.service);
    formData.append("settings", JSON.stringify(task.settings));
    formData.append("prompt", task.prompt);

    try {
      const response = await fetch("/api/ai/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`فشل في المعالجة السحابية: ${response.statusText}`);
      }

      onProgress?.(50, "جاري المعالجة في السحابة...");

      // قراءة Server-Sent Events للتحديثات المب��شرة
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("لا يمكن قراءة استجابة الخادم");
      }

      let result: any = null;
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "progress") {
                onProgress?.(data.progress, data.message);
              } else if (data.type === "completed") {
                result = data;
              } else if (data.type === "error") {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.warn("فشل في تحليل استجابة SSE:", parseError);
            }
          }
        }
      }

      if (!result || !result.success) {
        throw new Error(result?.error || "فشل في المعالجة السحابية");
      }

      const processingTime = performance.now() - startTime;

      onProgress?.(95, "حفظ النتيجة...");

      // حفظ في السجل المحلي
      const originalImageBase64 = await this.fileToBase64(task.imageFile);
      await localDB.saveProcessingHistory({
        originalImage: originalImageBase64,
        processedImage: result.processedImage,
        prompt: task.prompt,
        service: task.service,
        settings: task.settings,
        timestamp: Date.now(),
        processingTime,
        metadata: { type: "cloud", taskId: task.id, ...result.metadata },
      });

      onProgress?.(100, "تمت المعالجة السحابية بنجاح! ☁️");

      return {
        success: true,
        processedImage: result.processedImage,
        processingTime,
        metadata: {
          type: "cloud",
          taskId: task.id,
          ...result.metadata,
        },
      };
    } catch (error) {
      console.error("فشل في المعالجة السحابية:", error);

      // في حالة فشل السحابة، جرب المحلي إذا كان متاحاً
      if (this.loadedModels.has(task.service)) {
        onProgress?.(30, "فشل السحابة - التحويل للمعالجة المحلية...");
        return await this.processLocally(task, onProgress);
      }

      throw error;
    }
  }

  // === المعالجة المختلطة ===
  private async processHybrid(
    task: ProcessingTask,
    onProgress?: (progress: number, message: string) => void,
  ): Promise<ProcessingResult> {
    onProgress?.(10, "تحديد أفضل طريقة للمعالجة...");

    // محاولة المعالجة المحلية أولاً إذا كان النموذج متاحاً
    if (this.loadedModels.has(task.service)) {
      try {
        onProgress?.(20, "محاولة المعالجة المحلية...");
        return await this.processLocally(task, onProgress);
      } catch (error) {
        console.warn("فشلت المعالجة المحلية، التحويل للسحابة:", error);
        onProgress?.(50, "التحويل للمعالجة السحابية...");
      }
    }

    // إذا فشلت المحلية أو لم تكن متاحة، استخدم السحابة
    return await this.processInCloud(task, onProgress);
  }

  // === مساعدات ===
  private async processInWorker(
    worker: Worker,
    data: any,
    onProgress?: (progress: number, message: string) => void,
  ): Promise<{ processedImage: string }> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("انتهت مهلة معالجة الصورة"));
      }, 120000); // مهلة دقيقتان

      worker.onmessage = (event) => {
        const { type, success, result, error, progress, message } = event.data;

        if (type === "progress") {
          onProgress?.(progress, message);
        } else if (type === "result") {
          clearTimeout(timeout);
          if (success) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      };

      worker.postMessage({
        type: "process",
        data,
      });
    });
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // إزالة prefix data:image/...;base64,
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // === معلومات الحالة ===
  getStatus(): {
    connectionStatus: string;
    loadedModels: string[];
    processingQueueLength: number;
    isProcessing: boolean;
  } {
    return {
      connectionStatus: this.connectionStatus,
      loadedModels: Array.from(this.loadedModels.keys()),
      processingQueueLength: this.processingQueue.length,
      isProcessing: this.isProcessing,
    };
  }

  getModelInfo(modelId: string): LocalAIModel | null {
    return this.loadedModels.get(modelId) || null;
  }

  // === تنظيف الموارد ===
  cleanup(): void {
    this.workers.forEach((worker) => worker.terminate());
    this.workers.clear();
    this.loadedModels.clear();
    this.processingQueue = [];
  }
}

// إنشاء مثيل مشترك
export const offlineProcessor = new OfflineProcessor();

// تنظيف الموارد عند إغلاق الصفحة
window.addEventListener("beforeunload", () => {
  offlineProcessor.cleanup();
});

export type { ProcessingTask, ProcessingResult, LocalAIModel };
