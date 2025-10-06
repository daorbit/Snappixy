import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchGoogleDriveFiles,
  loadMoreGoogleDriveFiles,
  refreshGoogleDriveFiles,
  clearFiles,
  setConnectionStatus,
  clearError,
  updateFile,
  removeFile,
  addFile,
} from '../store/slices/googleDriveSlice';
import { useAuth } from '../contexts/useAuth';
import type { DriveFile } from '../services/googleDriveService';

export const useGoogleDrive = () => {
  const dispatch = useAppDispatch();
  const { user, refreshGoogleDriveToken } = useAuth();
  
  const googleDriveState = useAppSelector((state) => state.googleDrive);

  const fetchFiles = useCallback(
    async (folderId?: string, pageSize = 10, forceRefresh = false) => {
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }

      const result = await dispatch(
        fetchGoogleDriveFiles({
          accessToken: user.accessToken,
          refreshCallback: refreshGoogleDriveToken,
          folderId,
          pageSize,
          forceRefresh,
        })
      );

      if (fetchGoogleDriveFiles.rejected.match(result)) {
        throw new Error(result.payload || 'Failed to fetch files');
      }

      return result.payload;
    },
    [dispatch, user?.accessToken, refreshGoogleDriveToken]
  );

  const loadMoreFiles = useCallback(
    async (folderId?: string, pageSize = 10) => {
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }

      const result = await dispatch(
        loadMoreGoogleDriveFiles({
          accessToken: user.accessToken,
          refreshCallback: refreshGoogleDriveToken,
          folderId,
          pageSize,
        })
      );

      if (loadMoreGoogleDriveFiles.rejected.match(result)) {
        throw new Error(result.payload || 'Failed to load more files');
      }

      return result.payload;
    },
    [dispatch, user?.accessToken, refreshGoogleDriveToken]
  );

  const refreshFiles = useCallback(
    async (folderId?: string, pageSize = 10) => {
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }

      const result = await dispatch(
        refreshGoogleDriveFiles({
          accessToken: user.accessToken,
          refreshCallback: refreshGoogleDriveToken,
          folderId,
          pageSize,
        })
      );

      if (refreshGoogleDriveFiles.rejected.match(result)) {
        throw new Error(result.payload || 'Failed to refresh files');
      }

      return result.payload;
    },
    [dispatch, user?.accessToken, refreshGoogleDriveToken]
  );

  const clearAllFiles = useCallback(() => {
    dispatch(clearFiles());
  }, [dispatch]);

  const setConnected = useCallback((connected: boolean) => {
    dispatch(setConnectionStatus(connected));
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateFileInStore = useCallback((fileId: string, updates: Partial<DriveFile>) => {
    dispatch(updateFile({ fileId, updates }));
  }, [dispatch]);

  const removeFileFromStore = useCallback((fileId: string) => {
    dispatch(removeFile(fileId));
  }, [dispatch]);

  const addFileToStore = useCallback((file: DriveFile) => {
    dispatch(addFile(file));
  }, [dispatch]);

  return {
    // State
    ...googleDriveState,
    
    // Actions
    fetchFiles,
    loadMoreFiles,
    refreshFiles,
    clearAllFiles,
    setConnected,
    clearErrorState,
    updateFileInStore,
    removeFileFromStore,
    addFileToStore,
    
    // Computed
    isAuthenticated: !!user?.accessToken,
    totalFiles: googleDriveState.files.length,
  };
};

export default useGoogleDrive;