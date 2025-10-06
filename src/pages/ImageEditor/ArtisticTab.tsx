import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
} from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface ArtisticTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const ArtisticTab: React.FC<ArtisticTabProps> = ({ options, updateOption }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Cartoon Effect</InputLabel>
          <Select
            label="Cartoon Effect"
            value={options.cartoonify || ""}
            onChange={(e) =>
              updateOption("cartoonify", e.target.value || undefined)
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="bw">Black & White Cartoon</MenuItem>
            <MenuItem value="color">Color Cartoon</MenuItem>
          </Select>
        </FormControl>

        {/* Oil Paint */}
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Oil Paint</InputLabel>
          <Select
            value={options.oil_paint || ""}
            label="Oil Paint"
            onChange={(e) =>
              updateOption(
                "oil_paint",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="30">Light</MenuItem>
            <MenuItem value="50">Medium</MenuItem>
            <MenuItem value="80">Heavy</MenuItem>
          </Select>
        </FormControl>

        {/* Pixelate */}
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Pixelate</InputLabel>
          <Select
            value={options.pixelate || ""}
            label="Pixelate"
            onChange={(e) =>
              updateOption(
                "pixelate",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="3">Small Pixels</MenuItem>
            <MenuItem value="10">Medium Pixels</MenuItem>
            <MenuItem value="20">Large Pixels</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={options.sketch || false}
              onChange={(e) => updateOption("sketch", e.target.checked)}
            />
          }
          label="Sketch Effect"
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={options.negate || false}
              onChange={(e) => updateOption("negate", e.target.checked)}
            />
          }
          label="Negative Effect"
        />
      </CardContent>
    </Card>
  );
};

export default ArtisticTab;
