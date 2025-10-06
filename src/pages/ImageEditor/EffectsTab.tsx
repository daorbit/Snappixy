import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface EffectsTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const EffectsTab: React.FC<EffectsTabProps> = ({ options, updateOption }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: "sm" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Effect Selection */}
        <Typography
          variant="subtitle2"
          fontWeight={500}
          sx={{ mb: 1, color: "text.secondary" }}
        >
          Select Effect
        </Typography>

        <Stack spacing={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Effect</InputLabel>
            <Select
              value={options.effect || ""}
              onChange={(e) =>
                updateOption("effect", e.target.value || undefined)
              }
              label="Effect"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="blur:500">Light Blur</MenuItem>
              <MenuItem value="blur:1000">Medium Blur</MenuItem>
              <MenuItem value="blur:2000">Heavy Blur</MenuItem>
              <MenuItem value="grayscale">Grayscale</MenuItem>
              <MenuItem value="sepia">Sepia</MenuItem>
              <MenuItem value="brightness:50">Brighten</MenuItem>
              <MenuItem value="brightness:-50">Darken</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EffectsTab;
