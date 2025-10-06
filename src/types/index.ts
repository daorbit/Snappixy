import { type OptimizationResult } from '../services/imageOptimizationService.ts';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  accessToken?: string; // Google access token for API calls
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshGoogleDriveToken: () => Promise<string>;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
  size?: string;
}

export interface OptimizationOptions {
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  maxWidth?: number;
  maxHeight?: number;
}

export interface ThumbnailOptions {
  title?: string;
  description: string;
  category?: string;
  style: 'modern' | 'classic' | 'bold' | 'minimal';
  primaryColor?: string;
  backgroundColor?: string;
}

export interface ProcessedImage {
  original: File;
  originalBase64: string;
  optimized?: Blob;
  optimizedBase64?: string;
  result?: OptimizationResult;
  aiOptimized?: boolean;
}
