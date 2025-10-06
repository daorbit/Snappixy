import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
  Paper,
  Avatar,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AutoAwesome,
  Download,
  CloudUpload,
  Palette,
  PhotoLibrary,
  Close,
  Refresh,
} from "@mui/icons-material";
import { type ThumbnailOptions } from "../types/index.ts";
import { generateImage } from "../services/geminiService";

interface UploadedImage {
  file: File;
  base64: string;
  preview: string;
}

interface GeneratedThumbnail {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  category: string;
}

const ThumbnailCreatorPage: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );
  const [thumbnailOptions, setThumbnailOptions] = useState<ThumbnailOptions>({
    title: "",
    description: "",
    category: "",
    style: "modern",
    primaryColor: "#1976d2",
    backgroundColor: "#ffffff",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<
    GeneratedThumbnail[]
  >([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }

    try {
      setError(null);
      const base64 = await fileToBase64(file);
      const preview = URL.createObjectURL(file);

      setUploadedImage({
        file,
        base64,
        preview,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process the image");
    }
  };

  const removeUploadedImage = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setGeneratedThumbnails([]);
  };

  const downloadThumbnail = (thumbnailUrl: string, index: number) => {
    try {
      // Handle base64 images
      if (thumbnailUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = thumbnailUrl;
        link.download = `ai-thumbnail-${index + 1}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Handle regular URLs
        const link = document.createElement("a");
        link.href = thumbnailUrl;
        link.download = `ai-thumbnail-${index + 1}-${Date.now()}.png`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading thumbnail:", error);
      setError("Failed to download thumbnail. Please try again.");
    }
  };

  // const categories = [
  //   "Technology",
  //   "Food & Cooking",
  //   "Travel",
  //   "Education",
  //   "Entertainment",
  //   "Business",
  //   "Health & Fitness",
  //   "DIY & Crafts",
  //   "Music",
  //   "Gaming",
  // ];

  // const styles = [
  //   { value: 'modern', label: 'Modern' },
  //   { value: 'classic', label: 'Classic' },
  //   { value: 'bold', label: 'Bold' },
  //   { value: 'minimal', label: 'Minimal' },
  // ];

  const handleGenerateThumbnail = async () => {
    if (!thumbnailOptions.description) {
      setError("Please provide a description for the thumbnail");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    try {
      // Use description as the primary input for image generation
      setProgress(25);

      // Create enhanced description with optional style information
      let enhancedDescription = thumbnailOptions.description;
      if (thumbnailOptions.style && thumbnailOptions.style !== "modern") {
        enhancedDescription += ` Create this in a ${thumbnailOptions.style} style.`;
      }
      if (uploadedImage) {
        enhancedDescription +=
          " Incorporate visual elements from the provided reference image.";
      }

      console.log(
        "Generating thumbnail with description:",
        enhancedDescription
      );

      // Generate single thumbnail
      setProgress(50);

      setProgress(75);
      const result = await generateImage({
        description: enhancedDescription,
        referenceImage: uploadedImage?.file || null,
      });

      const thumbnailBase64 = result.image;

      // Create single thumbnail result
      const thumbnail = {
        id: `thumbnail-${Date.now()}`,
        imageUrl: thumbnailBase64,
        prompt: uploadedImage
          ? "AI-generated thumbnail with uploaded image"
          : enhancedDescription,
        style: thumbnailOptions.style,
        category: thumbnailOptions.category || "General",
      };

      setProgress(100);
      setGeneratedThumbnails([thumbnail]);
    } catch (error) {
      console.error("Thumbnail generation error:", error);
      setError(
        "Failed to generate thumbnail. Please check your Gemini API key and try again."
      );
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <Box sx={{ px: 4 }}>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{mb: 2}}>
          AI Thumbnail Creator
        </Typography>
       

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Image Upload Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <PhotoLibrary sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Upload Image
                  </Typography>
                </Box>

                {!uploadedImage ? (
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUpload />}
                      fullWidth
                      size="large"
                      sx={{ mb: 2 }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      Upload an image to incorporate into your AI-generated
                      thumbnail designs
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Paper sx={{ p: 2, position: "relative" }}>
                      <IconButton
                        size="small"
                        onClick={removeUploadedImage}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "background.paper",
                          boxShadow: 1,
                        }}
                      >
                        <Close />
                      </IconButton>
                      <Box
                        component="img"
                        src={uploadedImage.preview}
                        alt="Uploaded image"
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 1,
                          mb: 2,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {uploadedImage.file.name} (
                        {(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                       
                    </Paper>
                  </Box>
                )}

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Thumbnail Details Section */}
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <AutoAwesome sx={{ mr: 1 }} />
                  <Typography variant="h6">Thumbnail Details</Typography>
                </Box>

                {/* <TextField
                  fullWidth
                  label="Title (Optional)"
                  value={thumbnailOptions.title}
                  onChange={(e) =>
                    setThumbnailOptions({
                      ...thumbnailOptions,
                      title: e.target.value,
                    })
                  }
                  sx={{ mb: 3 }}
                  placeholder="e.g., How to Build a React App"
                /> */}

                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={thumbnailOptions.description}
                  onChange={(e) =>
                    setThumbnailOptions({
                      ...thumbnailOptions,
                      description: e.target.value,
                    })
                  }
                  sx={{ mb: 3 }}
                  placeholder="Describe what kind of thumbnail you want to create... This is the main input for AI generation."
                  required
                />

                {/* <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Category (Optional)</InputLabel>
                  <Select
                    value={thumbnailOptions.category}
                    label="Category (Optional)"
                    onChange={(e) =>
                      setThumbnailOptions({
                        ...thumbnailOptions,
                        category: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

                {/* <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Style</InputLabel>
                  <Select
                    value={thumbnailOptions.style}
                    label="Style"
                    onChange={(e) =>
                      setThumbnailOptions({
                        ...thumbnailOptions,
                        style: e.target.value as 'modern' | 'classic' | 'bold' | 'minimal',
                      })
                    }
                  >
                    {styles.map((style) => (
                      <MenuItem key={style.value} value={style.value}>
                        {style.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

                {/* <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    label="Primary Color"
                    type="color"
                    value={thumbnailOptions.primaryColor}
                    onChange={(e) =>
                      setThumbnailOptions({
                        ...thumbnailOptions,
                        primaryColor: e.target.value,
                      })
                    }
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Background Color"
                    type="color"
                    value={thumbnailOptions.backgroundColor}
                    onChange={(e) =>
                      setThumbnailOptions({
                        ...thumbnailOptions,
                        backgroundColor: e.target.value,
                      })
                    }
                    sx={{ flex: 1 }}
                  />
                </Box> */}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleGenerateThumbnail}
                  disabled={!thumbnailOptions.description || isGenerating}
                  sx={{
                    background: uploadedImage
                      ? "linear-gradient(45deg, #8B5CF6 30%, #7C3AED 90%)"
                      : undefined,
                    "&:hover": {
                      background: uploadedImage
                        ? "linear-gradient(45deg, #7C3AED 30%, #6D28D9 90%)"
                        : undefined,
                    },
                  }}
                >
                  {isGenerating
                    ? "Generating..."
                    : uploadedImage
                    ? "Generate AI Thumbnail with Image"
                    : "Generate AI Thumbnail"}
                </Button>

                {uploadedImage && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>AI Enhancement Active:</strong> Your uploaded
                      image will be analyzed by Gemini AI to create thumbnails
                      that incorporate visual elements from your image.
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Palette sx={{ mr: 1 }} />
                    <Typography variant="h6">Generated Thumbnails</Typography>
                  </Box>

                  {generatedThumbnails.length > 0 && (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Button
                        size="small"
                        startIcon={<Download />}
                        onClick={() =>
                          downloadThumbnail(generatedThumbnails[0].imageUrl, 0)
                        }
                      >
                        Download
                      </Button>
                      <Button size="small" startIcon={<CloudUpload />}>
                        Save to Drive
                      </Button>
                      <Tooltip title="Generate new thumbnail">
                        <IconButton
                          size="small"
                          onClick={handleGenerateThumbnail}
                        >
                          <Refresh />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {isGenerating && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      {progress < 25
                        ? "Initializing Gemini 2.5 Flash Image..."
                        : progress < 50
                        ? "Preparing thumbnail generation..."
                        : progress < 75
                        ? uploadedImage
                          ? "Processing uploaded image with Gemini AI..."
                          : "Creating AI thumbnail design..."
                        : progress < 100
                        ? "Generating thumbnail with Nano Banana..."
                        : "Finalizing thumbnail..."}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {progress}% complete
                    </Typography>
                  </Box>
                )}

                {generatedThumbnails.length > 0 && (
                  <Grid container spacing={2}>
                    {generatedThumbnails.map((thumbnail) => (
                      <Grid size={{ xs: 12 }} key={thumbnail.id}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            src={thumbnail.imageUrl}
                            variant="rounded"
                            sx={{ width: "auto", height: "auto" }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {!isGenerating && generatedThumbnails.length === 0 && (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      color: "text.secondary",
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      {uploadedImage
                        ? "Ready to create an AI thumbnail with your uploaded image!"
                        : 'Add a description and click "Generate Thumbnail" to create an AI-powered design'}
                    </Typography>
                    {uploadedImage && (
                      <Typography variant="body2" color="primary">
                        Gemini AI will analyze your image and incorporate its
                        elements into the thumbnail design.
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

       
      </Box>
    </Box>
  );
};

export default ThumbnailCreatorPage;
