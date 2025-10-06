import React, { useState, useEffect } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { CloudinaryResource } from "../../services/cloudinary/cloudinaryService";

interface ThumbnailsPanelProps {
  originalImage: CloudinaryResource;
  onImageChange?: (transformedUrl: string) => void;
}

const ThumbnailsPanel: React.FC<ThumbnailsPanelProps> = ({
  originalImage,
  onImageChange,
}) => {
  const theme = useTheme();
  const [currentTransform, setCurrentTransform] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [loadedPresets, setLoadedPresets] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMainImageLoaded(false);
  }, [currentTransform]);

  if (!originalImage) return null;

  const presets = [
    { name: "Original", transform: "" },
    { name: "Sepia", transform: "e_sepia" },
    { name: "Blurry", transform: "e_blur:500" },
    { name: "Brightness", transform: "e_brightness:50" },
    { name: "Contrast", transform: "e_contrast:50" },
    { name: "Saturation", transform: "e_saturation:50" },

    { name: "Sharp", transform: "e_sharpen:100" },
    { name: "Soft", transform: "e_blur:100" },
    { name: "Vivid", transform: "e_vibrance:50/e_saturation:30" },
    { name: "Dramatic", transform: "e_contrast:70/e_brightness:-10" },
  ];

  const getTransformedUrl = (baseUrl: string, transform: string) => {
    if (!transform) return baseUrl;
    return baseUrl.replace("/upload/", `/upload/${transform}/`);
  };

  const handlePresetClick = (transform: string) => {
    setCurrentTransform(transform);
    const transformedUrl = getTransformedUrl(
      originalImage.secure_url,
      transform
    );
    onImageChange?.(transformedUrl);
  };

  const currentImageUrl = getTransformedUrl(
    originalImage.secure_url,
    currentTransform
  );
  const displayUrl = isHovered ? originalImage.secure_url : currentImageUrl;

  return (
    <Box
      sx={{
        flex: "0 0 260px",
        maxWidth: 260,
        minWidth: 200,
        height: "100%",
        overflow: "hidden",
        bgcolor: theme.palette.background.paper,

        display: "flex",
        flexDirection: "column",
        "@media (max-width: 1200px)": {
          flex: "0 0 200px",
          maxWidth: 200,
          minWidth: 150,
          height: "300px",
        },
        "@media (max-width: 768px)": {
          display: "none",
        },
      }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Thumbnails
        </Typography>
      </Box>

      <Box sx={{ p: 2, pb: 1 }}>
        <Box
          sx={{
            width: "100%",
            height: 180,
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: theme.palette.background.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!mainImageLoaded && (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          )}
          <img
            src={displayUrl}
            alt="Main image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.3s ease",
            }}
            onLoad={() => setMainImageLoaded(true)}
            onError={() => setMainImageLoaded(true)}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              bgcolor: "rgba(0,0,0,0.7)",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
              fontSize: "0.75rem",
            }}
          >
            {isHovered ? "Original" : "Current"}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          overflow: "auto",
          p: 2,
          pt: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
        }}
      >
        {presets.map((preset) => (
          <Box
            key={preset.name}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              border:
                currentTransform === preset.transform
                  ? "2px solid #1976d2"
                  : "1px solid transparent",
              borderRadius: 1,
              p: 1,
              transition: "border-color 0.2s ease",
              "&:hover": {
                borderColor: "#1976d2",
              },
            }}
            onClick={() => handlePresetClick(preset.transform)}
          >
            <Box
              sx={{
                width: "100%",
                height: 60,
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: theme.palette.mode === "dark" ? "#071018" : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!loadedPresets.has(preset.name) && (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              )}
              <img
                src={getTransformedUrl(
                  originalImage.secure_url,
                  preset.transform
                )}
                alt={preset.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onLoad={() => setLoadedPresets(prev => new Set(prev).add(preset.name))}
                onError={() => setLoadedPresets(prev => new Set(prev).add(preset.name))}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                textAlign: "center",
                fontSize: "0.7rem",
                color: theme.palette.text.secondary,
              }}
            >
              {preset.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ThumbnailsPanel;
