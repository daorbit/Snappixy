import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleDriveService,
  type DriveFile,
} from "../services/googleDriveService";
import { useAuth } from "../contexts/useAuth";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchGoogleDriveFiles,
  setConnectionStatus,
  clearError,
  setImageUrls,
} from "../store/slices/googleDriveSlice";
import {
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Grid,
  Skeleton,
  Fade,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Download,
  Image as ImageIcon,
  Calendar,
  HardDrive,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

const SimpleImageViewer: React.FC = () => {
  const { user, refreshGoogleDriveToken } = useAuth();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Redux state - now includes cached imageUrls that persist across route changes
  const {
    files: images,
    loading,
    error,
    imageUrls, // This is cached in Redux to prevent reloading on route changes
  } = useAppSelector((state) => state.googleDrive);

  // Local state for UI
  const [driveService, setDriveService] = useState<GoogleDriveService | null>(
    null
  );
  // Keep track of images being processed to prevent duplicate URL fetching
  const processedImagesRef = useRef<Set<string>>(new Set());

  const fetchImages = async () => {
    if (!user?.accessToken) {
      console.log("No access token available");
      return;
    }

    try {
      // Initial fetch (replace existing)
      const result = await dispatch(
        fetchGoogleDriveFiles({
          accessToken: user.accessToken,
          refreshCallback: refreshGoogleDriveToken,
          pageSize: 5,
        })
      );

      // Load image URLs for new files only
      if (fetchGoogleDriveFiles.fulfilled.match(result)) {
        const files = result.payload.files;
        if (files.length > 0) {
          // SMART FILTERING: Only process files that:
          // 1. Are not already being processed (processedImagesRef)
          // 2. Don't already have cached URLs (imageUrls from Redux)
          const filesToProcess = files.filter(
            (file: DriveFile) =>
              !processedImagesRef.current.has(file.id) && !imageUrls[file.id]
          );

          if (filesToProcess.length > 0) {
            console.log(
              `Processing ${filesToProcess.length} new images out of ${files.length} total`
            );
            // Mark as being processed to prevent duplicate processing
            filesToProcess.forEach((file: DriveFile) =>
              processedImagesRef.current.add(file.id)
            );
            await loadImageUrls(filesToProcess);
          } else {
            console.log(
              `All ${files.length} images already have cached URLs or are being processed`
            );
          }
        }
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const fetchImageUrl = useCallback(
    async (file: DriveFile): Promise<string> => {
      console.log("Fetching image URL for:", file.name, "ID:", file.id);

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

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          console.log("Created blob URL:", blobUrl.substring(0, 50) + "...");
          return blobUrl;
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }

      // If thumbnailLink exists, try to use it with authentication
      if (file.thumbnailLink) {
        console.log("Trying thumbnailLink with auth...");
        try {
          const response = await fetch(file.thumbnailLink, {
            headers: {
              Authorization: `Bearer ${user!.accessToken}`,
            },
          });

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
      console.log("Using data URL fallback");
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
    },
    [user]
  );

  const loadImageUrls = useCallback(
    async (files: DriveFile[]) => {
      const BATCH_SIZE = 3; // Load 3 images at a time to prevent overwhelming

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
            const errorUrl =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU0NDQ0Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==";
            dispatch(setImageUrls({ [file.id]: errorUrl }));
            return { success: false, fileId: file.id, error };
          }
        });

        await Promise.all(batchPromises);

        // Small delay between batches to prevent overwhelming the API
        if (i + BATCH_SIZE < files.length) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }
    },
    [fetchImageUrl, dispatch]
  );

  // Initial load effect
  useEffect(() => {
    if (user?.accessToken) {
      dispatch(setConnectionStatus(true));
      const service = new GoogleDriveService(
        user.accessToken,
        refreshGoogleDriveToken
      );
      setDriveService(service);
      fetchImages(); // Initial fetch
    } else {
      dispatch(setConnectionStatus(false));
      setDriveService(null);
      dispatch(clearError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accessToken, dispatch]);

  // Effect to load image URLs for cached images (when returning from other routes)
  useEffect(() => {
    const loadMissingImageUrls = async () => {
      if (images.length > 0 && user?.accessToken) {
        // Filter out images that already have URLs or are being processed
        const missingUrls = images.filter(
          (image) =>
            !imageUrls[image.id] && !processedImagesRef.current.has(image.id)
        );

        if (missingUrls.length > 0) {
          console.log(
            `Loading URLs for ${missingUrls.length} cached images without URLs`
          );

          // Mark as processing to prevent duplicate calls
          missingUrls.forEach((image) =>
            processedImagesRef.current.add(image.id)
          );

          await loadImageUrls(missingUrls);
        }
      }
    };

    loadMissingImageUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, user?.accessToken]); // Intentionally excluding imageUrls and loadImageUrls to prevent infinite loop

  const downloadImage = async (file: DriveFile) => {
    if (!user?.accessToken || !driveService) return;

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
      console.error("Download failed:", err);
    }
  };

  // Debug logging
  console.log("SimpleImageViewer Debug:", {
    loading,
    error,
    userHasToken: !!user?.accessToken,
    imagesCount: images.length,
    imageUrlsCount: Object.keys(imageUrls).length,
    processedCount: processedImagesRef.current.size,
    hasService: !!driveService,
  });

  if (loading && !error)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          textAlign: "center",
          padding: 3,
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Loading your Google Drive images...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we fetch your images from Google Drive.
        </Typography>
      </Box>
    );

  if (error || (!user?.accessToken && !loading))
    return (
      <Box
        sx={{
          padding: 4,
          textAlign: "center",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
          borderRadius: 4,
          border:
            theme.palette.mode === "dark"
              ? "2px solid #555555"
              : "2px solid #e2e8f0",
          boxShadow: theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0,0,0,0.3)"
            : "0 8px 32px rgba(0,0,0,0.1)",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AlertTriangle
          size={64}
          style={{
            color: theme.palette.error.main,
            marginBottom: 16,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
          }}
        />
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: "bold",
            color: theme.palette.text.primary,
          }}
        >
          Connection Required
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: theme.palette.text.secondary,
            maxWidth: "400px",
            lineHeight: 1.6,
          }}
        >
          {error ||
            "To view your Google Drive images, please connect your account first. This will allow secure access to your files."}
        </Typography>
        {(error?.includes("Google Drive not connected") ||
          !user?.accessToken) && (
          <Button
            component={Link}
            to="/profile"
            variant="contained"
            size="large"
            startIcon={<ArrowRight size={20} />}
            sx={{
              borderRadius: 3,
              fontWeight: "bold",
              textTransform: "none",
              px: 4,
              py: 1.5,
              background: "linear-gradient(45deg, #11998e 30%, #38ef7d 90%)",
              color: "white",
              boxShadow: "0 4px 15px rgba(17, 153, 142, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #0e8a7a 30%, #32d66f 90%)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(17, 153, 142, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Connect Google Drive
          </Button>
        )}
      </Box>
    );

  return (
    <Box
      sx={{
        padding: 1,
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          mb: 2,
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 1,
            background: "linear-gradient(45deg, #11998e 30%, #38ef7d 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Google Drive Images
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {images.length > 3 && (
            <Box
              component={Link}
              to="/google-drive"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #11998e 30%, #38ef7d 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textTransform: "none",
                }}
              >
                Show all images
              </Typography>
              <ArrowRight
                size={16}
                style={{
                  color: "#38ef7d",
                  marginTop: 2,
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {images.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: 3,
            border:
              theme.palette.mode === "dark"
                ? "1px solid #404040"
                : "1px solid #e2e8f0",
          }}
        >
          <ImageIcon
            size={64}
            style={{ color: theme.palette.text.secondary, marginBottom: 16 }}
          />
          <Typography variant="h6" color="text.secondary">
            No images found in your Google Drive.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {images.slice(0, 3).map((image) => {
              const imageUrl = imageUrls[image.id];
              const isLoading = !imageUrl;

              return (
                <Grid size={{ xs: 12, sm: 4 }} key={image.id}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: "all 0.3s ease-in-out",
                      background:
                        theme.palette.mode === "dark"
                          ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      border:
                        theme.palette.mode === "dark"
                          ? "1px solid #404040"
                          : "1px solid #e2e8f0",
                      "&:hover": {
                        boxShadow: isLoading ? 3 : 6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "12px 12px 0 0",
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isLoading
                          ? theme.palette.mode === "dark"
                            ? "#333"
                            : "#f5f5f5"
                          : "transparent",
                      }}
                    >
                      {isLoading ? (
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "200px",
                            overflow: "hidden",
                          }}
                        >
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            animation="wave"
                            sx={{
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "grey.800"
                                  : "grey.300",
                              "&::after": {
                                background:
                                  theme.palette.mode === "dark"
                                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
                                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                                animationDuration: "1.5s",
                              },
                            }}
                          />

                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              background:
                                theme.palette.mode === "dark"
                                  ? "rgba(0,0,0,0.3)"
                                  : "rgba(255,255,255,0.3)",
                              backdropFilter: "blur(1px)",
                            }}
                          >
                            <Box
                              sx={{
                                animation: "pulse 2s infinite",
                                "@keyframes pulse": {
                                  "0%": { opacity: 0.4, transform: "scale(1)" },
                                  "50%": {
                                    opacity: 0.8,
                                    transform: "scale(1.1)",
                                  },
                                  "100%": {
                                    opacity: 0.4,
                                    transform: "scale(1)",
                                  },
                                },
                              }}
                            >
                              <ImageIcon
                                size={32}
                                style={{
                                  color: theme.palette.primary.main,
                                  filter:
                                    "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                                }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 1,
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                animation: "fadeInOut 2s infinite",
                                "@keyframes fadeInOut": {
                                  "0%": { opacity: 0.5 },
                                  "50%": { opacity: 1 },
                                  "100%": { opacity: 0.5 },
                                },
                              }}
                            >
                              Loading...
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Fade in={!isLoading} timeout={500}>
                          <img
                            src={imageUrl}
                            alt={image.name}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              transition: "opacity 0.3s ease-in-out",
                            }}
                            onLoad={() =>
                              console.log(
                                "Image loaded successfully:",
                                image.name
                              )
                            }
                            onError={(e) => {
                              console.error(
                                "Image failed to load:",
                                image.name,
                                "src:",
                                e.currentTarget.src
                              );
                              // Update with error placeholder using Redux
                              dispatch(
                                setImageUrls({
                                  [image.id]:
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU0NDQ0Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==",
                                })
                              );
                            }}
                          />
                        </Fade>
                      )}
                    </Box>
                    <CardContent sx={{ pb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {image.name}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <HardDrive
                          size={16}
                          style={{
                            marginRight: 8,
                            color: theme.palette.text.secondary,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {image.size
                            ? `${Math.round(parseInt(image.size) / 1024)} KB`
                            : "Unknown size"}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Calendar
                          size={16}
                          style={{
                            marginRight: 8,
                            color: theme.palette.text.secondary,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(image.modifiedTime).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                      <Button
                        onClick={() => downloadImage(image)}
                        variant="contained"
                        size="small"
                        startIcon={<Download size={16} />}
                        disabled={isLoading}
                        sx={{
                          borderRadius: 2,
                          fontWeight: "bold",
                          textTransform: "none",
                          flex: 1,
                          backgroundColor: isLoading
                            ? "grey.400"
                            : "primary.main",
                          "&:hover": {
                            backgroundColor: isLoading
                              ? "grey.400"
                              : "primary.dark",
                            transform: isLoading ? "none" : "translateY(-2px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isLoading ? "Loading..." : "Download"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SimpleImageViewer;
