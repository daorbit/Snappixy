import { GoogleGenAI } from "@google/genai";

export class GoogleDriveService {
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('Snappixy_token');
  }

  async authenticate(): Promise<boolean> {
    try {
      // Initialize Google Drive API
      await new Promise((resolve) => {
        if (window.gapi) {
          resolve(window.gapi);
        } else {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = () => resolve(window.gapi);
          document.head.appendChild(script);
        }
      });

      await window.gapi.load('client:auth2', async () => {
        await window.gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.file',
        });
      });

      return true;
    } catch (error) {
      console.error('Google Drive authentication error:', error);
      return false;
    }
  }

  async listImages(pageSize: number = 10, pageToken?: string) {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: "mimeType contains 'image/' and trashed=false",
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(id, name, mimeType, thumbnailLink, webViewLink, size)',
      });

      return response.result;
    } catch (error) {
      console.error('Error listing images:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string): Promise<Blob> {
    try {
      const response = await window.gapi.client.drive.files.get({
        fileId,
        alt: 'media',
      });

      // Convert response to blob
      const blob = new Blob([response.body], { type: 'image/*' });
      return blob;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async uploadFile(file: File, name: string): Promise<string> {
    try {
      const metadata = {
        name: name,
        parents: ['appDataFolder'], // Store in app-specific folder
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ Authorization: `Bearer ${this.accessToken}` }),
        body: form,
      });

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

export class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async generateThumbnailImage(prompt: string, options: {
    width?: number;
    height?: number;
    style?: string;
  } = {}): Promise<string> {
    try {
      // Create a direct thumbnail generation prompt for Gemini 2.5 Flash Image
      const enhancedPrompt = this.createThumbnailPrompt(prompt, options);
      
      // Use the official Google GenAI SDK
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: [{ text: enhancedPrompt }],
      });

      // Check if response has candidates and parts
      if (response.candidates && response.candidates[0]?.content?.parts) {
        // Look for inline_data (base64 image) in the response
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // Return the base64 image data with proper data URL format
            const mimeType = part.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      
      // If no image was generated, throw error to trigger fallback
      throw new Error('Gemini did not return image data');
      
    } catch (error) {
      console.error('Error generating thumbnail with Gemini API:', error);
      // Fallback to canvas-based generation
      return await this.createCanvasThumbnail(prompt, options);
    }
  }

  private createThumbnailPrompt(prompt: string, options: {
    width?: number;
    height?: number;
    style?: string;
  }): string {
    const width = options.width || 1280;
    const height = options.height || 720;
    const aspectRatio = width > height ? 'landscape' : width < height ? 'portrait' : 'square';
    
    return `Create a high-quality thumbnail image with the following specifications:

Content Description: ${prompt}

Technical Requirements:
- Aspect ratio: ${aspectRatio} (${width}x${height})
- Style: ${options.style || 'modern'}
- High resolution and professional quality
- Optimized for social media and video platforms
- Eye-catching and click-worthy design

Design Elements:
- Bold, readable typography for any text
- High contrast colors for visibility
- Professional composition and layout
- Engaging visual hierarchy
- Suitable for thumbnail display

The image should be vibrant, attention-grabbing, and professionally designed to maximize click-through rates. Focus on creating a compelling visual that clearly represents the content while maintaining excellent visual appeal.`;
  }

  async generateThumbnailWithImage(imageData: string, options: {
    title: string;
    description: string;
    category: string;
    style: string;
    primaryColor?: string;
    backgroundColor?: string;
  }): Promise<string> {
    try {
      // Extract base64 data from data URL
      const base64Data = imageData.split(',')[1];
      const mimeType = imageData.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
      
      const prompt = `Create a professional thumbnail design that incorporates elements from the provided image.

Thumbnail Specifications:
- Title: "${options.title}"
- Description: "${options.description}"
- Category: ${options.category}
- Style: ${options.style}
- Primary Color: ${options.primaryColor || '#1976d2'}
- Background Color: ${options.backgroundColor || '#ffffff'}

Design Requirements:
- Use visual elements from the provided image as a foundation
- Create a compelling, click-worthy thumbnail layout
- Ensure the title text is bold, readable, and prominently displayed
- Maintain professional quality suitable for social media platforms
- Incorporate the specified color scheme harmoniously
- Follow ${options.style} design principles
- Optimize for thumbnail display and maximum visual impact

The final image should blend elements from the uploaded image with modern thumbnail design best practices, creating an engaging visual that represents ${options.category} content effectively.`;

      // Use the official Google GenAI SDK for image + text to image generation
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ],
      });

      // Check if response has candidates and parts
      if (response.candidates && response.candidates[0]?.content?.parts) {
        // Look for inline_data (base64 image) in the response
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // Return the base64 image data with proper data URL format
            const outputMimeType = part.inlineData.mimeType || 'image/png';
            console.log('Gemini AI successfully generated thumbnail with uploaded image');
            return `data:${outputMimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      
      // Fallback to canvas-based generation if API doesn't return image
      console.warn('Gemini API did not return image data, falling back to canvas generation');
      return await this.createThumbnailWithUploadedImage(imageData, '', options);
      
    } catch (error) {
      console.error('Error generating thumbnail with Gemini API and image:', error);
      // Fallback to canvas-based generation
      return await this.createThumbnailWithUploadedImage(imageData, '', options);
    }
  }

  private async createCanvasThumbnail(_prompt: string, options: {
    width?: number;
    height?: number;
    style?: string;
  }): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Set canvas dimensions
    const width = options.width || 1280;
    const height = options.height || 720;
    canvas.width = width;
    canvas.height = height;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1976d2');
    gradient.addColorStop(1, '#42a5f5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add title text
    const title = 'AI Generated Thumbnail';
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.floor(width / 20)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Draw title
    const titleY = height / 2;
    ctx.strokeText(title, width / 2, titleY);
    ctx.fillText(title, width / 2, titleY);

    // Add decorative elements based on style
    if (options.style === 'modern') {
      this.addModernElements(ctx, width, height);
    } else if (options.style === 'bold') {
      this.addBoldElements(ctx, width, height);
    }

    // Convert canvas to base64
    return canvas.toDataURL('image/png', 0.95);
  }

  private addModernElements(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add geometric shapes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 50, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillRect(width * 0.1, height * 0.8, 100, 20);
  }

  private addBoldElements(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add bold border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Add corner triangles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 0);
    ctx.lineTo(0, 100);
    ctx.closePath();
    ctx.fill();
  }

  private async createThumbnailWithUploadedImage(
    imageData: string, 
    _aiAnalysis: string, 
    options: {
      title: string;
      style: string;
      primaryColor?: string;
      backgroundColor?: string;
    }
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Set canvas dimensions for thumbnail
      const width = 1280;
      const height = 720;
      canvas.width = width;
      canvas.height = height;

      const img = new Image();
      img.onload = () => {
        try {
          // Create background
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, options.backgroundColor || '#ffffff');
          gradient.addColorStop(1, options.primaryColor || '#1976d2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);

          // Add semi-transparent overlay
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(0, 0, width, height);

          // Calculate image dimensions to fit nicely in thumbnail
          const imgAspect = img.width / img.height;
          let imgWidth, imgHeight, imgX, imgY;

          if (imgAspect > width / height) {
            imgWidth = width * 0.6;
            imgHeight = imgWidth / imgAspect;
            imgX = width * 0.2;
            imgY = (height - imgHeight) / 2;
          } else {
            imgHeight = height * 0.6;
            imgWidth = imgHeight * imgAspect;
            imgX = (width - imgWidth) / 2;
            imgY = height * 0.2;
          }

          // Add image with rounded corners
          ctx.save();
          ctx.beginPath();
          const radius = 15;
          ctx.roundRect(imgX, imgY, imgWidth, imgHeight, radius);
          ctx.clip();
          
          // Draw the uploaded image
          ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
          ctx.restore();

          // Add border around image
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.roundRect(imgX, imgY, imgWidth, imgHeight, radius);
          ctx.stroke();

          // Add title text
          const title = options.title || 'AI Generated Thumbnail';
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(width / 25)}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          
          // Add text shadow for better visibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          
          // Position title at the bottom
          const titleY = height - 80;
          ctx.fillText(title, width / 2, titleY);

          // Add decorative elements based on style
          if (options.style === 'modern') {
            this.addModernElementsOverlay(ctx, width, height);
          } else if (options.style === 'bold') {
            this.addBoldElementsOverlay(ctx, width, height);
          }

          // Convert canvas to base64
          resolve(canvas.toDataURL('image/png', 0.95));
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load uploaded image'));
      };

      img.src = imageData;
    });
  }

  private addModernElementsOverlay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add subtle geometric elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    
    // Add corner decoration
    ctx.beginPath();
    ctx.arc(width - 100, 100, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Add bottom accent line
    ctx.fillRect(width * 0.2, height - 20, width * 0.6, 4);
  }

  private addBoldElementsOverlay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add bold frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    
    // Add corner accents
    const accentSize = 40;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    // Top left
    ctx.fillRect(20, 20, accentSize, 6);
    ctx.fillRect(20, 20, 6, accentSize);
    
    // Top right
    ctx.fillRect(width - 60, 20, accentSize, 6);
    ctx.fillRect(width - 26, 20, 6, accentSize);
    
    // Bottom left
    ctx.fillRect(20, height - 26, accentSize, 6);
    ctx.fillRect(20, height - 60, 6, accentSize);
    
    // Bottom right
    ctx.fillRect(width - 60, height - 26, accentSize, 6);
    ctx.fillRect(width - 26, height - 60, 6, accentSize);
  }
}