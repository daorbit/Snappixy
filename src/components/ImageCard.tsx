import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import {
  AutoAwesome,
  Delete,
  Download,
  Visibility,
  CloudUpload,
} from "@mui/icons-material";
import {
  type OptimizationOptions,
  type ProcessedImage,
} from "../types/index.ts";

interface ImageCardProps {
  image: ProcessedImage;
  index: number;
  onRemove: (index: number) => void;
  onImageClick: (src: string, alt: string) => void;
  onDownload: (blob: Blob, filename: string) => void;
  optimizationOptions: OptimizationOptions;
  formatFileSize: (bytes: number) => string;
  onSaveToDrive?: (blob: Blob, filename: string) => Promise<void>;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  onRemove,
  onImageClick,
  onDownload,
  optimizationOptions,
  formatFileSize,
  onSaveToDrive,
}) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {image.aiOptimized && (
        <Chip
          label="AI Optimized"
          color="primary"
          size="small"
          icon={<AutoAwesome />}
          sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}
        />
      )}

      {/* Delete Button */}
      <IconButton
        onClick={() => onRemove(index)}
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 1,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          color: "error.main",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 1)",
            color: "error.dark",
          },
          width: 32,
          height: 32,
        }}
        size="small"
      >
        <Delete fontSize="small" />
      </IconButton>

      {/* Image Preview Section */}
      <Box sx={{ position: "relative", bgcolor: "grey.50" }}>
        <Box
          component="img"
          src={image.optimizedBase64 || image.originalBase64}
          alt={image.original.name}
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Status Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption">
            {image.optimizedBase64 ? "Optimized" : "Original"}
          </Typography>
          {image.result && (
            <Chip
              label={`${image.result.compressionRatio.toFixed(0)}% saved`}
              size="small"
              sx={{
                bgcolor: "success.main",
                color: "white",
                fontSize: "0.7rem",
                height: 20,
              }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flex: 1, p: 2 }}>
        <Typography variant="subtitle2" noWrap gutterBottom>
          {image.original.name}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Original
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatFileSize(image.original.size)}
            </Typography>
          </Box>

          {image.result && (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="success.main">
                Optimized
              </Typography>
              <Typography variant="body2" color="success.main">
                {formatFileSize(image.result.optimizedSize)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Before/After Comparison */}
        {image.optimizedBase64 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="caption" display="block" gutterBottom>
              Before / After
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "50%",
                  cursor: "pointer",
                  "&:hover .hover-overlay": {
                    opacity: 1,
                  },
                }}
                onClick={() =>
                  onImageClick(
                    image.originalBase64,
                    `Original ${image.original.name}`
                  )
                }
              >
                <Box
                  component="img"
                  src={image.originalBase64}
                  alt="Before"
                  sx={{
                    width: "100%",
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: 1,
                    borderColor: "grey.300",
                  }}
                />
                <Box
                  className="hover-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                    borderRadius: 1,
                  }}
                >
                  <Visibility sx={{ color: "white", fontSize: 24 }} />
                </Box>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  width: "50%",
                  cursor: "pointer",
                  "&:hover .hover-overlay": {
                    opacity: 1,
                  },
                }}
                onClick={() =>
                  onImageClick(
                    image.optimizedBase64 ?? "",
                    `Optimized ${image.original.name}`
                  )
                }
              >
                <Box
                  component="img"
                  src={image.optimizedBase64}
                  alt="After"
                  sx={{
                    width: "100%",
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: 2,
                    borderColor: "success.main",
                  }}
                />
                <Box
                  className="hover-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                    borderRadius: 1,
                  }}
                >
                  <Visibility sx={{ color: "white", fontSize: 24 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        {image.optimized && (
          <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
            <IconButton
              size="small"
              onClick={() => {
                const extension =
                  optimizationOptions.format === "jpeg"
                    ? "jpg"
                    : optimizationOptions.format;
                const filename = `optimized_${
                  image.original.name.split(".")[0]
                }.${extension}`;
                onDownload(image.optimized!, filename);
              }}
              sx={{
                border: 1,
                borderColor: "transparent",
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "transparent",
                  color: "white",
                  borderColor: "transparent",
                },
              }}
            >
              <Download
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              />
            </IconButton>
            {onSaveToDrive && (
              <IconButton
                size="small"
                onClick={async () => {
                  try {
                    const extension =
                      optimizationOptions.format === "jpeg"
                        ? "jpg"
                        : optimizationOptions.format;
                    const filename = `optimized_${
                      image.original.name.split(".")[0]
                    }.${extension}`;
                    await onSaveToDrive(image.optimized!, filename);
                  } catch (error) {
                    console.error("Failed to save to drive:", error);
                  }
                }}
                sx={{
                  border: 1,
                  borderColor: "transparent",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "white",
                    borderColor: "transparent",
                  },
                }}
              >
                <CloudUpload
                  sx={{
                    "&:hover": {
                      color: "green",
                    },
                  }}
                />
              </IconButton>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageCard;
