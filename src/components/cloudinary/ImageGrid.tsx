import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Skeleton,
  Typography,
} from "@mui/material";
import { Image } from "@mui/icons-material";
import CloudinaryImageCard from "./CloudinaryImageCard";
import { type CloudinaryResource } from "../../services/cloudinary/cloudinaryService";

interface ImageGridProps {
  images: CloudinaryResource[];
  isLoadingImages: boolean;
  // onEdit: (image: CloudinaryResource) => void;
  onDelete: (image: CloudinaryResource) => void;
  onSave: (image: CloudinaryResource) => void;
  onTransform: (image: CloudinaryResource) => void;
  onCopyUrl: (url: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  isLoadingImages,
  // onEdit,
  onDelete,
  onSave,
  onTransform,
  onCopyUrl,
}) => {
  if (isLoadingImages) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          },
          gap: 3,
          width: "100%",
        }}
      >
        {[...Array(9)].map((_, index) => (
          <Card
            key={`skeleton-${index}`}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Skeleton variant="rectangular" height={200} />
            <CardContent sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="80%" />
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <Skeleton variant="rectangular" width={60} height={24} />
                <Skeleton variant="rectangular" width={80} height={24} />
              </Box>
              <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
            </CardContent>
            <CardActions>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </CardActions>
          </Card>
        ))}
      </Box>
    );
  }

  if (images.length === 0) {
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
        <Image sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No images uploaded yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click "Upload Images" to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(5, 1fr)",
        },
        gap: 3,
        width: "100%",
      }}
    >
      {images.map((image) => (
        <CloudinaryImageCard
          key={image.public_id}
          image={image}
          // onEdit={onEdit}
          onDelete={onDelete}
          onSave={onSave}
          onTransform={onTransform}
          onCopyUrl={onCopyUrl}
        />
      ))}
    </Box>
  );
};

export default ImageGrid;
