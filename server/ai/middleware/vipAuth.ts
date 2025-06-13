import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// أنواع البيانات
interface VIPSession {
  userId: string;
  sessionKey: string;
  isActive: boolean;
  tier: "gold" | "platinum" | "diamond";
  expiresAt: Date;
  permissions: string[];
}

interface AuthenticatedRequest extends Request {
  vipSession?: VIPSession;
  isVIP?: boolean;
}

// مخزن جلسات VIP (في بيئة الإنتاج، استخدم Redis أو قاعدة بيانات)
const vipSessions = new Map<string, VIPSession>();

// مفتاح VIP الرئيسي
let MASTER_VIP_KEY: string;

try {
  const vipKeyPath = join(process.cwd(), "vip.key");
  if (existsSync(vipKeyPath)) {
    MASTER_VIP_KEY = readFileSync(vipKeyPath, "utf8").trim();
  } else {
    MASTER_VIP_KEY =
      process.env.VIP_MASTER_KEY || "SADEK_ELGAZAR_VIP_2025_ULTIMATE";
  }
} catch (error) {
  console.warn(
    "⚠️ لم يتم العثور على مفتاح VIP، سيتم استخدام المفتاح الافتراضي",
  );
  MASTER_VIP_KEY = "SADEK_ELGAZAR_VIP_2025_ULTIMATE";
}

// JWT سري للـ VIP
const VIP_JWT_SECRET =
  process.env.VIP_JWT_SECRET || "knoux_vip_ultra_secret_2025";

// مستويات VIP والصلاحيات
const VIP_TIERS = {
  gold: {
    name: "Gold VIP",
    permissions: ["basic_vip", "priority_queue", "advanced_features"],
    concurrentRequests: 5,
    dailyLimit: 200,
    features: ["face_swap", "beauty_filter", "style_transfer"],
  },
  platinum: {
    name: "Platinum VIP",
    permissions: [
      "basic_vip",
      "priority_queue",
      "advanced_features",
      "premium_models",
    ],
    concurrentRequests: 10,
    dailyLimit: 500,
    features: ["all_basic", "body_reshape", "clothing_swap", "pose_editor"],
  },
  diamond: {
    name: "Diamond VIP",
    permissions: [
      "basic_vip",
      "priority_queue",
      "advanced_features",
      "premium_models",
      "unlimited_access",
    ],
    concurrentRequests: 20,
    dailyLimit: -1, // غير محدود
    features: ["all_features", "vip_magic_morph", "custom_models"],
  },
};

// التحقق من صحة مفتاح VIP
export function validateVIPKey(key: string): {
  isValid: boolean;
  tier?: keyof typeof VIP_TIERS;
} {
  // مفتاح Sadek Elgazar الرئيسي
  if (key === MASTER_VIP_KEY) {
    return { isValid: true, tier: "diamond" };
  }

  // مفاتيح VIP مختلفة المستويات
  const vipKeys: Record<string, keyof typeof VIP_TIERS> = {
    KNOUX_GOLD_2025: "gold",
    KNOUX_PLATINUM_2025: "platinum",
    KNOUX_DIAMOND_2025: "diamond",
    SADEK_ELGAZAR_EXCLUSIVE: "diamond",
    AI_UNLEASHED_ULTIMATE: "diamond",
  };

  // التحقق من مفاتيح مشفرة
  try {
    const decoded = Buffer.from(key, "base64").toString("utf8");
    if (vipKeys[decoded]) {
      return { isValid: true, tier: vipKeys[decoded] };
    }
  } catch (error) {
    // تجاهل أخطاء فك التشفير
  }

  // التحقق من مفاتيح عادية
  if (vipKeys[key]) {
    return { isValid: true, tier: vipKeys[key] };
  }

  return { isValid: false };
}

// إنشاء جلسة VIP
export function createVIPSession(
  userId: string,
  vipKey: string,
  tier: keyof typeof VIP_TIERS,
): { sessionKey: string; token: string } {
  const sessionKey = `vip_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعة

  const session: VIPSession = {
    userId,
    sessionKey,
    isActive: true,
    tier,
    expiresAt,
    permissions: VIP_TIERS[tier].permissions,
  };

  vipSessions.set(sessionKey, session);

  // إنشاء JWT token
  const token = jwt.sign(
    {
      sessionKey,
      userId,
      tier,
      permissions: session.permissions,
    },
    VIP_JWT_SECRET,
    {
      expiresIn: "24h",
      issuer: "knoux-versa",
      audience: "vip-users",
    },
  );

  console.log(`✅ تم إنشاء جلسة VIP ${tier} للمستخدم ${userId}`);

  return { sessionKey, token };
}

// middleware للتحقق من VIP
export function validateVIPAccess(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const vipToken = req.headers["x-vip-token"] as string;
  const vipKey = req.headers["x-vip-key"] as string;
  const authHeader = req.headers.authorization;

  // إذا كان هناك token موجود
  if (vipToken || (authHeader && authHeader.startsWith("Bearer "))) {
    const token = vipToken || authHeader!.split(" ")[1];

    try {
      const decoded = jwt.verify(token, VIP_JWT_SECRET) as any;
      const session = vipSessions.get(decoded.sessionKey);

      if (!session || !session.isActive || new Date() > session.expiresAt) {
        return res.status(401).json({
          success: false,
          error: "جلسة VIP منتهية الصلاحية أو غير صحيحة",
          code: "VIP_SESSION_EXPIRED",
        });
      }

      req.vipSession = session;
      req.isVIP = true;

      console.log(
        `🔑 تم التحقق من جلسة VIP ${session.tier} للمستخدم ${session.userId}`,
      );
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "رمز VIP غير صحيح",
        code: "INVALID_VIP_TOKEN",
      });
    }
  }

  // إذا كان هناك مفتاح VIP مباشر
  if (vipKey) {
    const validation = validateVIPKey(vipKey);

    if (!validation.isValid) {
      return res.status(401).json({
        success: false,
        error: "مفتاح VIP غير صحيح",
        code: "INVALID_VIP_KEY",
      });
    }

    // إنشاء جلسة مؤقتة
    const tempUserId = `temp_${Date.now()}`;
    const { sessionKey, token } = createVIPSession(
      tempUserId,
      vipKey,
      validation.tier!,
    );
    const session = vipSessions.get(sessionKey)!;

    req.vipSession = session;
    req.isVIP = true;

    // إرسال معلومات الجلسة في الاستجابة
    res.setHeader("X-VIP-Session", sessionKey);
    res.setHeader("X-VIP-Token", token);
    res.setHeader("X-VIP-Tier", validation.tier!);

    console.log(
      `🔑 تم إنشاء جلسة VIP مؤقتة ${validation.tier} باستخدام مفتاح مباشر`,
    );
    return next();
  }

  // لا يوجد تفويض VIP
  return res.status(401).json({
    success: false,
    error: "الوصول محصور على VIP فقط",
    code: "VIP_ACCESS_REQUIRED",
    hint: "أرسل x-vip-key أو x-vip-token في headers",
  });
}

// middleware للتحقق من صلاحيات محددة
export function requireVIPPermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.vipSession) {
      return res.status(401).json({
        success: false,
        error: "مطلوب جلسة VIP صحيحة",
        code: "VIP_SESSION_REQUIRED",
      });
    }

    if (!req.vipSession.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: `هذه الميزة تتطلب صلاحية: ${permission}`,
        code: "INSUFFICIENT_VIP_PERMISSIONS",
        currentTier: req.vipSession.tier,
        requiredPermission: permission,
      });
    }

    next();
  };
}

// middleware للتحقق من مستوى VIP
export function requireVIPTier(minTier: keyof typeof VIP_TIERS) {
  const tierLevels = { gold: 1, platinum: 2, diamond: 3 };

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.vipSession) {
      return res.status(401).json({
        success: false,
        error: "مطلوب جلسة VIP صحيحة",
        code: "VIP_SESSION_REQUIRED",
      });
    }

    const currentLevel = tierLevels[req.vipSession.tier];
    const requiredLevel = tierLevels[minTier];

    if (currentLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        error: `هذه الميزة تتطلب VIP ${minTier} أو أعلى`,
        code: "INSUFFICIENT_VIP_TIER",
        currentTier: req.vipSession.tier,
        requiredTier: minTier,
      });
    }

    next();
  };
}

// الحصول على معلومات VIP
export function getVIPInfo(req: AuthenticatedRequest, res: Response) {
  if (!req.vipSession) {
    return res.status(401).json({
      success: false,
      error: "غير مسموح للوصول",
      code: "UNAUTHORIZED",
    });
  }

  const tierInfo = VIP_TIERS[req.vipSession.tier];

  res.json({
    success: true,
    vipInfo: {
      tier: req.vipSession.tier,
      tierName: tierInfo.name,
      permissions: req.vipSession.permissions,
      features: tierInfo.features,
      limits: {
        concurrent: tierInfo.concurrentRequests,
        daily: tierInfo.dailyLimit,
      },
      session: {
        key: req.vipSession.sessionKey,
        expiresAt: req.vipSession.expiresAt,
        isActive: req.vipSession.isActive,
      },
    },
  });
}

// تجديد جلسة VIP
export function renewVIPSession(req: AuthenticatedRequest, res: Response) {
  if (!req.vipSession) {
    return res.status(401).json({
      success: false,
      error: "غير مسموح للوصول",
      code: "UNAUTHORIZED",
    });
  }

  // تمديد انتهاء الصلاحية
  const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  req.vipSession.expiresAt = newExpiresAt;

  // إنشاء token جديد
  const newToken = jwt.sign(
    {
      sessionKey: req.vipSession.sessionKey,
      userId: req.vipSession.userId,
      tier: req.vipSession.tier,
      permissions: req.vipSession.permissions,
    },
    VIP_JWT_SECRET,
    {
      expiresIn: "24h",
      issuer: "knoux-versa",
      audience: "vip-users",
    },
  );

  res.json({
    success: true,
    message: "تم تجديد جلسة VIP بنجاح",
    newToken,
    expiresAt: newExpiresAt,
  });
}

// إنهاء جلسة VIP
export function terminateVIPSession(req: AuthenticatedRequest, res: Response) {
  if (!req.vipSession) {
    return res.status(401).json({
      success: false,
      error: "غير مسموح للوصول",
      code: "UNAUTHORIZED",
    });
  }

  // إلغاء تفعيل الجلسة
  req.vipSession.isActive = false;
  vipSessions.delete(req.vipSession.sessionKey);

  res.json({
    success: true,
    message: "تم إنهاء جلسة VIP بنجاح",
  });
}

// تنظيف الجلسات المنتهية الصلاحية
export function cleanupExpiredSessions() {
  const now = new Date();
  let cleanupCount = 0;

  for (const [sessionKey, session] of vipSessions.entries()) {
    if (now > session.expiresAt || !session.isActive) {
      vipSessions.delete(sessionKey);
      cleanupCount++;
    }
  }

  if (cleanupCount > 0) {
    console.log(`🧹 تم تنظيف ${cleanupCount} جلسة VIP منتهية الصلاحية`);
  }
}

// تشغيل تنظيف دوري كل ساعة
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

// إحصائيات VIP
export function getVIPStats() {
  const activeSessions = Array.from(vipSessions.values()).filter(
    (s) => s.isActive && new Date() < s.expiresAt,
  );
  const tierCounts = activeSessions.reduce(
    (acc, session) => {
      acc[session.tier] = (acc[session.tier] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    totalActive: activeSessions.length,
    totalRegistered: vipSessions.size,
    tierDistribution: tierCounts,
    masterKeySet: !!MASTER_VIP_KEY,
  };
}

// تصدير الأنواع والثوابت
export { VIP_TIERS, type VIPSession, type AuthenticatedRequest };
