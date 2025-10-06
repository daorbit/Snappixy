import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  PreviewPanel as StyledPreviewPanel,
  PreviewImage,
  //   TransformationsInfo,
  LoadingPlaceholder,
} from "../../components/cloudinary/ImageTransformModal.styled";
import type {
  CloudinaryResource,
  TransformationOptions,
} from "../../services/cloudinary/cloudinaryService";

interface PreviewPanelProps {
  image: CloudinaryResource;
  transformedUrl: string;
  options: TransformationOptions;
  activePreset: string | null;
  hasTransformations: boolean;
  onSave: () => void;
  onReset: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  image,
  transformedUrl,
  //   options,
  //   activePreset,
  //   hasTransformations,
  //   onSave,
  //   onReset,
}) => {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Reset loading state when URL changes
  React.useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [transformedUrl]);

  return (
    <StyledPreviewPanel
      theme={theme}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        position: "relative",
        bgcolor: "transparent",
        height: "calc(100vh - 87px)",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
      }}
    >
      {transformedUrl ? (
        <Box
          sx={{
            maxWidth: "100%",
            height: "100%",
            maxHeight: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            padding: 1,
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            position: "relative",
            aspectRatio: image ? `${image.width}/${image.height}` : "auto",

            // Responsive adjustments for different screen sizes
            "@media (max-width: 1200px)": {
              aspectRatio: "auto",
              minHeight: "300px",
            },

            "@media (max-width: 768px)": {
              aspectRatio: "auto",
              minHeight: "250px",
              padding: 0.5,
            },
          }}
        >
          {!imageLoaded && !imageError && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Loading preview...
              </Typography>
            </Box>
          )}

          <PreviewImage
            key={transformedUrl}
            src={transformedUrl}
            alt="Transformed preview"
            theme={theme}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={(e) => {
              console.error("Image failed to load:", transformedUrl);
              setImageError(true);
              setImageLoaded(false);
              if (image) {
                e.currentTarget.src = image.secure_url;
              }
            }}
            style={{
              opacity: imageLoaded ? 1 : 0.7,
              filter: imageError ? "blur(2px)" : "none",
            }}
          />

          {imageError && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                bgcolor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.75rem",
              }}
            >
              Preview failed
            </Box>
          )}
        </Box>
      ) : (
        <LoadingPlaceholder theme={theme}>
          <Typography>Select transformations to see preview</Typography>
        </LoadingPlaceholder>
      )}
    </StyledPreviewPanel>
  );
};

export default PreviewPanel;
