import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GoogleDriveService } from '../../services/googleDriveService';
import type { DriveFile, PaginationResult } from '../../services/googleDriveService';

// Types for the slice
export interface GoogleDriveState {
  files: DriveFile[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  nextPageToken?: string;
  hasMore: boolean;
  totalFiles: number;
  isConnected: boolean;
  lastFetchTime: number | null;
  currentFolderId?: string;
  imageUrls: Record<string, string>; // Cache image URLs to prevent reloading
}

// Async thunk for fetching initial files
export const fetchGoogleDriveFiles = createAsyncThunk<
  PaginationResult,
  {
    accessToken: string;
    refreshCallback: () => Promise<string>;
    folderId?: string;
    pageSize?: number;
    forceRefresh?: boolean;
  },
  { rejectValue: string }
>(
  'googleDrive/fetchFiles',
  async ({ accessToken, refreshCallback, folderId, pageSize = 10, forceRefresh = false }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { googleDrive: GoogleDriveState };
      const currentState = state.googleDrive;
      
      // Check if we need to fetch fresh data
      const timeSinceLastFetch = currentState.lastFetchTime ? Date.now() - currentState.lastFetchTime : Infinity;
      const shouldRefresh = forceRefresh || timeSinceLastFetch > 5 * 60 * 1000; // 5 minutes cache
      
      if (!shouldRefresh && currentState.files.length > 0 && currentState.currentFolderId === folderId) {
        // Return cached data
        return {
          files: [],
          nextPageToken: currentState.nextPageToken,
          hasMore: currentState.hasMore,
        };
      }

      const service = new GoogleDriveService(accessToken, refreshCallback);
      const result = await service.fetchImages(folderId, pageSize);
      
      return result;
    } catch (error) {
      console.error('Error fetching Google Drive files:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch files');
    }
  }
);

// Async thunk for loading more files
export const loadMoreGoogleDriveFiles = createAsyncThunk<
  PaginationResult,
  {
    accessToken: string;
    refreshCallback: () => Promise<string>;
    folderId?: string;
    pageSize?: number;
  },
  { rejectValue: string }
>(
  'googleDrive/loadMoreFiles',
  async ({ accessToken, refreshCallback, folderId, pageSize = 10 }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { googleDrive: GoogleDriveState };
      const { nextPageToken } = state.googleDrive;
      
      if (!nextPageToken) {
        return rejectWithValue('No more files to load');
      }

      const service = new GoogleDriveService(accessToken, refreshCallback);
      const result = await service.fetchImages(folderId, pageSize, nextPageToken);
      
      return result;
    } catch (error) {
      console.error('Error loading more Google Drive files:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load more files');
    }
  }
);

// Async thunk for refreshing files
export const refreshGoogleDriveFiles = createAsyncThunk<
  PaginationResult,
  {
    accessToken: string;
    refreshCallback: () => Promise<string>;
    folderId?: string;
    pageSize?: number;
  },
  { rejectValue: string }
>(
  'googleDrive/refreshFiles',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      // Force refresh by calling fetch with forceRefresh flag
      const result = await dispatch(fetchGoogleDriveFiles({ ...params, forceRefresh: true }));
      
      if (fetchGoogleDriveFiles.fulfilled.match(result)) {
        return result.payload;
      } else {
        return rejectWithValue('Failed to refresh files');
      }
    } catch (error) {
      console.error('Error refreshing Google Drive files:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to refresh files');
    }
  }
);

// Async thunk for deleting a file
export const deleteGoogleDriveFile = createAsyncThunk<
  string, // Returns the fileId that was deleted
  {
    accessToken: string;
    refreshCallback: () => Promise<string>;
    fileId: string;
  },
  { rejectValue: string }
>(
  'googleDrive/deleteFile',
  async ({ accessToken, refreshCallback, fileId }, { rejectWithValue }) => {
    try {
      const service = new GoogleDriveService(accessToken, refreshCallback);
      await service.deleteFile(fileId);
      return fileId;
    } catch (error) {
      console.error('Error deleting Google Drive file:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete file');
    }
  }
);

const initialState: GoogleDriveState = {
  files: [],
  loading: false,
  loadingMore: false,
  error: null,
  nextPageToken: undefined,
  hasMore: false,
  totalFiles: 0,
  isConnected: false,
  lastFetchTime: null,
  currentFolderId: undefined,
  imageUrls: {}, // Initialize empty cache
};

const googleDriveSlice = createSlice({
  name: 'googleDrive',
  initialState,
  reducers: {
    // Clear all files
    clearFiles: (state) => {
      state.files = [];
      state.nextPageToken = undefined;
      state.hasMore = false;
      state.totalFiles = 0;
      state.error = null;
      state.lastFetchTime = null;
      state.imageUrls = {}; // Clear cached URLs
    },
    
    // Set connection status
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (!action.payload) {
        // Clear files when disconnected
        state.files = [];
        state.nextPageToken = undefined;
        state.hasMore = false;
        state.totalFiles = 0;
        state.lastFetchTime = null;
        state.imageUrls = {}; // Clear cached URLs
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set image URLs (for caching)
    setImageUrls: (state, action: PayloadAction<Record<string, string>>) => {
      state.imageUrls = { ...state.imageUrls, ...action.payload };
    },
    
    // Clear a specific image URL
    clearImageUrl: (state, action: PayloadAction<string>) => {
      delete state.imageUrls[action.payload];
    },
    
    // Update file in store (useful for optimization updates)
    updateFile: (state, action: PayloadAction<{ fileId: string; updates: Partial<DriveFile> }>) => {
      const { fileId, updates } = action.payload;
      const fileIndex = state.files.findIndex(file => file.id === fileId);
      if (fileIndex !== -1) {
        state.files[fileIndex] = { ...state.files[fileIndex], ...updates };
      }
    },
    
    // Remove file from store
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
      state.totalFiles = Math.max(0, state.totalFiles - 1);
    },
    
    // Add new file to store
    addFile: (state, action: PayloadAction<DriveFile>) => {
      state.files.unshift(action.payload); // Add to beginning
      state.totalFiles += 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch files
    builder
      .addCase(fetchGoogleDriveFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoogleDriveFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lastFetchTime = Date.now();
        
        // Only update files if we got new data
        if (action.payload.files.length > 0) {
          state.files = action.payload.files;
          state.totalFiles = action.payload.files.length;
        }
        
        state.nextPageToken = action.payload.nextPageToken;
        state.hasMore = action.payload.hasMore;
        state.isConnected = true;
      })
      .addCase(fetchGoogleDriveFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch files';
        state.isConnected = false;
      })
      
      // Load more files
      .addCase(loadMoreGoogleDriveFiles.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreGoogleDriveFiles.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.error = null;
        
        // Append new files to existing ones
        state.files = [...state.files, ...action.payload.files];
        state.totalFiles = state.files.length;
        state.nextPageToken = action.payload.nextPageToken;
        state.hasMore = action.payload.hasMore;
        state.lastFetchTime = Date.now();
      })
      .addCase(loadMoreGoogleDriveFiles.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload || 'Failed to load more files';
      })
      
      // Refresh files
      .addCase(refreshGoogleDriveFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshGoogleDriveFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.files = action.payload.files;
        state.totalFiles = action.payload.files.length;
        state.nextPageToken = action.payload.nextPageToken;
        state.hasMore = action.payload.hasMore;
        state.lastFetchTime = Date.now();
      })
      .addCase(refreshGoogleDriveFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to refresh files';
      })
      
      // Delete file
      .addCase(deleteGoogleDriveFile.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteGoogleDriveFile.fulfilled, (state, action) => {
        // Remove the file from the store and clear its cached URL
        const fileId = action.payload;
        state.files = state.files.filter(file => file.id !== fileId);
        state.totalFiles = Math.max(0, state.totalFiles - 1);
        delete state.imageUrls[fileId];
      })
      .addCase(deleteGoogleDriveFile.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete file';
      });
  },
});

export const {
  clearFiles,
  setConnectionStatus,
  clearError,
  updateFile,
  removeFile,
  addFile,
  setImageUrls,
  clearImageUrl,
} = googleDriveSlice.actions;

export default googleDriveSlice.reducer;