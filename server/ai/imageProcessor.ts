import { HuggingFaceService } from './huggingface';

interface ImageTransformRequest {
  originalImageUrl: string;
  prompt: string;
  service: string;
  selectionData?: string | undefined;
  quality: string;
  isVIP: boolean;
}

export async function processImageTransformation(request: ImageTransformRequest): Promise<string> {
  const aiService = new HuggingFaceService();
  
  try {
    const result = await aiService.transformImage({
      prompt: request.prompt,
      imageUrl: request.originalImageUrl,
      service: request.service,
      selectionData: request.selectionData,
      quality: request.quality,
      isVIP: request.isVIP
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Transformation failed');
    }
    
    return result.imageUrl;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error(`AI processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
