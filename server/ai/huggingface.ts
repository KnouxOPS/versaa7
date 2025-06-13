import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { createCanvas } from 'canvas';

export interface HuggingFaceRequest {
  prompt: string;
  imageUrl: string;
  service: string;
  selectionData?: string;
  quality: string;
  isVIP: boolean;
}

export interface HuggingFaceResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
}

export class HuggingFaceService {
  private apiUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.apiUrl = 'https://api-inference.huggingface.co/models';
    this.headers = {
      'Content-Type': 'application/json',
    };
    
    // Add HuggingFace token if available (optional for many free models)
    if (process.env.HUGGINGFACE_API_KEY) {
      this.headers['Authorization'] = `Bearer ${process.env.HUGGINGFACE_API_KEY}`;
    }
  }

  async transformImage(request: HuggingFaceRequest): Promise<HuggingFaceResponse> {
    try {
      switch (request.service) {
        case 'magic-morph':
          return await this.magicMorph(request);
        case 'remove-replace':
          return await this.removeReplace(request);
        case 'style-transfer':
          return await this.styleTransfer(request);
        case 'background-replace':
          return await this.backgroundReplace(request);
        case 'object-recolor':
          return await this.objectRecolor(request);
        case 'text2image':
          return await this.text2ImageAdd(request);
        case 'ai-enhance':
          return await this.aiEnhance(request);
        case 'vip-magic':
          return await this.vipMagicMorph(request);
        default:
          throw new Error(`Unsupported service: ${request.service}`);
      }
    } catch (error) {
      console.error('HuggingFace API error:', error);
      return {
        imageUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async magicMorph(request: HuggingFaceRequest): Promise<HuggingFaceResponse> {
    const enhancedPrompt = `Transform the selected area: ${request.prompt}, highly detailed, photorealistic, 8k quality`;
    return await this.callInpainting(request.imageUrl, enhancedPrompt, request.selectionData, 'runwayml/stable-diffusion-inpainting');
  }

  private async removeReplace(request: HuggingFaceRequest): Promise<HuggingFaceResponse> {
    const inpaintPrompt = request.prompt || "remove the selected object completely, fill with appropriate background";
    return await this.callInpainting(request.imageUrl, inpaintPrompt, request.selectionData, 'runwayml/stable-diffusion-inpainting');
  }

  private async styleTransfer(request: HuggingFaceRequest): Promise<HuggingFaceResponse> {
    const stylePrompt = `Apply ${request.prompt} style to the image, artistic, masterpiece quality`;
    return await this.callImageToImage(request.imageUrl, stylePrompt, 'stabilityai/stable-diffusion-2-1');
  }

  private async backgroundReplace(request: HuggingFaceRequest): Promise<HuggingFaceResponse> {
    const bgPrompt = `Replace background with: ${request.prompt}, professional photography`;
    return await this.callInpainting(request.imageUrl, bgPrompt, request.selectionData, 'runwayml/stable-diffusion-inpainting');
  }

  private async objectRecolor(request: HuggingFaceRequest): Promise<HuggingFaceResponse> {
    const colorPrompt = `Change color of selected object to: ${request.prompt}, maintain object shape and details`;
    return await this.callInpainting(request.imageUrl, colorPrompt, request.selectionData, 'runwayml/stable-diffusion-inpainting');
  }

  private async text2ImageAdd(request: HuggingFaceRequest): Promise<HuggingFaceResponse> {
    const addPrompt = `Add to the image: ${request.prompt}, seamless integration, realistic`;
    return await this.callInpainting(request.imageUrl, addPrompt, request.selectionData, 'runwayml/stable-diffusion-inpainting');
  }

  private async aiEnhance(request: HuggingFaceRequest): Promise<HuggingFaceResponse> {
    const enhancePrompt = `enhance quality, ${request.prompt}, ultra high definition, sharp details`;
    return await this.callUpscale(request.imageUrl, enhancePrompt);
  }

  private async vipMagicMorph(request: HuggingFaceRequest): Promise<HuggingFaceResponse> {
    if (!request.isVIP) {
      throw new Error('VIP access required for Magic Morph service');
    }
    
    const vipPrompt = `Premium high-quality transformation: ${request.prompt}, ultra premium quality, unlimited creativity, masterpiece, 8k, HDR`;
    return await this.callInpainting(request.imageUrl, vipPrompt, request.selectionData, 'stabilityai/stable-diffusion-2-inpainting');
  }

  private async callInpainting(
    imageUrl: string, 
    prompt: string, 
    maskData?: string,
    model: string = 'runwayml/stable-diffusion-inpainting'
  ): Promise<HuggingFaceResponse> {
    try {
      const imageBuffer = await this.downloadImage(imageUrl);
      
      let maskBuffer: Buffer | undefined;
      if (maskData) {
        maskBuffer = await this.createMaskFromSelection(maskData);
      }

      // For HuggingFace inference API, we need to send as form data
      const formData = new FormData();
      formData.append('inputs', prompt);
      formData.append('image', new Blob([imageBuffer]), 'image.png');
      if (maskBuffer) {
        formData.append('mask_image', new Blob([maskBuffer]), 'mask.png');
      }

      const response = await fetch(`${this.apiUrl}/${model}`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'multipart/form-data'
        },
        body: formData as any
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API request failed: ${response.statusText}`);
      }

      const imageBlob = await response.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const outputPath = await this.saveImageBuffer(buffer);
        
      return {
        imageUrl: outputPath,
        success: true
      };
    } catch (error) {
      console.error('HuggingFace Inpainting API error:', error);
      throw error;
    }
  }

  private async callImageToImage(
    imageUrl: string, 
    prompt: string, 
    model: string = 'stabilityai/stable-diffusion-2-1'
  ): Promise<HuggingFaceResponse> {
    try {
      const imageBuffer = await this.downloadImage(imageUrl);

      const response = await fetch(`${this.apiUrl}/${model}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            image: imageBuffer.toString('base64'),
            num_inference_steps: 30,
            guidance_scale: 7.5,
            strength: 0.6
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API request failed: ${response.statusText}`);
      }

      const imageBlob = await response.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const outputPath = await this.saveImageBuffer(buffer);
        
      return {
        imageUrl: outputPath,
        success: true
      };
    } catch (error) {
      console.error('HuggingFace Image2Image API error:', error);
      throw error;
    }
  }

  private async callUpscale(
    imageUrl: string, 
    prompt: string = 'upscale image, enhance quality'
  ): Promise<HuggingFaceResponse> {
    try {
      const imageBuffer = await this.downloadImage(imageUrl);

      const response = await fetch(`${this.apiUrl}/stabilityai/stable-diffusion-x4-upscaler`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          inputs: imageBuffer.toString('base64'),
          parameters: {
            prompt: prompt,
            num_inference_steps: 20
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HuggingFace Upscale API request failed: ${response.statusText}`);
      }

      const imageBlob = await response.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const outputPath = await this.saveImageBuffer(buffer);
        
      return {
        imageUrl: outputPath,
        success: true
      };
    } catch (error) {
      console.error('HuggingFace Upscale API error:', error);
      throw error;
    }
  }

  private async downloadImage(imageUrl: string): Promise<Buffer> {
    if (imageUrl.startsWith('data:')) {
      // Handle base64 data URLs
      const base64Data = imageUrl.split(',')[1];
      return Buffer.from(base64Data, 'base64');
    } else if (imageUrl.startsWith('http')) {
      // Handle external URLs
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } else {
      // Handle local file paths
      return await fs.readFile(imageUrl);
    }
  }

  private async saveImageBuffer(buffer: Buffer): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const filename = `generated-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const filePath = path.join(uploadsDir, filename);
    
    await fs.writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  }

  private async createMaskFromSelection(selectionData: string): Promise<Buffer> {
    try {
      // Parse selection data (assuming it's JSON with coordinates)
      const selection = JSON.parse(selectionData);
      
      // Create a canvas for the mask
      const canvas = createCanvas(selection.width || 512, selection.height || 512);
      const ctx = canvas.getContext('2d');
      
      // Fill with black (masked areas)
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw white areas where selection exists
      ctx.fillStyle = 'white';
      
      if (selection.type === 'rectangle') {
        ctx.fillRect(selection.x, selection.y, selection.width, selection.height);
      } else if (selection.type === 'circle') {
        ctx.beginPath();
        ctx.arc(selection.x, selection.y, selection.radius, 0, 2 * Math.PI);
        ctx.fill();
      } else if (selection.type === 'polygon' && selection.points) {
        ctx.beginPath();
        ctx.moveTo(selection.points[0].x, selection.points[0].y);
        for (let i = 1; i < selection.points.length; i++) {
          ctx.lineTo(selection.points[i].x, selection.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
      }
      
      return canvas.toBuffer('image/png');
    } catch (error) {
      console.error('Error creating mask from selection:', error);
      // Return a default mask (all white - no masking)
      const canvas = createCanvas(512, 512);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 512, 512);
      return canvas.toBuffer('image/png');
    }
  }
}