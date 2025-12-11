// src/shared/types.ts (Shared types for Frontend/Backend communication clarity)

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
  STYLEGAN3 = "stylegan3",
  CARTOONGAN = "cartoongan",
  ANIMEGAN = "animegan",
  BODYNET = "bodynet",
  LIGHTINGNET = "lightingnet",
  CLOTHINGNET = "clothingnet",
  AGENET = "agenet",
  GENDERNET = "gendernet",
  POSEMASTER = "posemaster",
  HAIRSTYLIST = "hairstylist",
  MAKEUPGAN = "makeupgan",
  TATTOONET = "tattoonet",
  JEWELRYNET = "jewelrynet",
  MUSCLEENHANCER = "muscleenhancer",
  VINTAGEFILTER = "vintagefilter",
}

// Needs to match ModelInfo Pydantic model structure
export interface AIModelInfo {
  name: string;
  backend_identifier: string; // Matches AIModelIdentifier values
  size_gb: number;
  processing_time_secs: string;
  gpu_required?: boolean;
  min_vram_gb?: number;
}

// Needs to match ToolFeature Pydantic model structure
export interface ToolFeature {
  description_ar: string;
  description_en: string;
}

// Needs to match AiTool Pydantic model structure
export interface AiTool {
  id: string; // 'face_swap', 'hd_boost', etc.
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  category: string; // 'Face', 'Body', etc.
  model_info: AIModelInfo;
  features: ToolFeature[];
  is_sensitive: boolean;
  requires_mask: boolean;
  requires_prompt: boolean;
  requires_second_image?: boolean;
  input_types?: string[]; // e.g., ['image', 'image2']
  input_schema?: { [key: string]: any };
  output_schema?: { [key: string]: any };
  processing_complexity?: "low" | "medium" | "high" | "extreme";
  quality_modes?: string[];

  // Helper methods mirrored (or logic in component/hook)
  getName(lang: "ar" | "en"): string;
  getDescription(lang: "ar" | "en"): string;
  getFeatures(lang: "ar" | "en"): string[];
}

// Interface for mask data handling
export interface MaskData {
  imageData: ImageData;
  canvas: HTMLCanvasElement;
  base64: string;
}

// Interface for brush state
export interface BrushState {
  isDrawing: boolean;
  brushSize: number;
  brushOpacity: number;
  brushHardness: number;
  lastPoint: { x: number; y: number } | null;
}

// Interface for image editing state
export interface ImageEditingState {
  originalImage: string | null;
  editedImage: string | null;
  currentMask: MaskData | null;
  brushState: BrushState;
  selectedTool: AiTool | null;
  isProcessing: boolean;
  progress: number;
  statusMessage: string;
}

// Define the structure for the request payload sent from frontend to backend /process_tool
// This is generic; specific tool details go into 'settings'
export interface ProcessToolRequestPayload {
  tool_id: string; // Identifier of the tool being used
  image?: string; // Base image data (Data URL or Base64) - optional depending on tool (e.g., text-to-image might not need one)
  mask?: string; // Mask data (Base64 or Array) - optional, required if requires_mask is true for the tool
  prompt?: string; // User text prompt - optional, required if requires_prompt is true
  // Add input for second image if required (e.g., for Face Swap)
  image2?: string; // Optional second image data (Base64)
  // Specific settings relevant to the chosen tool (upscale_factor, target_color, negative_prompt etc.)
  settings?: { [key: string]: any };
}

// Define the structure for the response received by the frontend
export interface ProcessToolResponse {
  editedImage?: string; // Result image data (Data URL or Base64) - Optional, depending on output_type
  success: boolean; // Indicates successful processing (even if editedImage is null/undefined)
  message?: string; // Optional status or error message
  // Add any other output data defined in output_schema
  // results?: { [key: string]: any };
}

// Interface for getting list of available tools
export interface GetToolsListResponse {
  tools: AiTool[];
  categories: string[]; // List of all available categories
}

// Interface for Model Download status/request
export interface DownloadModelRequest {
  model_backend_identifier: string;
}

export interface DownloadModelResponse {
  success: boolean;
  message: string;
  model_identifier: string;
  status: "downloading" | "downloaded" | "failed" | "already_present";
  progress?: number; // 0-1 for progress
}
