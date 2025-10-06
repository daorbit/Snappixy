import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import { Delete, Download, Transform, ContentCopy } from "@mui/icons-material";
import {
  getOptimizedUrl,
  type CloudinaryResource,
} from "../../services/cloudinary/cloudinaryService";

interface CloudinaryImageCardProps {
  image: CloudinaryResource;
  // onEdit: (image: CloudinaryResource) => void;
  onDelete: (image: CloudinaryResource) => void;
  onSave: (image: CloudinaryResource) => void;
  onTransform: (image: CloudinaryResource) => void;
  onCopyUrl: (url: string) => void;
}

const CloudinaryImageCard: React.FC<CloudinaryImageCardProps> = ({
  image,
  // onEdit,
  onDelete,
  onSave,
  onTransform,
  onCopyUrl,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            height: 200,
            backgroundImage: `url(${getOptimizedUrl(
              image.public_id,
              300,
              200
            )})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 1,
            mx: 2,
            mt: 2,
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" noWrap title={image.public_id}>
            {image.public_id.split("/").pop()}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={`${image.width}x${image.height}`}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip label={formatFileSize(image.bytes)} size="small" />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {new Date(image.created_at).toLocaleDateString()}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton
            size="small"
            onClick={() => onTransform(image)}
            title="Transform"
          >
            <Transform />
          </IconButton>
          {/* <IconButton size="small" onClick={() => onEdit(image)} title="Edit">
            <Edit />
          </IconButton> */}
          <IconButton
            size="small"
            onClick={() => onSave(image)}
            title="Download"
          >
            <Download />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onCopyUrl(image.secure_url)}
            title="Copy URL"
          >
            <ContentCopy />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(image)}
            title="Delete"
            color="error"
          >
            <Delete />
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
};

export default CloudinaryImageCard;
