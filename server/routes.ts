import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { storage } from "./storage";
import {
  insertTransformationSchema,
  insertVipSessionSchema,
} from "@shared/schema";
import { processImageTransformation } from "./ai/imageProcessor";

// Configure multer for image uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Tools endpoints
  app.get("/api/tools/list", async (req, res) => {
    try {
      // Import tools database
      const { AI_TOOLS_DATABASE, ToolsDatabase } = await import(
        "../client/src/data/aiToolsDatabase"
      );

      const tools = AI_TOOLS_DATABASE.map((tool) => ({
        ...tool,
        getName: (lang: "ar" | "en") =>
          lang === "ar" ? tool.name_ar : tool.name_en,
        getDescription: (lang: "ar" | "en") =>
          lang === "ar" ? tool.description_ar : tool.description_en,
        getFeatures: (lang: "ar" | "en") =>
          tool.features.map((f) =>
            lang === "ar" ? f.description_ar : f.description_en,
          ),
      }));

      const categories = ToolsDatabase.getCategories();

      res.json({
        tools,
        categories,
        total: tools.length,
      });
    } catch (error) {
      console.error("Error fetching tools list:", error);
      res.status(500).json({ error: "Failed to fetch tools list" });
    }
  });

  // Process tool endpoint
  app.post("/api/tools/process", async (req, res) => {
    try {
      const { tool_id, image, mask, prompt, image2, settings } = req.body;

      if (!tool_id) {
        return res.status(400).json({ error: "Tool ID is required" });
      }

      // Simulate processing (replace with actual AI processing)
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 3000),
      );

      // Mock successful response
      res.json({
        success: true,
        editedImage: image, // Return same image for now
        message: `${tool_id} processing completed successfully`,
        processingTime: Math.floor(2000 + Math.random() * 3000),
        metadata: {
          toolId: tool_id,
          modelUsed: "Local AI Model",
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Tool processing error:", error);
      res.status(500).json({
        success: false,
        error: "Tool processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Model management endpoints
  app.post("/api/models/download", async (req, res) => {
    try {
      const { model_backend_identifier } = req.body;

      if (!model_backend_identifier) {
        return res.status(400).json({ error: "Model identifier is required" });
      }

      // Simulate download initiation
      res.json({
        success: true,
        message: `Download initiated for ${model_backend_identifier}`,
        model_identifier: model_backend_identifier,
        status: "downloading",
        progress: 0,
      });
    } catch (error) {
      console.error("Model download error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to initiate model download",
      });
    }
  });

  app.get("/api/models/status/:modelId", async (req, res) => {
    try {
      const { modelId } = req.params;

      // Simulate model status check
      const statuses = [
        "downloading",
        "downloaded",
        "failed",
        "already_present",
      ];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      res.json({
        success: true,
        model_identifier: modelId,
        status: randomStatus,
        progress:
          randomStatus === "downloading"
            ? Math.random()
            : randomStatus === "downloaded" ||
                randomStatus === "already_present"
              ? 1
              : 0,
        message: `Model ${modelId} is ${randomStatus}`,
      });
    } catch (error) {
      console.error("Model status error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check model status",
      });
    }
  });

  // Image upload endpoint
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Move file to permanent location
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const permanentPath = path.join("uploads", fileName);
      await fs.rename(req.file.path, permanentPath);

      res.json({
        imageUrl: `/uploads/${fileName}`,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // AI transformation endpoint
  app.post("/api/transform", async (req, res) => {
    try {
      const transformationData = insertTransformationSchema.parse(req.body);

      // Validate required fields
      if (
        !transformationData.originalImageUrl ||
        !transformationData.prompt ||
        !transformationData.service
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check VIP access for VIP services
      if (transformationData.isVIP) {
        const vipKey = req.headers["x-vip-key"] as string | undefined;
        if (!vipKey) {
          return res
            .status(401)
            .json({ error: "VIP key required for this service" });
        }

        const vipSession = await storage.getVipSession(vipKey);
        if (!vipSession || !vipSession.isActive) {
          return res.status(403).json({ error: "Invalid or expired VIP key" });
        }
      }

      // Process the image transformation
      const transformedImageUrl = await processImageTransformation({
        originalImageUrl: transformationData.originalImageUrl,
        prompt: transformationData.prompt,
        service: transformationData.service,
        selectionData: transformationData.selectionData || undefined,
        quality: transformationData.quality || "standard",
        isVIP: transformationData.isVIP || false,
      });

      // Save transformation to storage
      const transformation = await storage.createTransformation({
        ...transformationData,
        transformedImageUrl,
      });

      res.json(transformation);
    } catch (error) {
      console.error("Transformation error:", error);
      res.status(500).json({ error: "Failed to process transformation" });
    }
  });

  // VIP authentication endpoint
  app.post("/api/vip/authenticate", async (req, res) => {
    try {
      const { vipKey } = req.body;

      // Read the VIP key from the secure file
      const correctVipKey = process.env.VIP_KEY || "SADEK_ELGAZAR_VIP_2025";

      if (vipKey !== correctVipKey) {
        return res.status(401).json({ error: "Invalid VIP key" });
      }

      // Create VIP session
      const sessionKey = `vip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const vipSession = await storage.createVipSession({
        sessionKey,
        isActive: true,
        expiresAt,
      });

      res.json({
        success: true,
        sessionKey: vipSession.sessionKey,
        message: "VIP access granted. Welcome, Sadek Elgazar!",
      });
    } catch (error) {
      console.error("VIP auth error:", error);
      res.status(500).json({ error: "VIP authentication failed" });
    }
  });

  // Get transformation history
  app.get("/api/transformations", async (req, res) => {
    try {
      const userId = req.query.userId
        ? parseInt(req.query.userId as string)
        : undefined;
      const transformations = await storage.getUserTransformations(userId);
      res.json(transformations);
    } catch (error) {
      console.error("Get transformations error:", error);
      res.status(500).json({ error: "Failed to fetch transformations" });
    }
  });

  // Serve uploaded images
  app.use("/uploads", express.static("uploads"));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "KNOUX VERSA",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
