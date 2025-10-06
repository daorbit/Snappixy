import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Fade,
  Zoom,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Download,
  CloudUpload,
  PhotoLibrary,
  Compress,
  Delete,
} from "@mui/icons-material";
import {
  GoogleDriveService,
  type DriveFile,
} from "../services/googleDriveService.ts";
import {
  ImageOptimizationService,
  type OptimizationOptions,
  type OptimizationResult,
} from "../services/imageOptimizationService.ts";
import { useAuth } from "../contexts/useAuth.ts";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import {
  fetchGoogleDriveFiles,
  loadMoreGoogleDriveFiles,
  refreshGoogleDriveFiles,
  deleteGoogleDriveFile,
  setConnectionStatus,
  clearError,
  setImageUrls,
} from "../store/slices/googleDriveSlice.ts";
import ImageOptimizationDialog from "./ImageOptimizationDialog.tsx";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog.tsx";

interface ImageGalleryProps {
  folderId?: string;
}

interface OptimizationDialogState {
  open: boolean;
  file: DriveFile | null;
  imageBlob: Blob | null;
  optimizationResult: OptimizationResult | null;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ folderId }) => {
  const { user, refreshGoogleDriveToken } = useAuth();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  
  // Redux state - now includes cached imageUrls
  const {
    files: images,
    loading,
    loadingMore,
    error,
    nextPageToken,
    hasMore,
    isConnected,
    imageUrls, // This is now cached in Redux to prevent reloading on route changes
  } = useAppSelector((state) => state.googleDrive);

  // Local state for UI and optimization
  const [initialLoad, setInitialLoad] = useState(true);
  const [driveService, setDriveService] = useState<GoogleDriveService | null>(
    null
  );
  const [optimizationService] = useState(() => new ImageOptimizationService());
  const processedImagesRef = useRef<Set<string>>(new Set());

  const [optimizationDialog, setOptimizationDialog] =
    useState<OptimizationDialogState>({
      open: false,
      file: null,
      imageBlob: null,
      optimizationResult: null,
    });

  const [optimizationOptions, setOptimizationOptions] =
    useState<OptimizationOptions>({
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      format: "jpeg",
      maintainAspectRatio: true,
    });

  const [optimizing, setOptimizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);

  const fetchImageUrl = useCallback(
    async (file: DriveFile): Promise<string> => {
      console.log("Fetching image URL for:", file.name, "ID:", file.id);
      console.log(
        "Thumbnail link available:",
        !!file.thumbnailLink,
        file.thumbnailLink
      );

      try {
        console.log("Trying authenticated media fetch...");
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${user!.accessToken}`,
            },
          }
        );

        console.log(
          "Media fetch response:",
          response.status,
          response.statusText
        );
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          console.log("Created blob URL:", blobUrl.substring(0, 50) + "...");
          return blobUrl;
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }

      if (file.thumbnailLink) {
        console.log("Trying thumbnailLink with auth...");
        try {
          const response = await fetch(file.thumbnailLink, {
            headers: {
              Authorization: `Bearer ${user!.accessToken}`,
            },
          });

          console.log(
            "ThumbnailLink fetch response:",
            response.status,
            response.statusText
          );
          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            console.log(
              "Created thumbnail blob URL:",
              blobUrl.substring(0, 50) + "..."
            );
            return blobUrl;
          }
        } catch (error) {
          console.error("Error fetching thumbnailLink:", error);
        }

        // Return thumbnailLink as-is (might work for some cases)
        console.log("Returning thumbnailLink as-is:", file.thumbnailLink);
        return file.thumbnailLink;
      }

      // Final fallback - use a data URL for a simple placeholder
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
    },
    [user]
  );

  const loadImageUrls = useCallback(
    async (files: DriveFile[]) => {
      const BATCH_SIZE = 3; // Load 3 images at a time
      
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        
        // Process batch concurrently
        const batchPromises = batch.map(async (file) => {
          try {
            const url = await fetchImageUrl(file);
            // Store in Redux to persist across route changes - THIS IS THE KEY FIX!
            dispatch(setImageUrls({ [file.id]: url }));
            return { success: true, fileId: file.id, url };
          } catch (error) {
            console.error(`Failed to load URL for ${file.name}:`, error);
            const errorUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==";
            dispatch(setImageUrls({ [file.id]: errorUrl }));
            return { success: false, fileId: file.id, error };
          }
        });
        
        await Promise.all(batchPromises);
        
        // Small delay between batches to prevent overwhelming the API
        if (i + BATCH_SIZE < files.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    },
    [fetchImageUrl, dispatch]
  );

  const loadImages = useCallback(
    async () => {
      if (!user?.accessToken) {
        console.error('No access token available');
        return;
      }

      try {
        const result = await dispatch(
          fetchGoogleDriveFiles({
            accessToken: user.accessToken,
            refreshCallback: refreshGoogleDriveToken,
            folderId,
            pageSize: 5,
          })
        );

        if (fetchGoogleDriveFiles.fulfilled.match(result)) {
          // Only load URLs for new files if we got fresh data
          if (result.payload.files.length > 0) {
            // Mark these files as being processed to avoid duplicate processing
            result.payload.files.forEach(file => processedImagesRef.current.add(file.id));
            await loadImageUrls(result.payload.files);
          }
        }
      } catch (err) {
        console.error('Error loading images:', err);
      }
    },
    [dispatch, user?.accessToken, refreshGoogleDriveToken, folderId, loadImageUrls]
  );

  useEffect(() => {
    setInitialLoad(false);
    if (user?.accessToken) {
      dispatch(setConnectionStatus(true));
      const service = new GoogleDriveService(user.accessToken, refreshGoogleDriveToken);
      setDriveService(service);
      loadImages();
    } else {
      dispatch(setConnectionStatus(false));
      setDriveService(null);
      dispatch(clearError());
    }
  }, [user?.accessToken, folderId, loadImages, dispatch, refreshGoogleDriveToken]);

  // Effect to load image URLs when Redux files are available but URLs are missing
  useEffect(() => {
    const loadMissingImageUrls = async () => {
      if (images.length > 0 && user?.accessToken) {
        // Filter out images that are already processed or have URLs
        const missingUrls = images.filter(image => 
          !imageUrls[image.id] && !processedImagesRef.current.has(image.id)
        );
        
        if (missingUrls.length > 0) {
          console.log(`Loading URLs for ${missingUrls.length} cached images`);
          
          // Mark as processing
          missingUrls.forEach(image => processedImagesRef.current.add(image.id));
          
          await loadImageUrls(missingUrls);
        }
      }
    };

    loadMissingImageUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, user?.accessToken]); // Intentionally excluding imageUrls and loadImageUrls to prevent infinite loop

  // Reset processed images when files list changes completely (e.g., folder change)
  useEffect(() => {
    processedImagesRef.current.clear();
    dispatch(setImageUrls({}));
  }, [folderId, dispatch]);

  const openOptimizationDialog = async (file: DriveFile) => {
    if (!driveService) return;

    try {
      setOptimizing(true);
      const imageBlob = await driveService.getImageBlob(file.id);
      setOptimizationDialog({
        open: true,
        file,
        imageBlob,
        optimizationResult: null,
      });
    } catch (err) {
      console.error('Failed to load image:', err);
    } finally {
      setOptimizing(false);
    }
  };

  const closeOptimizationDialog = () => {
    setOptimizationDialog({
      open: false,
      file: null,
      imageBlob: null,
      optimizationResult: null,
    });
  };

  const optimizeImage = async () => {
    if (!optimizationDialog.imageBlob) return;

    try {
      setOptimizing(true);
      const result = await optimizationService.optimizeImage(
        optimizationDialog.imageBlob,
        optimizationOptions
      );
      setOptimizationDialog((prev) => ({
        ...prev,
        optimizationResult: result,
      }));
    } catch (err) {
      console.error('Failed to optimize image:', err);
    } finally {
      setOptimizing(false);
    }
  };

  const downloadOptimizedImage = () => {
    if (!optimizationDialog.optimizationResult || !optimizationDialog.file)
      return;

    const url = URL.createObjectURL(optimizationDialog.optimizationResult.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `optimized_${optimizationDialog.file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const saveToGoogleDrive = async (replaceOriginal: boolean = false) => {
    if (
      !driveService ||
      !optimizationDialog.optimizationResult ||
      !optimizationDialog.file ||
      !user?.accessToken
    )
      return;

    try {
      setSaving(true);
      if (replaceOriginal) {
        await driveService.updateImageFile(
          optimizationDialog.file.id,
          optimizationDialog.optimizationResult.blob
        );
      } else {
        await driveService.saveOptimizedImage(
          optimizationDialog.file.id,
          optimizationDialog.optimizationResult.blob,
          `optimized_${optimizationDialog.file.name}`,
          folderId
        );
      }

      // Refresh the gallery using Redux
      const result = await dispatch(
        refreshGoogleDriveFiles({
          accessToken: user.accessToken,
          refreshCallback: refreshGoogleDriveToken,
          folderId,
          pageSize: 5,
        })
      );

      if (refreshGoogleDriveFiles.fulfilled.match(result)) {
        // Clear previous processing state since this is a refresh
        processedImagesRef.current.clear();
        dispatch(setImageUrls({}));
        
        // Mark and load new files
        result.payload.files.forEach(file => processedImagesRef.current.add(file.id));
        await loadImageUrls(result.payload.files);
      }

      closeOptimizationDialog();
      dispatch(clearError());
    } catch (err) {
      console.error('Error saving to Google Drive:', err);
    } finally {
      setSaving(false);
    }
  };

  const downloadOriginalImage = async (file: DriveFile) => {
    if (!driveService) return;

    try {
      const blob = await driveService.getImageBlob(file.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const openDeleteDialog = (file: DriveFile) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (!deletingFileId) {
      setFileToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const deleteImage = async () => {
    if (!fileToDelete || !user?.accessToken) return;

    try {
      setDeletingFileId(fileToDelete.id);
      await dispatch(
        deleteGoogleDriveFile({
          accessToken: user.accessToken,
          refreshCallback: refreshGoogleDriveToken,
          fileId: fileToDelete.id,
        })
      );
      setFileToDelete(null);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Failed to delete image:', err);
    } finally {
      setDeletingFileId(null);
    }
  };
  const loadMoreImages = async () => {
    if (!nextPageToken || loadingMore || !user?.accessToken) return;

    try {
      const result = await dispatch(
        loadMoreGoogleDriveFiles({
          accessToken: user.accessToken,
          refreshCallback: refreshGoogleDriveToken,
          folderId,
          pageSize: 5,
        })
      );

      if (loadMoreGoogleDriveFiles.fulfilled.match(result)) {
        // Mark these files as being processed to avoid duplicate processing
        result.payload.files.forEach(file => processedImagesRef.current.add(file.id));
        await loadImageUrls(result.payload.files);
      }
    } catch (err) {
      console.error('Error loading more images:', err);
    }
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Show initial loading while checking authentication
  if (initialLoad) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          textAlign: "center",
          p: 4,
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" gutterBottom>
          Checking Google Drive connection...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we verify your Google Drive access.
        </Typography>
      </Box>
    );
  }

  // Show connection required message if not connected to Google Drive
  if (!isConnected && !loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
          p: 4,
        }}
      >
        <CloudUpload
          sx={{
            fontSize: 80,
            color: "warning.main",
            mb: 2,
            opacity: 0.7,
          }}
        />
        <Typography variant="h5" gutterBottom color="text.primary">
          Google Drive Not Connected
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: "500px" }}
        >
          To access and optimize your Google Drive images, you need to connect
          your Google account first.
        </Typography>

        <Alert severity="warning" sx={{ mb: 3, maxWidth: "600px" }}>
          <Typography variant="body2">
            <strong>To connect Google Drive:</strong>
            <br />• Go to your Profile Settings
            <br />• Enable Google Drive permissions
            <br />• Grant access to view and manage your files
            <br />• Return here to see your images
          </Typography>
        </Alert>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            href="/profile"
            startIcon={<CloudUpload />}
          >
            Connect Google Drive
          </Button>
          <Button
            variant="outlined"
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<PhotoLibrary />}
          >
            Open Google Drive
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
          Your Google Drive images will appear here once connected
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          textAlign: "center",
          p: 4,
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" gutterBottom>
          Connecting to Google Drive...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Loading your images from Google Drive. This may take a moment.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
          p: 4,
        }}
      >
        <Alert
          severity="error"
          sx={{ mb: 3, maxWidth: "600px" }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => loadImages()}
              disabled={loading}
            >
              {loading ? "Retrying..." : "Retry"}
            </Button>
          }
        >
          <Typography variant="h6" gutterBottom>
            Failed to Load Google Drive Images
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This might be due to:
        </Typography>
        <Box sx={{ textAlign: "left", maxWidth: "400px" }}>
          <Typography variant="body2" color="text.secondary" component="div">
            • Network connectivity issues
            <br />• Google Drive permissions not granted
            <br />• Google Drive API quota exceeded
            <br />• Invalid or expired authentication token
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 3,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={() => loadImages()}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <PhotoLibrary />
            }
          >
            {loading ? "Retrying..." : "Try Again"}
          </Button>
          <Button
            variant="outlined"
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<CloudUpload />}
          >
            Open Google Drive
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 3 }}
      >
        <PhotoLibrary sx={{ mr: 2 }} />
        Google Drive Images
        {!loading && isConnected && (
          <Chip
            label={
              images.length === 0
                ? "No images"
                : `${images.length} image${images.length !== 1 ? "s" : ""}`
            }
            color={images.length === 0 ? "default" : "primary"}
            size="small"
            sx={{ ml: 2 }}
          />
        )}
        {isConnected && (
          <Chip
            label="Connected"
            color="success"
            size="small"
            sx={{ ml: 1 }}
            icon={<CloudUpload />}
          />
        )}
        {images.length > 0 && Object.keys(imageUrls).length < images.length && (
          <Chip
            label={`Loading: ${Object.keys(imageUrls).length}/${images.length}`}
            color="info"
            size="small"
            sx={{ ml: 1 }}
            icon={<CircularProgress size={16} />}
          />
        )}
      </Typography>

      {images.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
            p: 4,
          }}
        >
          <PhotoLibrary
            sx={{
              fontSize: 80,
              color: "text.secondary",
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography variant="h5" gutterBottom color="text.primary">
            No Images Found in Google Drive
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: "500px" }}
          >
            It looks like you don't have any images in your Google Drive yet, or
            we couldn't access them.
          </Typography>

          <Alert severity="info" sx={{ mb: 3, maxWidth: "600px" }}>
            <Typography variant="body2">
              <strong>To get started:</strong>
              <br />• Upload images to your Google Drive
              <br />• Make sure you've granted permission to access your Google
              Drive
              <br />• Refresh this page if you just uploaded images
            </Typography>
          </Alert>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={() => loadImages()}
              startIcon={<PhotoLibrary />}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Gallery"}
            </Button>
            <Button
              variant="outlined"
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<CloudUpload />}
            >
              Open Google Drive
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
            Supported formats: JPEG, PNG, WebP, GIF, BMP
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {images.map((image) => {
            const imageUrl = imageUrls[image.id];
            const isLoading = !imageUrl;
            
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isLoading ? "grey.100" : "transparent",
                      position: "relative",
                    }}
                  >
                    {isLoading ? (
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '200px',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Advanced skeleton with shimmer */}
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height="100%"
                          animation="wave"
                          sx={{
                            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                            '&::after': {
                              background: theme.palette.mode === 'dark' 
                                ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
                                : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                              animationDuration: '1.5s',
                            }
                          }}
                        />
                        
                        {/* Elegant overlay with floating effect */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: theme.palette.mode === 'dark' 
                              ? 'rgba(0,0,0,0.2)' 
                              : 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(2px)',
                          }}
                        >
                          <Zoom in={isLoading}>
                            <Box
                              sx={{
                                animation: 'float 3s ease-in-out infinite',
                                '@keyframes float': {
                                  '0%': { transform: 'translateY(0px) scale(1)', opacity: 0.6 },
                                  '50%': { transform: 'translateY(-10px) scale(1.1)', opacity: 1 },
                                  '100%': { transform: 'translateY(0px) scale(1)', opacity: 0.6 },
                                },
                              }}
                            >
                              <PhotoLibrary 
                                sx={{ 
                                  fontSize: 36,
                                  color: theme.palette.primary.main,
                                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                                }}
                              />
                            </Box>
                          </Zoom>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              mt: 1.5,
                              color: theme.palette.primary.main,
                              fontWeight: 'bold',
                              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                              animation: 'pulse 2s infinite',
                              '@keyframes pulse': {
                                '0%': { opacity: 0.4 },
                                '50%': { opacity: 1 },
                                '100%': { opacity: 0.4 },
                              },
                            }}
                          >
                            Optimizing...
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Fade in={!isLoading} timeout={600}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={imageUrl}
                          alt={image.name}
                        sx={{ 
                          objectFit: "cover",
                          transition: "opacity 0.3s ease-in-out",
                        }}
                        onLoad={() =>
                          console.log("Image loaded successfully:", image.name)
                        }
                        onError={(e) => {
                          console.error(
                            "Image failed to load:",
                            image.name,
                            "src:",
                            e.currentTarget.src
                          );
                          // Update with error placeholder
                          dispatch(setImageUrls({ 
 
                            [image.id]: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==" 
                          }));
                        }}
                      />
                      </Fade>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      noWrap
                      title={image.name}
                    >
                      {image.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {image.size
                        ? formatFileSize(parseInt(image.size))
                        : "Unknown size"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Modified:{" "}
                      {new Date(image.modifiedTime).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <Box>
                      <Tooltip title="Optimize Image">
                        <IconButton
                          color="primary"
                          onClick={() => openOptimizationDialog(image)}
                          disabled={optimizing || isLoading}
                        >
                          <Compress />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Original">
                        <IconButton
                          color="secondary"
                          onClick={() => downloadOriginalImage(image)}
                          disabled={isLoading}
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Image">
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(image)}
                          disabled={deletingFileId === image.id || isLoading}
                        >
                          {deletingFileId === image.id ? <CircularProgress size={20} /> : <Delete />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Chip
                      label={image.mimeType.split("/")[1].toUpperCase()}
                      size="small"
                      variant="outlined"
                    />
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      {hasMore && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Button
            onClick={loadMoreImages}
            disabled={loadingMore}
            variant="contained"
            size="large"
            sx={{
              minWidth: "200px",
              borderRadius: "28px",
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            {loadingMore ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading...
              </>
            ) : (
              "Load 5 More Images"
            )}
          </Button>
        </Box>
      )}
      {/* Optimization Dialog */}
      <ImageOptimizationDialog
        open={optimizationDialog.open}
        file={optimizationDialog.file}
        imageBlob={optimizationDialog.imageBlob}
        optimizationResult={optimizationDialog.optimizationResult}
        optimizationOptions={optimizationOptions}
        optimizing={optimizing}
        saving={saving}
        onClose={closeOptimizationDialog}
        onOptimize={optimizeImage}
        onDownload={downloadOptimizedImage}
        onSaveToDrive={saveToGoogleDrive}
        onOptionsChange={setOptimizationOptions}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        file={fileToDelete}
        deleting={!!deletingFileId}
        onClose={closeDeleteDialog}
        onConfirm={deleteImage}
      />
    </Box>
  );
};

export default ImageGallery;
