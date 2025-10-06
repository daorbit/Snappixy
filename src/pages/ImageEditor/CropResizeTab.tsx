import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface CropResizeTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const CropResizeTab: React.FC<CropResizeTabProps> = ({
  options,
  updateOption,
}) => {
  const [selectedAspectRatio, setSelectedAspectRatio] = React.useState("");

  React.useEffect(() => {
    if (options.aspectRatio) {
      setSelectedAspectRatio(options.aspectRatio);
    } else {
      setSelectedAspectRatio("");
    }
  }, [options.aspectRatio]);

  const aspectRatios = [
    { value: "", label: "Custom" },
    { value: "1:1", label: "Square (1:1)" },
    { value: "4:3", label: "Landscape (4:3)" },
    { value: "3:2", label: "Landscape (3:2)" },
    { value: "16:9", label: "Landscape (16:9)" },
    { value: "5:4", label: "Landscape (5:4)" },
    { value: "3:4", label: "Portrait (3:4)" },
    { value: "2:3", label: "Portrait (2:3)" },
    { value: "9:16", label: "Portrait (9:16)" },
    { value: "4:5", label: "Portrait (4:5)" },
  ];

  const handleAspectRatioChange = (aspectRatio: string) => {
    setSelectedAspectRatio(aspectRatio);
    if (aspectRatio === "") {
      updateOption("aspectRatio", undefined);
      updateOption("crop", undefined);
    } else {
      updateOption("aspectRatio", aspectRatio);
      updateOption("crop", "crop");
    }
  };

  const handleRotate = (degrees: number) => {
    const currentAngle = options.angle || 0;
    const newAngle = (currentAngle + degrees) % 360;
    updateOption("angle", newAngle === 0 ? undefined : newAngle);
  };

  const handleFlip = (direction: "horizontal" | "vertical") => {
    if (direction === "horizontal") {
      updateOption("flip", !options.flip);
    } else {
      updateOption("flop", !options.flop);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: "sm" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}

        {/* Resize Section */}
        <Typography
          variant="subtitle2"
          fontWeight={500}
          sx={{ mb: 1, color: "text.secondary" }}
        >
          Resize
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Width"
            type="number"
            size="small"
            value={options.width || ""}
            onChange={(e) =>
              updateOption(
                "width",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
          <TextField
            fullWidth
            label="Height"
            type="number"
            size="small"
            value={options.height || ""}
            onChange={(e) =>
              updateOption(
                "height",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </Stack>

        {/* Crop Section */}
        <Typography
          variant="subtitle2"
          fontWeight={500}
          sx={{ mb: 1, color: "text.secondary" }}
        >
          Crop
        </Typography>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Aspect Ratio</InputLabel>
            <Select
              value={selectedAspectRatio}
              onChange={(e) => handleAspectRatioChange(e.target.value)}
              label="Aspect Ratio"
            >
              {aspectRatios.map((ratio) => (
                <MenuItem key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Gravity</InputLabel>
            <Select
              value={options.gravity || ""}
              onChange={(e) =>
                updateOption("gravity", e.target.value || undefined)
              }
              label="Gravity"
            >
              <MenuItem value="">Auto</MenuItem>
              <MenuItem value="face">Face</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="north">North</MenuItem>
              <MenuItem value="south">South</MenuItem>
              <MenuItem value="east">East</MenuItem>
              <MenuItem value="west">West</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Transform Controls */}
        <Typography
          variant="subtitle2"
          fontWeight={500}
          sx={{ mb: 1, color: "text.secondary" }}
        >
          Transform
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          <Tooltip title="Rotate Left (-90°)">
            <IconButton
              onClick={() => handleRotate(-90)}
              size="medium"
              sx={{
                bgcolor:
                  options.angle &&
                  (options.angle % 360 === 270 || options.angle % 360 === -90)
                    ? "primary.main"
                    : "background.paper",
                color:
                  options.angle &&
                  (options.angle % 360 === 270 || options.angle % 360 === -90)
                    ? "white"
                    : "text.primary",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <RotateCcw size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Rotate Right (+90°)">
            <IconButton
              onClick={() => handleRotate(90)}
              size="medium"
              sx={{
                bgcolor:
                  options.angle &&
                  (options.angle % 360 === 90 || options.angle % 360 === -270)
                    ? "primary.main"
                    : "background.paper",
                color:
                  options.angle &&
                  (options.angle % 360 === 90 || options.angle % 360 === -270)
                    ? "white"
                    : "text.primary",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <RotateCw size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Flip Horizontal">
            <IconButton
              onClick={() => handleFlip("horizontal")}
              size="medium"
              sx={{
                bgcolor: options.flip ? "primary.main" : "background.paper",
                color: options.flip ? "white" : "text.primary",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <FlipHorizontal size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Flip Vertical">
            <IconButton
              onClick={() => handleFlip("vertical")}
              size="medium"
              sx={{
                bgcolor: options.flop ? "primary.main" : "background.paper",
                color: options.flop ? "white" : "text.primary",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <FlipVertical size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CropResizeTab;
