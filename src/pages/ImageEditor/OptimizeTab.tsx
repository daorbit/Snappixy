import React from "react";
import {
  TextField,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Box,
} from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface OptimizeTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const OptimizeTab: React.FC<OptimizeTabProps> = ({ options, updateOption }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        {/* Auto Optimize */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={options.auto_optimize || false}
                onChange={(e) =>
                  updateOption("auto_optimize", e.target.checked)
                }
                color="primary"
              />
            }
            label="Auto Optimize"
          />
        </Box>

        {/* Auto Format */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={options.auto_format || false}
                onChange={(e) => updateOption("auto_format", e.target.checked)}
                color="primary"
              />
            }
            label="Auto Format"
          />
        </Box>

        {/* Progressive JPEG */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={options.progressive || false}
                onChange={(e) => updateOption("progressive", e.target.checked)}
                color="primary"
              />
            }
            label="Progressive JPEG"
          />
        </Box>

        {/* Device Pixel Ratio */}
        <TextField
          fullWidth
          label="Device Pixel Ratio"
          type="number"
          size="small"
          value={options.dpr || ""}
          onChange={(e) =>
            updateOption(
              "dpr",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          inputProps={{ min: 0.5, max: 3, step: 0.1 }}
        />
      </CardContent>
    </Card>
  );
};

export default OptimizeTab;
