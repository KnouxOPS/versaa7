// TypeScript equivalent of the Pydantic models for AI Tools

export const TOOL_CATEGORIES = [
  "Face",
  "Body",
  "Background & Environment",
  "Artistic & Creative",
  "Technical Enhancement",
  "Advanced Tools",
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

// AI Model Identifiers used internally by ModelLoader
export enum AIModelIdentifier {
  DEEPFACELAB_SAEHD = "deepfacelab_saehd",
  PHI3_VISION = "phi3_vision",
  STABLE_DIFFUSION_XL = "stable_diffusion_xl",
  STABLE_DIFFUSION_V21 = "stable_diffusion_v21",
  SEGMENT_ANYTHING = "segment_anything",
  REAL_ESRGAN = "real_esrgan",
  CONTROLNET = "controlnet",
  MODNET = "modnet",
  CLIP_SAM = "clip_sam",
  REALISTIC_VISION = "realistic_vision",
  ANYTHING_V6 = "anything_v6",
  PROMPT_TO_MASK = "prompt_to_mask",
  GFPGAN = "gfpgan",
  CODEFORMER = "codeformer",
  REMBG = "rembg",
  DEPTH_ESTIMATION = "depth_estimation",
}

// Model Information embedded in Tool
export interface ModelInfo {
  name: string; // Public display name of the AI model
  backend_identifier: AIModelIdentifier; // Internal key for ModelLoader
  size_gb: number; // Size of the model files in Gigabytes
  processing_time_secs: string; // Estimated processing time range in seconds
  gpu_required: boolean; // Whether GPU is required
  min_vram_gb?: number; // Minimum VRAM required
}

// Key Capability feature points
export interface ToolFeature {
  description_ar: string; // Arabic description of the feature
  description_en: string; // English description of the feature
}

// Input/Output type definitions
export interface InputSchema {
  [key: string]: {
    type: string;
    required?: boolean;
    default?: any;
    enum?: any[];
    description?: string;
  };
}

export interface OutputSchema {
  [key: string]: {
    type: string;
    description?: string;
  };
}

// Main interface for a single AI Tool
export interface AiTool {
  id: string; // Unique identifier for the tool
  name_ar: string; // Arabic name of the tool
  name_en: string; // English name of the tool
  description_ar: string; // Arabic description of the tool
  description_en: string; // English description of the tool
  category: ToolCategory; // Category for grouping the tool
  model_info: ModelInfo;
  features: ToolFeature[]; // List of key features/capabilities
  is_sensitive: boolean; // Indicates if the tool's output is sensitive (+18)
  requires_mask: boolean; // Does this tool require the user to provide a mask?
  requires_prompt: boolean; // Does this tool primarily use a text prompt?
  requires_second_image: boolean; // Does this tool require a second image input?
  input_schema: InputSchema; // JSON Schema defining expected input payload fields
  output_schema: OutputSchema; // JSON Schema defining expected output fields
  processing_complexity: "low" | "medium" | "high" | "extreme"; // Processing complexity level
  quality_modes: string[]; // Available quality modes like ['fast', 'balanced', 'quality']
}

// Utility class for AI Tool operations
export class AiToolUtils {
  static getName(tool: AiTool, lang: string = "ar"): string {
    return lang === "ar" ? tool.name_ar : tool.name_en;
  }

  static getDescription(tool: AiTool, lang: string = "ar"): string {
    return lang === "ar" ? tool.description_ar : tool.description_en;
  }

  static getFeatures(tool: AiTool, lang: string = "ar"): string[] {
    return tool.features.map((f) =>
      lang === "ar" ? f.description_ar : f.description_en,
    );
  }

  static getToolsByCategory(tools: AiTool[], category: ToolCategory): AiTool[] {
    return tools.filter((tool) => tool.category === category);
  }

  static getSensitiveTools(tools: AiTool[]): AiTool[] {
    return tools.filter((tool) => tool.is_sensitive);
  }

  static getToolsByComplexity(
    tools: AiTool[],
    complexity: AiTool["processing_complexity"],
  ): AiTool[] {
    return tools.filter((tool) => tool.processing_complexity === complexity);
  }

  static getRequiredInputTypes(tool: AiTool): string[] {
    const inputs = ["image"]; // Base image is always required

    if (tool.requires_mask) inputs.push("mask");
    if (tool.requires_prompt) inputs.push("prompt");
    if (tool.requires_second_image) inputs.push("image2");

    return inputs;
  }

  static estimateProcessingTime(
    tool: AiTool,
    imageSize: "small" | "medium" | "large" = "medium",
  ): string {
    const baseTime = tool.processing_time_secs;
    const multiplier =
      imageSize === "small" ? 0.7 : imageSize === "large" ? 1.5 : 1;

    // Extract numbers from time range and apply multiplier
    const matches = baseTime.match(/(\d+)-(\d+)/);
    if (matches) {
      const min = Math.round(parseInt(matches[1]) * multiplier);
      const max = Math.round(parseInt(matches[2]) * multiplier);
      return `${min}-${max} ثانية`;
    }

    return baseTime;
  }
}

// Tool status for runtime management
export interface ToolStatus {
  id: string;
  is_loaded: boolean;
  is_downloading: boolean;
  download_progress?: number;
  last_used?: Date;
  usage_count: number;
  average_processing_time?: number;
  success_rate?: number;
  error_count: number;
}

// Processing request interface
export interface ProcessingRequest {
  tool_id: string;
  image_base64: string;
  mask_base64?: string;
  prompt?: string;
  image2_base64?: string;
  quality_mode?: string;
  custom_parameters?: Record<string, any>;
  user_id?: string;
  session_id?: string;
}

// Processing response interface
export interface ProcessingResponse {
  success: boolean;
  result_image_base64?: string;
  processing_time_ms: number;
  model_used: string;
  quality_metrics?: {
    sharpness: number;
    noise_level: number;
    color_accuracy: number;
  };
  metadata?: Record<string, any>;
  error_message?: string;
  warnings?: string[];
}

// Batch processing interface
export interface BatchProcessingJob {
  id: string;
  tool_id: string;
  images: Array<{
    id: string;
    image_base64: string;
    mask_base64?: string;
    prompt?: string;
  }>;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  started_at?: Date;
  completed_at?: Date;
  results?: ProcessingResponse[];
}
