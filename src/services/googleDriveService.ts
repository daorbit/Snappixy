interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  downloadUrl?: string;
  modifiedTime: string;
  parents?: string[];
  hasThumbnail?: boolean;
  thumbnailVersion?: string;
}

interface PaginationResult {
  files: DriveFile[];
  nextPageToken?: string;
  hasMore: boolean;
}

interface ImageMetadata {
  width?: number;
  height?: number;
  fileSize: number;
  format: string;
}

export class GoogleDriveService {
  private accessToken: string;
  private tokenExpiryTime: number | null = null;
  private refreshCallback?: () => Promise<string>;

  constructor(accessToken: string, refreshCallback?: () => Promise<string>) {
    this.accessToken = accessToken;
    this.refreshCallback = refreshCallback;
    // Set expiry time for 15 days (Google refresh tokens can last longer)
    this.tokenExpiryTime = Date.now() + (15 * 24 * 3600 * 1000); // 15 days from now
  }

  // Check if token is expired or about to expire (within 5 minutes)
  private isTokenExpired(): boolean {
    if (!this.tokenExpiryTime) return false;
    return Date.now() > (this.tokenExpiryTime - 5 * 60 * 1000); // 5 minutes buffer
  }

  // Refresh access token if needed
  private async ensureValidToken(): Promise<void> {
    if (this.isTokenExpired() && this.refreshCallback) {
      try {
        console.log('Token expired, refreshing...');
        this.accessToken = await this.refreshCallback();
        this.tokenExpiryTime = Date.now() + (15 * 24 * 3600 * 1000); // Reset expiry time to 15 days
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Failed to refresh token:', error);
        throw new Error('Authentication expired. Please sign in again.');
      }
    }
  }

  // Handle API errors and retry with token refresh if needed
  private async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    await this.ensureValidToken();

    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    let response = await fetch(url, { ...options, headers });

    // If we get a 401, try to refresh token and retry once
    if (response.status === 401 && this.refreshCallback) {
      console.log('Received 401, attempting token refresh...');
      try {
        this.accessToken = await this.refreshCallback();
        this.tokenExpiryTime = Date.now() + (15 * 24 * 3600 * 1000); // 15 days expiry
        
        // Retry the request with new token
        const newHeaders = { ...headers, 'Authorization': `Bearer ${this.accessToken}` };
        response = await fetch(url, { ...options, headers: newHeaders });
        
        if (response.status === 401) {
          throw new Error('Authentication failed after token refresh');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        throw new Error('Authentication expired. Please sign in again.');
      }
    }

    return response;
  }

  // Fetch images from Google Drive with pagination
  async fetchImages(folderId?: string, pageSize: number = 5, pageToken?: string): Promise<PaginationResult> {
    try {
      const query = folderId 
        ? `'${folderId}' in parents and (mimeType contains 'image/' or mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/gif' or mimeType='image/webp')`
        : "mimeType contains 'image/' or mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/gif' or mimeType='image/webp'";

      const url = new URL('https://www.googleapis.com/drive/v3/files');
      url.searchParams.append('q', query);
      url.searchParams.append('pageSize', pageSize.toString());
      url.searchParams.append('fields', 'nextPageToken,files(id,name,mimeType,size,thumbnailLink,webViewLink,modifiedTime,parents,hasThumbnail,thumbnailVersion)');
      url.searchParams.append('orderBy', 'modifiedTime desc');
      
      if (pageToken) {
        url.searchParams.append('pageToken', pageToken);
      }

      const response = await this.makeAuthenticatedRequest(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        files: data.files || [],
        nextPageToken: data.nextPageToken,
        hasMore: !!data.nextPageToken
      };
    } catch (error) {
      console.error('Error fetching images from Google Drive:', error);
      throw error;
    }
  }

  // Get image blob data for editing
  async getImageBlob(fileId: string): Promise<Blob> {
    try {
      const response = await this.makeAuthenticatedRequest(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`);

      if (!response.ok) {
        throw new Error(`Failed to fetch image data: ${response.status} ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error fetching image blob:', error);
      throw error;
    }
  }

  // Get image metadata
  async getImageMetadata(fileId: string): Promise<ImageMetadata> {
    try {
      const response = await this.makeAuthenticatedRequest(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=size`);

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Get image blob to determine format and dimensions
      const blob = await this.getImageBlob(fileId);
      const imageUrl = URL.createObjectURL(blob);
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(imageUrl);
          resolve({
            width: img.width,
            height: img.height,
            fileSize: parseInt(data.size) || blob.size,
            format: blob.type || 'unknown',
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          reject(new Error('Failed to load image for metadata'));
        };
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Error getting image metadata:', error);
      throw error;
    }
  }

  // Save optimized image back to Google Drive
  async saveOptimizedImage(
    originalFileId: string,
    optimizedBlob: Blob,
    newFileName?: string,
    folderId?: string
  ): Promise<DriveFile> {
    try {
      // Get original file metadata
      const originalFile = await this.getFileMetadata(originalFileId);
      const fileName = newFileName || `optimized_${originalFile.name}`;

      // Create multipart form data
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const metadata = {
        name: fileName,
        parents: folderId ? [folderId] : originalFile.parents,
      };

      const multipartRequestBody = 
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + optimizedBlob.type + '\r\n\r\n';

      const blobArrayBuffer = await optimizedBlob.arrayBuffer();
      const uint8Array = new Uint8Array(multipartRequestBody.length + blobArrayBuffer.byteLength + close_delim.length);
      
      // Encode metadata part
      const encoder = new TextEncoder();
      const metadataBytes = encoder.encode(multipartRequestBody);
      uint8Array.set(metadataBytes, 0);
      
      // Add file data
      uint8Array.set(new Uint8Array(blobArrayBuffer), metadataBytes.length);
      
      // Add closing delimiter
      const closeDelimBytes = encoder.encode(close_delim);
      uint8Array.set(closeDelimBytes, metadataBytes.length + blobArrayBuffer.byteLength);

      const response = await this.makeAuthenticatedRequest('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/related; boundary="${boundary}"`,
        },
        body: uint8Array,
      });

      if (!response.ok) {
        throw new Error(`Failed to save image: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving optimized image:', error);
      throw error;
    }
  }

  // Update existing file with optimized version
  async updateImageFile(fileId: string, optimizedBlob: Blob): Promise<DriveFile> {
    try {
      const response = await this.makeAuthenticatedRequest(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          'Content-Type': optimizedBlob.type,
        },
        body: optimizedBlob,
      });

      if (!response.ok) {
        throw new Error(`Failed to update image: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating image file:', error);
      throw error;
    }
  }

  // Get file metadata
  private async getFileMetadata(fileId: string): Promise<DriveFile> {
    try {
      const response = await this.makeAuthenticatedRequest(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,parents`);

      if (!response.ok) {
        throw new Error(`Failed to fetch file metadata: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }

  // Get folders for organization
  async getFolders(): Promise<DriveFile[]> {
    try {
      const url = new URL('https://www.googleapis.com/drive/v3/files');
      url.searchParams.append('q', "mimeType='application/vnd.google-apps.folder'");
      url.searchParams.append('fields', 'files(id,name,modifiedTime)');
      url.searchParams.append('orderBy', 'name');

      const response = await this.makeAuthenticatedRequest(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch folders: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  }

  // Upload a new file to Google Drive
  async uploadFile(blob: Blob, fileName: string, folderId?: string): Promise<DriveFile> {
    try {
      // Create multipart form data
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const metadata = {
        name: fileName,
        parents: folderId ? [folderId] : undefined,
      };

      const multipartRequestBody = 
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + blob.type + '\r\n\r\n';

      const blobArrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(multipartRequestBody.length + blobArrayBuffer.byteLength + close_delim.length);
      
      // Encode metadata part
      const encoder = new TextEncoder();
      const metadataBytes = encoder.encode(multipartRequestBody);
      uint8Array.set(metadataBytes, 0);
      
      // Add file data
      uint8Array.set(new Uint8Array(blobArrayBuffer), metadataBytes.length);
      
      // Add closing delimiter
      const closeDelimBytes = encoder.encode(close_delim);
      uint8Array.set(closeDelimBytes, metadataBytes.length + blobArrayBuffer.byteLength);

      const response = await this.makeAuthenticatedRequest('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/related; boundary="${boundary}"`,
        },
        body: uint8Array,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Create a new folder
  async createFolder(name: string, parentId?: string): Promise<DriveFile> {
    try {
      const metadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : undefined,
      };

      const response = await this.makeAuthenticatedRequest('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error(`Failed to create folder: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  // Delete a file from Google Drive
  async deleteFile(fileId: string): Promise<void> {
    try {
      const response = await this.makeAuthenticatedRequest(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}

export type { DriveFile, ImageMetadata, PaginationResult };
