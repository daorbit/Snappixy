import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface FiltersTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const FiltersTab: React.FC<FiltersTabProps> = ({ options, updateOption }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: "sm" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Sharpen */}
        <Typography
          variant="subtitle2"
          fontWeight={500}
          sx={{ mb: 1, color: "text.secondary" }}
        >
          Sharpen
        </Typography>
        <FormControl size="small" fullWidth sx={{ mb: 3 }}>
          <InputLabel>Sharpen</InputLabel>
          <Select
            value={options.sharpen || ""}
            onChange={(e) =>
              updateOption(
                "sharpen",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            label="Sharpen"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="50">Light</MenuItem>
            <MenuItem value="100">Medium</MenuItem>
            <MenuItem value="200">Strong</MenuItem>
          </Select>
        </FormControl>

        {/* Vignette */}
        <Typography
          variant="subtitle2"
          fontWeight={500}
          sx={{ mb: 1, color: "text.secondary" }}
        >
          Vignette
        </Typography>
        <FormControl size="small" fullWidth sx={{ mb: 3 }}>
          <InputLabel>Vignette</InputLabel>
          <Select
            value={options.vignette || ""}
            onChange={(e) =>
              updateOption("vignette", e.target.value || undefined)
            }
            label="Vignette"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="30">Light</MenuItem>
            <MenuItem value="50">Medium</MenuItem>
            <MenuItem value="80">Strong</MenuItem>
          </Select>
        </FormControl>

        {/* Hue Rotate */}
        <Typography
          variant="subtitle2"
          fontWeight={500}
          sx={{ mb: 1, color: "text.secondary" }}
        >
          Hue Rotate
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="Hue (degrees)"
          type="number"
          value={options.hue || ""}
          onChange={(e) =>
            updateOption(
              "hue",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          inputProps={{ min: -180, max: 180 }}
        />
      </CardContent>
    </Card>
  );
};

export default FiltersTab;
