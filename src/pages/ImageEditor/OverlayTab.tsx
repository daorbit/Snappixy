import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  CircularProgress,
} from "@mui/material";
import type {
  TransformationOptions,
  CloudinaryResource,
} from "../../services/cloudinary/cloudinaryService";
import { getImages } from "../../services/cloudinary/cloudinaryService";

interface OverlayTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const OverlayTab: React.FC<OverlayTabProps> = ({ options, updateOption }) => {
  const [overlayDrawerOpen, setOverlayDrawerOpen] = useState(false);
  const [availableImages, setAvailableImages] = useState<CloudinaryResource[]>(
    []
  );
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedOverlay, setSelectedOverlay] =
    useState<CloudinaryResource | null>(null);

  const handleOpenOverlayDrawer = async () => {
    setOverlayDrawerOpen(true);
    setLoadingImages(true);
    try {
      const images = await getImages();
      setAvailableImages(images);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleSelectOverlay = (image: CloudinaryResource) => {
    console.log("Selected overlay image:", image);
    setSelectedOverlay(image);
    updateOption("overlay", image.public_id);
    if (!options.overlay_position && !options.overlay_gravity) {
      updateOption("overlay_position", "center");
    }
    if (options.overlay_opacity === undefined) {
      updateOption("overlay_opacity", 100);
    }
    setOverlayDrawerOpen(false);
  };

  const handleClearOverlay = () => {
    setSelectedOverlay(null);
    updateOption("overlay", undefined);
    updateOption("overlay_position", undefined);
    updateOption("overlay_width", undefined);
    updateOption("overlay_height", undefined);
    updateOption("overlay_opacity", undefined);
    updateOption("overlay_gravity", undefined);
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Image Overlay
        </Typography>

        {selectedOverlay && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              border: "2px solid #666",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              src={selectedOverlay.secure_url}
              variant="square"
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Current Overlay:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedOverlay.width}x{selectedOverlay.height}
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleOpenOverlayDrawer}
            sx={{ mb: 1 }}
          >
            {options.overlay ? "Change Overlay Image" : "Select Overlay Image"}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Or enter overlay image URL/Public ID manually:
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="Overlay URL/Public ID"
            value={options.overlay || ""}
            onChange={(e) => {
              const value = e.target.value || undefined;
              updateOption("overlay", value);
              if (
                value &&
                !options.overlay_position &&
                !options.overlay_gravity
              ) {
                updateOption("overlay_position", "center");
              }
              if (value && options.overlay_opacity === undefined) {
                updateOption("overlay_opacity", 100);
              }
            }}
            placeholder="e.g., my-image or https://res.cloudinary.com/.../my-image.jpg"
          />
          {options.overlay && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={handleClearOverlay}
              sx={{ mt: 1 }}
            >
              Clear Overlay
            </Button>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Position</InputLabel>
            <Select
              label="Position"
              value={options.overlay_position || ""}
              onChange={(e) =>
                updateOption("overlay_position", e.target.value || undefined)
              }
              disabled={!options.overlay}
            >
              <MenuItem value="north_west">Top Left</MenuItem>
              <MenuItem value="north">Top Center</MenuItem>
              <MenuItem value="north_east">Top Right</MenuItem>
              <MenuItem value="west">Middle Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="east">Middle Right</MenuItem>
              <MenuItem value="south_west">Bottom Left</MenuItem>
              <MenuItem value="south">Bottom Center</MenuItem>
              <MenuItem value="south_east">Bottom Right</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Width"
            type="number"
            value={options.overlay_width || ""}
            onChange={(e) =>
              updateOption(
                "overlay_width",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            disabled={!options.overlay}
            inputProps={{ min: 10, max: 2000 }}
          />
          <TextField
            fullWidth
            size="small"
            label="Height"
            type="number"
            value={options.overlay_height || ""}
            onChange={(e) =>
              updateOption(
                "overlay_height",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            disabled={!options.overlay}
            inputProps={{ min: 10, max: 2000 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Opacity (0-100)"
            type="number"
            value={
              options.overlay_opacity !== undefined
                ? options.overlay_opacity
                : ""
            }
            onChange={(e) =>
              updateOption(
                "overlay_opacity",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            disabled={!options.overlay}
            inputProps={{ min: 0, max: 100 }}
            helperText="0 = transparent, 100 = opaque"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Gravity</InputLabel>
            <Select
              label="Gravity"
              value={options.overlay_gravity || ""}
              onChange={(e) =>
                updateOption("overlay_gravity", e.target.value || undefined)
              }
              disabled={!options.overlay}
            >
              <MenuItem value="auto">Auto</MenuItem>
              <MenuItem value="face">Face</MenuItem>
              <MenuItem value="face:center">Face Center</MenuItem>
              <MenuItem value="north_west">Top Left</MenuItem>
              <MenuItem value="north">Top</MenuItem>
              <MenuItem value="north_east">Top Right</MenuItem>
              <MenuItem value="west">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="east">Right</MenuItem>
              <MenuItem value="south_west">Bottom Left</MenuItem>
              <MenuItem value="south">Bottom</MenuItem>
              <MenuItem value="south_east">Bottom Right</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>

      <Drawer
        open={overlayDrawerOpen}
        onClose={() => setOverlayDrawerOpen(false)}
        anchor="left"
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            padding: 2,
          },
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Select Overlay Image
        </Typography>
        
        {loadingImages ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ maxHeight: 'calc(100vh - 120px)', overflow: "auto" }}>
            {availableImages.map((image) => (
              <ListItem key={image.public_id} disablePadding>
                <ListItemButton onClick={() => handleSelectOverlay(image)}>
                  <ListItemAvatar>
                    <Avatar
                      src={image.secure_url}
                      variant="square"
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={image.public_id.split("/").pop()}
                    secondary={`${image.width}x${image.height} • ${image.format}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            {availableImages.length === 0 && !loadingImages && (
              <Typography
                sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
              >
                No images available. Upload some images first.
              </Typography>
            )}
          </List>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setOverlayDrawerOpen(false)}>Cancel</Button>
        </Box>
      </Drawer>
    </Card>
  );
};

export default OverlayTab;
