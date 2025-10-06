export interface OptimizationOptions {
  quality?: number; // 0.1 to 1.0
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp';
  maintainAspectRatio?: boolean;
}

export interface OptimizationResult {
  blob: Blob;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  originalDimensions: { width: number; height: number };
  optimizedDimensions: { width: number; height: number };
}

export class ImageOptimizationService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context not supported');
    }
    this.ctx = context;
  }

  async optimizeImage(file: File | Blob, options: OptimizationOptions = {}): Promise<OptimizationResult> {
    const {
      quality = 0.8,
      maxWidth = 1920,
      maxHeight = 1080,
      format = 'jpeg',
      maintainAspectRatio = true,
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      const originalSize = file.size;

      img.onload = () => {
        try {
          const originalDimensions = { width: img.width, height: img.height };
          
          // Calculate new dimensions
          const { width, height } = this.calculateDimensions(
            img.width,
            img.height,
            maxWidth,
            maxHeight,
            maintainAspectRatio
          );

          // Set canvas dimensions
          this.canvas.width = width;
          this.canvas.height = height;

          // Clear canvas and draw optimized image
          this.ctx.fillStyle = format === 'jpeg' ? '#FFFFFF' : 'transparent';
          this.ctx.fillRect(0, 0, width, height);
          this.ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          this.canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create optimized image blob'));
                return;
              }

              const optimizedSize = blob.size;
              const compressionRatio = ((originalSize - optimizedSize) / originalSize) * 100;

              resolve({
                blob,
                originalSize,
                optimizedSize,
                compressionRatio,
                originalDimensions,
                optimizedDimensions: { width, height },
              });
            },
            this.getMimeType(format),
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for optimization'));
      };

      // Create object URL for the image
      const url = URL.createObjectURL(file);
      img.src = url;

      // Clean up object URL after loading
      img.addEventListener('load', () => {
        URL.revokeObjectURL(url);
      }, { once: true });
    });
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
    maintainAspectRatio: boolean
  ): { width: number; height: number } {
    if (!maintainAspectRatio) {
      return {
        width: Math.min(originalWidth, maxWidth),
        height: Math.min(originalHeight, maxHeight),
      };
    }

    const aspectRatio = originalWidth / originalHeight;
    
    let width = Math.min(originalWidth, maxWidth);
    let height = Math.min(originalHeight, maxHeight);

    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  // Apply filters and effects
  async applyFilter(
    file: File | Blob,
    filterType: 'brightness' | 'contrast' | 'saturation' | 'grayscale' | 'sepia' | 'blur',
    intensity: number = 1
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          this.canvas.width = img.width;
          this.canvas.height = img.height;

          // Apply filter based on type
          switch (filterType) {
            case 'brightness':
              this.ctx.filter = `brightness(${intensity})`;
              break;
            case 'contrast':
              this.ctx.filter = `contrast(${intensity})`;
              break;
            case 'saturation':
              this.ctx.filter = `saturate(${intensity})`;
              break;
            case 'grayscale':
              this.ctx.filter = `grayscale(${intensity})`;
              break;
            case 'sepia':
              this.ctx.filter = `sepia(${intensity})`;
              break;
            case 'blur':
              this.ctx.filter = `blur(${intensity}px)`;
              break;
            default:
              this.ctx.filter = 'none';
          }

          this.ctx.drawImage(img, 0, 0);

          this.canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to apply filter'));
                return;
              }
              // Reset filter
              this.ctx.filter = 'none';
              resolve(blob);
            },
            'image/jpeg',
            0.9
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for filtering'));
      };

      const url = URL.createObjectURL(file);
      img.src = url;

      img.addEventListener('load', () => {
        URL.revokeObjectURL(url);
      }, { once: true });
    });
  }

  // Resize image to specific dimensions
  async resizeImage(
    file: File | Blob,
    width: number,
    height: number,
    maintainAspectRatio: boolean = true
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          const dimensions = maintainAspectRatio
            ? this.calculateDimensions(img.width, img.height, width, height, true)
            : { width, height };

          this.canvas.width = dimensions.width;
          this.canvas.height = dimensions.height;

          this.ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

          this.canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to resize image'));
                return;
              }
              resolve(blob);
            },
            'image/jpeg',
            0.9
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for resizing'));
      };

      const url = URL.createObjectURL(file);
      img.src = url;

      img.addEventListener('load', () => {
        URL.revokeObjectURL(url);
      }, { once: true });
    });
  }

  // Convert image format
  async convertFormat(file: File | Blob, format: 'jpeg' | 'png' | 'webp', quality: number = 0.9): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          this.canvas.width = img.width;
          this.canvas.height = img.height;

          // For JPEG, fill with white background
          if (format === 'jpeg') {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(0, 0, img.width, img.height);
          }

          this.ctx.drawImage(img, 0, 0);

          this.canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to convert image format'));
                return;
              }
              resolve(blob);
            },
            this.getMimeType(format),
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for format conversion'));
      };

      const url = URL.createObjectURL(file);
      img.src = url;

      img.addEventListener('load', () => {
        URL.revokeObjectURL(url);
      }, { once: true });
    });
  }

  // Cleanup canvas
  cleanup(): void {
    this.canvas.width = 0;
    this.canvas.height = 0;
  }
}
