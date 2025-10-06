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

interface FormatTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const FormatTab: React.FC<FormatTabProps> = ({ options, updateOption }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: "sm" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Format Selection */}
        <Typography
          variant="subtitle2"
          fontWeight={500}
          sx={{ mb: 1, color: "text.secondary" }}
        >
          Select Format
        </Typography>

        <Stack spacing={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={options.format || ""}
              onChange={(e) =>
                updateOption("format", e.target.value || undefined)
              }
              label="Format"
            >
              <MenuItem value="">Original</MenuItem>
              <MenuItem value="jpg">JPEG</MenuItem>
              <MenuItem value="png">PNG</MenuItem>
              <MenuItem value="webp">WebP</MenuItem>
              <MenuItem value="avif">AVIF</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FormatTab;
