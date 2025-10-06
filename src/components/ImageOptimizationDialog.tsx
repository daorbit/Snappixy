import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Edit,
  Download,
  CloudUpload,
  Save,
  Close,
  Tune,
  Image,
  Assessment,
} from "@mui/icons-material";
import { type DriveFile } from "../services/googleDriveService.ts";
import {
  type OptimizationOptions,
  type OptimizationResult,
} from "../services/imageOptimizationService.ts";

interface ImageOptimizationDialogProps {
  open: boolean;
  file: DriveFile | null;
  imageBlob: Blob | null;
  optimizationResult: OptimizationResult | null;
  optimizationOptions: OptimizationOptions;
  optimizing: boolean;
  saving: boolean;
  onClose: () => void;
  onOptimize: () => void;
  onDownload: () => void;
  onSaveToDrive: (replaceOriginal: boolean) => void;
  onOptionsChange: (options: OptimizationOptions) => void;
}

const ImageOptimizationDialog: React.FC<ImageOptimizationDialogProps> = ({
  open,
  file,
  imageBlob,
  optimizationResult,
  optimizationOptions,
  optimizing,
  saving,
  onClose,
  onOptimize,
  onDownload,
  onSaveToDrive,
  onOptionsChange,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: isDarkMode ? "#1b1b1c" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 4,
          border: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: isDarkMode
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)"
            : "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)",
          borderBottom: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          py: 2,
          px: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tune sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Optimize Image
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.875rem" }}
            >
              {file?.name}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.04)",
            color: isDarkMode
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(0, 0, 0, 0.6)",
            borderRadius: 2,
            width: 40,
            height: 40,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: isDarkMode
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.08)",
              transform: "scale(1.05)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          bgcolor: isDarkMode ? "#1b1b1c" : "#ffffff",
        }}
      >
        <Grid container>
          {/* Image Preview Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 4, height: "100%" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image sx={{ color: "white", fontSize: 16 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Preview
                </Typography>
              </Box>

              {imageBlob && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.8) 100%)"
                      : "linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.8) 100%)",
                    borderRadius: 3,
                    p: 3,
                    border: isDarkMode
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <img
                    src={URL.createObjectURL(imageBlob)}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "350px",
                      objectFit: "contain",
                      borderRadius: 8,
                      boxShadow: isDarkMode
                        ? "0 10px 25px rgba(0, 0, 0, 0.3)"
                        : "0 10px 25px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          {/* Optimization Settings Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 4,
                height: "100%",
                borderLeft: {
                  md: isDarkMode
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Tune sx={{ color: "white", fontSize: 16 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Settings
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Quality Control */}
                <Box>
                  <Typography gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                    Quality:{" "}
                    {Math.round((optimizationOptions.quality || 0.8) * 100)}%
                  </Typography>
                  <Slider
                    value={(optimizationOptions.quality || 0.8) * 100}
                    onChange={(_, value) =>
                      onOptionsChange({
                        ...optimizationOptions,
                        quality: (value as number) / 100,
                      })
                    }
                    min={10}
                    max={100}
                    step={5}
                    sx={{
                      "& .MuiSlider-thumb": {
                        backgroundColor: "#667eea",
                        "&:hover, &.Mui-focusVisible": {
                          boxShadow: "0 0 0 8px rgba(102, 126, 234, 0.16)",
                        },
                      },
                      "& .MuiSlider-track": {
                        background:
                          "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      },
                    }}
                  />
                </Box>

                {/* Dimensions */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                      Max Width: {optimizationOptions.maxWidth}px
                    </Typography>
                    <Slider
                      value={optimizationOptions.maxWidth || 1920}
                      onChange={(_, value) =>
                        onOptionsChange({
                          ...optimizationOptions,
                          maxWidth: value as number,
                        })
                      }
                      min={400}
                      max={4000}
                      step={100}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                      Max Height: {optimizationOptions.maxHeight}px
                    </Typography>
                    <Slider
                      value={optimizationOptions.maxHeight || 1080}
                      onChange={(_, value) =>
                        onOptionsChange({
                          ...optimizationOptions,
                          maxHeight: value as number,
                        })
                      }
                      min={300}
                      max={3000}
                      step={100}
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Format Selection */}
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.04)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                      },
                    },
                  }}
                >
                  <InputLabel sx={{ fontWeight: 500 }}>Format</InputLabel>
                  <Select
                    value={optimizationOptions.format || "jpeg"}
                    label="Format"
                    onChange={(e) =>
                      onOptionsChange({
                        ...optimizationOptions,
                        format: e.target.value as "jpeg" | "png" | "webp",
                      })
                    }
                  >
                    <MenuItem value="webp">WebP - Best compression</MenuItem>
                    <MenuItem value="jpeg">JPEG - Universal support</MenuItem>
                    <MenuItem value="png">PNG - Lossless quality</MenuItem>
                  </Select>
                </FormControl>

                {/* Aspect Ratio Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        optimizationOptions.maintainAspectRatio !== false
                      }
                      onChange={(e) =>
                        onOptionsChange({
                          ...optimizationOptions,
                          maintainAspectRatio: e.target.checked,
                        })
                      }
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#667eea",
                          "& + .MuiSwitch-track": {
                            backgroundColor: "#667eea",
                          },
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500 }}>
                      Maintain aspect ratio
                    </Typography>
                  }
                />

                {/* Optimize Button */}
                <Button
                  variant="contained"
                  onClick={onOptimize}
                  disabled={optimizing}
                  fullWidth
                  size="large"
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0 4px 14px 0 rgba(102, 126, 234, 0.39)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                    },
                    "&:disabled": {
                      background: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(0, 0, 0, 0.3)",
                    },
                  }}
                  startIcon={
                    optimizing ? <CircularProgress size={20} /> : <Edit />
                  }
                >
                  {optimizing ? "Optimizing..." : "Optimize Image"}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Optimization Results */}
          {optimizationResult && (
            <>
              <Grid size={12}>
                <Divider
                  sx={{
                    borderColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                    my: 0,
                  }}
                />
              </Grid>
              <Grid size={12}>
                <Box sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        background:
                          "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Assessment sx={{ color: "white", fontSize: 16 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Results
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: isDarkMode
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(239, 68, 68, 0.05)",
                          border: isDarkMode
                            ? "1px solid rgba(239, 68, 68, 0.2)"
                            : "1px solid rgba(239, 68, 68, 0.1)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Original Size
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatFileSize(optimizationResult.originalSize)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: isDarkMode
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(34, 197, 94, 0.05)",
                          border: isDarkMode
                            ? "1px solid rgba(34, 197, 94, 0.2)"
                            : "1px solid rgba(34, 197, 94, 0.1)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Optimized Size
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatFileSize(optimizationResult.optimizedSize)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: isDarkMode
                            ? "rgba(251, 191, 36, 0.1)"
                            : "rgba(251, 191, 36, 0.05)",
                          border: isDarkMode
                            ? "1px solid rgba(251, 191, 36, 0.2)"
                            : "1px solid rgba(251, 191, 36, 0.1)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Saved
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "success.main" }}
                        >
                          {optimizationResult.compressionRatio.toFixed(1)}%
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          background: isDarkMode
                            ? "rgba(147, 51, 234, 0.1)"
                            : "rgba(147, 51, 234, 0.05)",
                          border: isDarkMode
                            ? "1px solid rgba(147, 51, 234, 0.2)"
                            : "1px solid rgba(147, 51, 234, 0.1)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Dimensions
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {optimizationResult.optimizedDimensions.width} ×{" "}
                          {optimizationResult.optimizedDimensions.height}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          justifyContent: "space-between",
          borderTop: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          background: isDarkMode
            ? "rgba(17, 24, 39, 0.5)"
            : "rgba(249, 250, 251, 0.5)",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>

        {optimizationResult && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onDownload}
              startIcon={<Download />}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: 500,
                borderColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(0, 0, 0, 0.23)",
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(0, 0, 0, 0.87)",
                "&:hover": {
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(0, 0, 0, 0.5)",
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Download
            </Button>
            <Button
              variant="contained"
              onClick={() => onSaveToDrive(false)}
              disabled={saving}
              startIcon={
                saving ? <CircularProgress size={20} /> : <CloudUpload />
              }
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: 500,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #059669 0%, #047857 100%)",
                },
              }}
            >
              Save as New
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => onSaveToDrive(true)}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: 500,
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                },
              }}
            >
              Replace Original
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImageOptimizationDialog;
