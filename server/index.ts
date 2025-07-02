import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { aiServiceManager } from "./ai/core/AIServiceManager";
import aiRoutes from "./ai/routes/aiRoutes";
import {
  monitorPerformance,
  getCurrentMetrics,
} from "./ai/middleware/monitoring";

const app = express();

// Security and performance middleware - allow embedding in Builder.io
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for development
    frameguard: false, // Allow embedding in iframes for Builder.io
  }),
);
app.use(compression());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? true
        : [
            "https://yourdomain.com",
            "https://builder.io",
            "https://*.builder.io",
            "https://cdn.builder.io",
            "https://*.builder.my",
          ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Logging
app.use(morgan("combined"));

// Body parsing with increased limits for AI processing
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// File upload handling
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Image upload endpoint
app.post(
  "/api/upload",
  upload.single("image"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  },
);

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Trust proxy for correct IP detection
app.set("trust proxy", 1);

// Add monitoring middleware
app.use(monitorPerformance);

// Add headers for Builder.io iframe support
app.use((req, res, next) => {
  // Allow embedding in Builder.io iframes
  res.setHeader("X-Frame-Options", "ALLOWALL");
  res.setHeader("Content-Security-Policy", "frame-ancestors *;");

  // Additional CORS headers for Builder.io
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log("🚀 Starting KNOUX VERSA AI Server...");

  // Initialize AI Service Manager
  try {
    if (!aiServiceManager.isReady()) {
      console.log("⏳ Initializing AI Service Manager...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Give it time to initialize
    }
    console.log("✅ AI Service Manager ready");
  } catch (error) {
    console.error("❌ Failed to initialize AI Service Manager:", error);
    process.exit(1);
  }

  // Register AI routes
  app.use("/api/ai", aiRoutes);

  // AI service status endpoint
  app.get("/api/ai-status", (req, res) => {
    const status = aiServiceManager.getServicesStatus();
    const metrics = getCurrentMetrics();

    res.json({
      success: true,
      ai: {
        status: "operational",
        services: status,
        performance: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          requests: {
            total: metrics.requestCount,
            active: metrics.activeRequests,
            success: metrics.successCount,
            errors: metrics.errorCount,
          },
        },
      },
    });
  });

  // Register original routes
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("🔥 Server Error:", {
      status,
      message,
      stack: err.stack,
      url: _req.url,
      method: _req.method,
    });

    res.status(status).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  });

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      error: "API endpoint not found",
      path: req.path,
    });
  });

  // Setup Vite for development or serve static files for production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      console.log(`🌟 KNOUX VERSA Server running on port ${port}`);
      console.log(
        `🤖 AI Services: ${Object.keys(aiServiceManager.getServicesStatus().services).length} services loaded`,
      );
      console.log(`🔗 API Health: http://localhost:${port}/api/ai/health`);
      console.log(`📊 AI Status: http://localhost:${port}/api/ai-status`);

      if (process.env.NODE_ENV === "development") {
        console.log(`🛠️ Development mode enabled`);
      }
    },
  );

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("📴 Received SIGTERM, shutting down gracefully...");
    await aiServiceManager.shutdown();
    server.close(() => {
      console.log("✅ Server shutdown complete");
      process.exit(0);
    });
  });

  process.on("SIGINT", async () => {
    console.log("📴 Received SIGINT, shutting down gracefully...");
    await aiServiceManager.shutdown();
    server.close(() => {
      console.log("✅ Server shutdown complete");
      process.exit(0);
    });
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error("🔥 Unhandled Rejection at:", promise, "reason:", reason);
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error("🔥 Uncaught Exception:", error);
    process.exit(1);
  });
})();
