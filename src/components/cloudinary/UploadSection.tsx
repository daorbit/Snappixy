import React, { useRef } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { uploadImage, getImages, type CloudinaryResource, type UploadResult } from "../../services/cloudinary/cloudinaryService";

interface UploadSectionProps {
  isUploading: boolean;
  uploadProgress: number;
  onUploadStart: () => void;
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (images: CloudinaryResource[]) => void;
  onUploadError: (message: string) => void;
  onImagesRefresh: (images: CloudinaryResource[]) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  isUploading,
  uploadProgress,
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  onImagesRefresh,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    onUploadStart();
    onUploadProgress(0);

    const uploadPromises = Array.from(files).map(async (file, index) => {
      try {
        console.log(
          `Starting upload for file ${index + 1}/${files.length}:`,
          file.name
        );
        const result: UploadResult = await uploadImage(file);
        console.log(`Upload result for ${file.name}:`, result);

        onUploadProgress(((index + 1) / files.length) * 100);

        return result;
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        return {
          success: false,
          error: `Failed to upload ${file.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        } as UploadResult;
      }
    });

    try {
      console.log("Waiting for all uploads to complete...");
      const results = await Promise.allSettled(uploadPromises);
      console.log("All uploads completed:", results);

      const successfulUploads: CloudinaryResource[] = [];
      const failedUploads: string[] = [];

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          if (result.value.success && result.value.data) {
            successfulUploads.push(result.value.data);
          } else {
            failedUploads.push(
              result.value.error || `Upload ${index + 1} failed`
            );
          }
        } else {
          failedUploads.push(`Upload ${index + 1} failed: ${result.reason}`);
        }
      });

      onUploadComplete(successfulUploads);

      if (successfulUploads.length > 0) {
        try {
          const allImages = await getImages();
          onImagesRefresh(allImages);
        } catch (error) {
          console.error("Failed to refresh images after upload:", error);
          onImagesRefresh(successfulUploads);
        }
      }

      if (failedUploads.length > 0) {
        console.error("Failed uploads:", failedUploads);
        onUploadError(`Failed to upload ${failedUploads.length} image(s). Check console for details.`);
      }
    } catch (error) {
      console.error("Unexpected error during upload process:", error);
      onUploadError("Unexpected error during upload process");
    } finally {
      onUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<CloudUpload />}
        onClick={handleUploadClick}
        disabled={isUploading}
        sx={{ mr: 2 }}
      >
        Upload Images
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {isUploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Uploading... {Math.round(uploadProgress)}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}
    </Box>
  );
};

export default UploadSection;