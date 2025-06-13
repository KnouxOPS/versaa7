import { Request, Response, NextFunction } from "express";
import { performance } from "perf_hooks";

// إحصائيات المراقبة
interface PerformanceMetrics {
  requestCount: number;
  totalProcessingTime: number;
  averageProcessingTime: number;
  errorCount: number;
  successCount: number;
  serviceUsage: Record<string, number>;
  memoryUsage: NodeJS.MemoryUsage;
  lastUpdated: Date;
}

interface RequestMetrics {
  id: string;
  method: string;
  path: string;
  serviceId?: string;
  startTime: number;
  endTime?: number;
  processingTime?: number;
  statusCode?: number;
  memoryBefore: NodeJS.MemoryUsage;
  memoryAfter?: NodeJS.MemoryUsage;
  userAgent?: string;
  ip: string;
  isVIP: boolean;
}

// مخزن المقاييس
const metrics: PerformanceMetrics = {
  requestCount: 0,
  totalProcessingTime: 0,
  averageProcessingTime: 0,
  errorCount: 0,
  successCount: 0,
  serviceUsage: {},
  memoryUsage: process.memoryUsage(),
  lastUpdated: new Date(),
};

// مخزن الطلبات النشطة
const activeRequests = new Map<string, RequestMetrics>();

// سجل الطلبات (آخر 1000 طلب)
const requestHistory: RequestMetrics[] = [];
const MAX_HISTORY_SIZE = 1000;

// مراقبة الأداء
export function monitorPerformance(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = generateRequestId();
  const startTime = performance.now();

  const requestMetrics: RequestMetrics = {
    id: requestId,
    method: req.method,
    path: req.path,
    serviceId: req.body.serviceId,
    startTime,
    memoryBefore: process.memoryUsage(),
    userAgent: req.get("User-Agent"),
    ip: req.ip || req.connection.remoteAddress || "unknown",
    isVIP: !!(req as any).isVIP,
  };

  // إضافة للطلبات النشطة
  activeRequests.set(requestId, requestMetrics);

  // تسجيل معرف الطلب
  req.requestId = requestId;

  console.log(
    `📊 [${requestId}] بدء طلب ${req.method} ${req.path}${requestMetrics.serviceId ? ` (خدمة: ${requestMetrics.serviceId})` : ""}`,
  );

  // مراقبة انتهاء الطلب
  res.on("finish", () => {
    const endTime = performance.now();
    const processingTime = endTime - startTime;

    requestMetrics.endTime = endTime;
    requestMetrics.processingTime = processingTime;
    requestMetrics.statusCode = res.statusCode;
    requestMetrics.memoryAfter = process.memoryUsage();

    // تحديث المقاييس العامة
    updateMetrics(requestMetrics);

    // إزالة من الطلبات النشطة
    activeRequests.delete(requestId);

    // إضافة للسجل
    addToHistory(requestMetrics);

    const statusEmoji = res.statusCode >= 400 ? "❌" : "✅";
    console.log(
      `${statusEmoji} [${requestId}] انتهى في ${processingTime.toFixed(2)}ms - الحالة: ${res.statusCode}`,
    );
  });

  // مراقبة الأخطاء
  res.on("error", (error) => {
    console.error(`💥 [${requestId}] خطأ في الطلب:`, error);
    metrics.errorCount++;
  });

  next();
}

// تحديث المقاييس
function updateMetrics(requestMetrics: RequestMetrics) {
  metrics.requestCount++;
  metrics.totalProcessingTime += requestMetrics.processingTime || 0;
  metrics.averageProcessingTime =
    metrics.totalProcessingTime / metrics.requestCount;

  if (requestMetrics.statusCode && requestMetrics.statusCode >= 400) {
    metrics.errorCount++;
  } else {
    metrics.successCount++;
  }

  // تحديث استخدام الخدمات
  if (requestMetrics.serviceId) {
    metrics.serviceUsage[requestMetrics.serviceId] =
      (metrics.serviceUsage[requestMetrics.serviceId] || 0) + 1;
  }

  metrics.memoryUsage = process.memoryUsage();
  metrics.lastUpdated = new Date();
}

// إضافة للسجل التاريخي
function addToHistory(requestMetrics: RequestMetrics) {
  requestHistory.push(requestMetrics);

  // الحفاظ على حد أقصى من السجلات
  if (requestHistory.length > MAX_HISTORY_SIZE) {
    requestHistory.shift();
  }
}

// توليد معرف طلب فريد
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
}

// الحصول على المقاييس الحالية
export function getCurrentMetrics(): PerformanceMetrics & {
  activeRequests: number;
  recentRequests: RequestMetrics[];
  systemInfo: any;
} {
  return {
    ...metrics,
    activeRequests: activeRequests.size,
    recentRequests: requestHistory.slice(-10),
    systemInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      loadAverage:
        process.platform === "linux" ? require("os").loadavg() : null,
    },
  };
}

// مراقبة الموارد
export function monitorResources() {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    memory: {
      used: Math.round((memUsage.used / 1024 / 1024) * 100) / 100, // MB
      total: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100, // MB
      heap: {
        used: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100, // MB
        total: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100, // MB
      },
      external: Math.round((memUsage.external / 1024 / 1024) * 100) / 100, // MB
    },
    cpu: {
      user: Math.round(cpuUsage.user / 1000), // ms
      system: Math.round(cpuUsage.system / 1000), // ms
    },
    uptime: Math.round(process.uptime()),
    activeRequests: activeRequests.size,
    pid: process.pid,
  };
}

// تنبيهات الأداء
export function checkPerformanceAlerts() {
  const alerts: string[] = [];
  const resources = monitorResources();

  // تحقق من استخدام الذاكرة
  if (resources.memory.used > 1000) {
    // 1GB
    alerts.push(`⚠️ استخدام ذاكرة عالي: ${resources.memory.used}MB`);
  }

  // تحقق من الطلبات النشطة
  if (resources.activeRequests > 50) {
    alerts.push(`⚠️ عدد طلبات نشطة كبير: ${resources.activeRequests}`);
  }

  // تحقق من معدل الأخطاء
  const errorRate =
    metrics.requestCount > 0
      ? (metrics.errorCount / metrics.requestCount) * 100
      : 0;
  if (errorRate > 10) {
    alerts.push(`⚠️ معدل أخطاء عالي: ${errorRate.toFixed(2)}%`);
  }

  // تحقق من متوسط وقت المعالجة
  if (metrics.averageProcessingTime > 30000) {
    // 30 ثانية
    alerts.push(
      `⚠️ متوسط وقت معالجة طويل: ${(metrics.averageProcessingTime / 1000).toFixed(2)}s`,
    );
  }

  return alerts;
}

// إعادة تعيين المقاييس
export function resetMetrics() {
  metrics.requestCount = 0;
  metrics.totalProcessingTime = 0;
  metrics.averageProcessingTime = 0;
  metrics.errorCount = 0;
  metrics.successCount = 0;
  metrics.serviceUsage = {};
  metrics.lastUpdated = new Date();

  requestHistory.length = 0;
  activeRequests.clear();

  console.log("📊 تم إعادة تعيين مقاييس الأداء");
}

// مراقبة دورية
setInterval(() => {
  const alerts = checkPerformanceAlerts();
  if (alerts.length > 0) {
    console.warn("🚨 تنبيهات الأداء:", alerts.join(", "));
  }
}, 60000); // كل دقيقة

// تصدير أنواع البيانات
export type { PerformanceMetrics, RequestMetrics };

// إضافة خاصيات للـ Request interface
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}
