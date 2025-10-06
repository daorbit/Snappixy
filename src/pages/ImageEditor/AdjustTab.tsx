import React from "react";
import { Typography, Slider, Card, CardContent, Box } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface AdjustTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const AdjustTab: React.FC<AdjustTabProps> = ({ options, updateOption }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        {/* Brightness */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom fontWeight={500}>
            Brightness
          </Typography>
          <Slider
            value={options.brightness || 0}
            onChange={(_, value) => updateOption("brightness", value as number)}
            min={-100}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Contrast */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom fontWeight={500}>
            Contrast
          </Typography>
          <Slider
            value={options.contrast || 0}
            onChange={(_, value) => updateOption("contrast", value as number)}
            min={-100}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Saturation */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom fontWeight={500}>
            Saturation
          </Typography>
          <Slider
            value={options.saturation || 0}
            onChange={(_, value) => updateOption("saturation", value as number)}
            min={-100}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Exposure */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom fontWeight={500}>
            Exposure
          </Typography>
          <Slider
            value={options.exposure || 0}
            onChange={(_, value) => updateOption("exposure", value as number)}
            min={-100}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Gamma */}
        <Box>
          <Typography gutterBottom fontWeight={500}>
            Gamma
          </Typography>
          <Slider
            value={options.gamma || 0}
            onChange={(_, value) => updateOption("gamma", value as number)}
            min={-50}
            max={50}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdjustTab;
