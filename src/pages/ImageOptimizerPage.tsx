import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  LinearProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";
import {
  Download,
  Tune,
  AutoAwesome,
  ImageSearch,
  Add,
} from "@mui/icons-material";
import {
  type OptimizationOptions,
  type ProcessedImage,
} from "../types/index.ts";
import ImagePopupModal from "../components/ImagePopupModal.tsx";
import ImageCard from "../components/ImageCard.tsx";
import { useAuth } from "../contexts/useAuth.ts";
import { ImageOptimizationService } from "../services/imageOptimizationService.ts";
import { GoogleDriveService } from "../services/googleDriveService.ts";

const ImageOptimizerPage: React.FC = () => {
  const { user, refreshGoogleDriveToken } = useAuth();
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [optimizationMode, setOptimizationMode] = useState<"default" | "ai">(
    "default"
  );
  const [optimizationOptions, setOptimizationOptions] =
    useState<OptimizationOptions>({
      quality: 80,
      format: "webp",
      maxWidth: 1920,
      maxHeight: 1080,
    });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageOptimizer] = useState(() => new ImageOptimizationService());
  const [driveService, setDriveService] = useState<GoogleDriveService | null>(
    null
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePopup, setImagePopup] = useState<{
    open: boolean;
    src: string;
    alt: string;
  }>({
    open: false,
    src: "",
    alt: "",
  });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize drive service when user changes
  useEffect(() => {
    if (user?.accessToken) {
      setDriveService(
        new GoogleDriveService(user.accessToken, refreshGoogleDriveToken)
      );
    } else {
      setDriveService(null);
    }
  }, [user?.accessToken, refreshGoogleDriveToken]);

  // Utility function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Handle opening image popup
  const handleImageClick = (src: string, alt: string) => {
    setImagePopup({ open: true, src, alt });
  };

  // Handle closing image popup
  const handleClosePopup = () => {
    setImagePopup({ open: false, src: "", alt: "" });
  };

  // Show notification
  const showNotification = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Handle closing notification
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    setProcessedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      processFiles(files);
    };
    input.click();
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = reject;
    });
  };

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
    });
  };

  const processFiles = async (files: File[]) => {
    // Convert files to base64 immediately
    const processed: ProcessedImage[] = [];
    for (const file of files) {
      try {
        const originalBase64 = await fileToBase64(file);
        processed.push({
          original: file,
          originalBase64,
        });
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
    setProcessedImages(processed);
  };

  const downloadImage = (
    blob: Blob,
    filename: string,
    showNotif: boolean = true
  ) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (showNotif) {
      showNotification(`Downloaded ${filename} successfully!`, "success");
    }
  };

  const downloadAllImages = () => {
    const optimizedCount = processedImages.filter(
      (img) => img.optimized
    ).length;
    processedImages.forEach((image, index) => {
      if (image.optimized) {
        const extension =
          optimizationOptions.format === "jpeg"
            ? "jpg"
            : optimizationOptions.format;
        const filename = `optimized_${image.original.name.split(".")[0]}_${
          index + 1
        }.${extension}`;
        downloadImage(image.optimized, filename, false);
      }
    });
    showNotification(
      `Downloaded ${optimizedCount} optimized image${
        optimizedCount > 1 ? "s" : ""
      } successfully!`,
      "success"
    );
  };

  const saveToDrive = async (blob: Blob, filename: string) => {
    if (!driveService) {
      showNotification(
        "Google Drive service not available. Please sign in.",
        "error"
      );
      throw new Error("Drive service not available");
    }
    try {
      await driveService.uploadFile(blob, filename);
      showNotification(
        `Uploaded ${filename} to Google Drive successfully!`,
        "success"
      );
    } catch (error) {
      showNotification(
        `Failed to upload ${filename} to Google Drive.`,
        "error"
      );
      throw error;
    }
  };

  const handleOptimize = async () => {
    if (processedImages.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const optimizedImages: ProcessedImage[] = [];

      for (let i = 0; i < processedImages.length; i++) {
        const image = processedImages[i];
        setProgress(((i + 1) / processedImages.length) * 100);

        if (optimizationMode === "ai") {
          // AI optimization using Gemini
          try {
            const result = await imageOptimizer.optimizeImage(image.original, {
              quality: (optimizationOptions.quality || 80) / 100,
              format: optimizationOptions.format,
              maxWidth: optimizationOptions.maxWidth,
              maxHeight: optimizationOptions.maxHeight,
            });

            const optimizedBase64 = await blobToBase64(result.blob);

            optimizedImages.push({
              ...image,
              optimized: result.blob,
              optimizedBase64,
              result,
              aiOptimized: true,
            });
          } catch (error) {
            console.error(
              "AI optimization failed, falling back to default:",
              error
            );
            // Fallback to regular optimization
            const result = await imageOptimizer.optimizeImage(image.original, {
              quality: (optimizationOptions.quality || 80) / 100,
              format: optimizationOptions.format,
              maxWidth: optimizationOptions.maxWidth,
              maxHeight: optimizationOptions.maxHeight,
            });

            const optimizedBase64 = await blobToBase64(result.blob);

            optimizedImages.push({
              ...image,
              optimized: result.blob,
              optimizedBase64,
              result,
              aiOptimized: false,
            });
          }
        } else {
          // Default optimization
          const result = await imageOptimizer.optimizeImage(image.original, {
            quality: (optimizationOptions.quality || 80) / 100,
            format: optimizationOptions.format,
            maxWidth: optimizationOptions.maxWidth,
            maxHeight: optimizationOptions.maxHeight,
          });

          const optimizedBase64 = await blobToBase64(result.blob);

          optimizedImages.push({
            ...image,
            optimized: result.blob,
            optimizedBase64,
            result,
            aiOptimized: false,
          });
        }
      }

      setProcessedImages(optimizedImages);
    } catch (error) {
      console.error("Optimization error:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div style={{ width: "100%", padding: "24px" }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
              Image Optimizer
            </Typography>
          </Box>

          {processedImages.length > 0 && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Tune />}
                onClick={handleOptimize}
                disabled={isProcessing}
                size="medium"
                sx={{
                  background: "transparent",
                  color: isProcessing ? "grey.400" : "#667eea",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  border: isProcessing
                    ? "2px solid #bdbdbd"
                    : "2px solid #667eea",
                  boxShadow: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: isProcessing
                      ? "transparent"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 2px 10px rgba(102, 126, 234, 0.3)",
                  },
                  "&.Mui-disabled": {
                    background: "transparent",
                    color: "grey.400",
                    borderColor: "grey.400",
                    boxShadow: "none",
                    transform: "none",
                  },
                }}
              >
                {isProcessing
                  ? "Optimizing..."
                  : `Optimize ${processedImages.length} Image${
                      processedImages.length > 1 ? "s" : ""
                    }`}
              </Button>

              {processedImages.some((img) => img.optimized) && (
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={downloadAllImages}
                  size="medium"
                  sx={{
                    background: "transparent",
                    color: "#4CAF50",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    border: "2px solid #4CAF50",
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                      color: "white",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                      boxShadow: "0 2px 10px rgba(76, 175, 80, 0.3)",
                    },
                  }}
                >
                  Download All
                </Button>
              )}
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Left Column: Upload + Settings in One Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Upload & Optimize Images
                </Typography>

                {/* Upload Section */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}
                  >
                    {/* Drag and Drop Zone */}
                    <Box
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={handleClick}
                      sx={{
                        width: "100%",
                        minHeight: 220,
                        border: "2px dashed",
                        borderColor: isDragOver ? "primary.main" : "grey.400",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundColor: isDragOver
                          ? "action.hover"
                          : "background.paper",
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden",
                        p: 3,
                        "&:hover": {
                          borderColor: "primary.main",
                          backgroundColor: "action.hover",
                          transform: "translateY(-2px)",
                          boxShadow: 2,
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: isDragOver
                            ? "linear-gradient(45deg, rgba(25, 118, 210, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(25, 118, 210, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(25, 118, 210, 0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(25, 118, 210, 0.1) 75%)"
                            : "linear-gradient(45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.05) 75%)",
                          backgroundSize: "20px 20px",
                          backgroundPosition:
                            "0 0, 0 10px, 10px -10px, -10px 0px",
                          filter: "blur(0.5px)",
                          opacity: 0.3,
                        },
                      }}
                    >
                      <Add
                        sx={{
                          fontSize: 48,
                          color: isDragOver ? "primary.main" : "grey.500",
                          mb: 2,
                          transition: "all 0.3s ease",
                        }}
                      />
                      <Typography
                        variant="h6"
                        color={isDragOver ? "primary.main" : "text.secondary"}
                        sx={{
                          transition: "color 0.3s ease",
                          textAlign: "center",
                          mb: 1,
                        }}
                      >
                        {isDragOver
                          ? "Drop images here"
                          : "Drag & drop or click to select"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                      >
                        PNG, JPG, WebP supported • Multiple files allowed
                      </Typography>
                    </Box>
                  </Box>

                  {processedImages.length > 0 && (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {/* Buttons moved to header */}
                    </Box>
                  )}

                  {isProcessing && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress variant="determinate" value={progress} />
                      <Typography
                        variant="caption"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {progress.toFixed(0)}% complete
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Optimization Settings - Compact Layout */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Tune sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="subtitle1">Settings</Typography>
                </Box>

                <Grid container spacing={4}>
                  {/* Optimization Mode */}
                  <Grid size={{ xs: 12 }}>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "background.paper",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "background.paper",
                            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                          },
                        },
                      }}
                    >
                      <InputLabel
                        sx={{
                          "&.Mui-focused": {
                            color: "primary.main",
                            fontWeight: 600,
                          },
                        }}
                      >
                        Mode
                      </InputLabel>
                      <Select
                        value={optimizationMode}
                        label="Mode"
                        onChange={(e) =>
                          setOptimizationMode(
                            e.target.value as "default" | "ai"
                          )
                        }
                        sx={{
                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            py: 1.5,
                          },
                        }}
                      >
                        <MenuItem value="default">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ImageSearch
                              sx={{
                                mr: 1.5,
                                fontSize: 20,
                                color: "primary.main",
                              }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                Default
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Standard optimization
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                        <MenuItem value="ai">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AutoAwesome
                              sx={{
                                mr: 1.5,
                                fontSize: 20,
                                color: "secondary.main",
                              }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                AI (Gemini)
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Smart optimization
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Format and Quality in one row */}
                  <Grid size={{ xs: 6 }}>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "background.paper",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "background.paper",
                            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                          },
                        },
                      }}
                    >
                      <InputLabel
                        sx={{
                          "&.Mui-focused": {
                            color: "primary.main",
                            fontWeight: 600,
                          },
                        }}
                      >
                        Format
                      </InputLabel>
                      <Select
                        value={optimizationOptions.format}
                        label="Format"
                        onChange={(e) =>
                          setOptimizationOptions({
                            ...optimizationOptions,
                            format: e.target.value as "jpeg" | "png" | "webp",
                          })
                        }
                        sx={{
                          "& .MuiSelect-select": {
                            py: 1.5,
                          },
                        }}
                      >
                        <MenuItem value="webp">
                          <Typography variant="body2" fontWeight={500}>
                            WebP
                          </Typography>
                        </MenuItem>
                        <MenuItem value="jpeg">
                          <Typography variant="body2" fontWeight={500}>
                            JPEG
                          </Typography>
                        </MenuItem>
                        <MenuItem value="png">
                          <Typography variant="body2" fontWeight={500}>
                            PNG
                          </Typography>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" gutterBottom display="block">
                      Quality: {optimizationOptions.quality}%
                    </Typography>
                    <Slider
                      value={optimizationOptions.quality}
                      onChange={(_, value) =>
                        setOptimizationOptions({
                          ...optimizationOptions,
                          quality: value as number,
                        })
                      }
                      min={10}
                      max={100}
                      size="small"
                    />
                  </Grid>

                  {/* Dimensions */}
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" gutterBottom display="block">
                      Max Width: {optimizationOptions.maxWidth}px
                    </Typography>
                    <Slider
                      value={optimizationOptions.maxWidth || 1920}
                      onChange={(_, value) =>
                        setOptimizationOptions({
                          ...optimizationOptions,
                          maxWidth: value as number,
                        })
                      }
                      min={300}
                      max={4000}
                      step={100}
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" gutterBottom display="block">
                      Max Height: {optimizationOptions.maxHeight}px
                    </Typography>
                    <Slider
                      value={optimizationOptions.maxHeight || 1080}
                      onChange={(_, value) =>
                        setOptimizationOptions({
                          ...optimizationOptions,
                          maxHeight: value as number,
                        })
                      }
                      min={300}
                      max={3000}
                      step={100}
                      size="small"
                    />
                  </Grid>
                </Grid>

                {optimizationMode === "ai" && (
                  <Alert severity="info" sx={{ mt: 2, py: 1 }}>
                    <Typography variant="caption">
                      AI optimization uses Google Gemini for intelligent image
                      enhancement.
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                {processedImages.length > 0 ? (
                  <Grid container spacing={2}>
                    {processedImages.map((image, index) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                        <ImageCard
                          image={image}
                          index={index}
                          onRemove={handleRemoveImage}
                          onImageClick={handleImageClick}
                          onDownload={downloadImage}
                          optimizationOptions={optimizationOptions}
                          formatFileSize={formatFileSize}
                          onSaveToDrive={saveToDrive}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 8,
                      color: "text.secondary",
                    }}
                  >
                    <ImageSearch sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" gutterBottom>
                      No images uploaded yet
                    </Typography>
                    <Typography variant="body2">
                      Upload some images to get started
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Image Popup Modal */}
        <ImagePopupModal
          open={imagePopup.open}
          src={imagePopup.src}
          alt={imagePopup.alt}
          onClose={handleClosePopup}
        />
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ImageOptimizerPage;
