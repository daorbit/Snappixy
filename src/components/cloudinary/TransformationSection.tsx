import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Transform } from "@mui/icons-material";
import { ImageTransformer } from ".";
import { type CloudinaryResource } from "../../services/cloudinary/cloudinaryService";

interface TransformationSectionProps {
  transformImage: CloudinaryResource | null;
  onBackToImages: () => void;
  onUrlChange: (url: string) => void;
}

const TransformationSection: React.FC<TransformationSectionProps> = ({
  transformImage,
  onBackToImages,
  onUrlChange,
}) => {
  if (transformImage) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Button onClick={onBackToImages} variant="outlined">
            Back to Images
          </Button>
          <Typography variant="h6" sx={{ ml: 2, display: "inline" }}>
            Transforming: {transformImage.public_id.split("/").pop()}
          </Typography>
        </Box>
        <ImageTransformer
          publicId={transformImage.public_id}
          onUrlChange={onUrlChange}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        textAlign: "center",
      }}
    >
      <Transform
        sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
      />
      <Typography variant="h6" color="text.secondary">
        No image selected for transformation
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Go back to Image Management and click the transform icon on an
        image
      </Typography>
    </Box>
  );
};

export default TransformationSection;