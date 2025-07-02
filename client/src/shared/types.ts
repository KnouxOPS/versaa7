// src/shared/types.ts (Shared types for Frontend/Backend communication clarity)

// Needs to match ModelInfo Pydantic model structure
export interface AIModelInfo {
  name: string;
  backend_identifier: string; // Matches AIModelIdentifier values
  size_gb: number;
  processing_time_secs: string;
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
  // input_types: string[]; // e.g., ['image', 'image2']
  // Add other specific info needed by the frontend UI

  // Helper methods mirrored (or logic in component/hook)
  getName(lang: "ar" | "en"): string;
  getDescription(lang: "ar" | "en"): string;
  getFeatures(lang: "ar" | "en"): string[];
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
