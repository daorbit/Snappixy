import React from "react";
import { TextField, Card, CardContent } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface AdvancedTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({ options, updateOption }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Quality */}
        <TextField
          fullWidth
          size="small"
          label="Quality (1-100)"
          type="number"
          value={options.quality || ""}
          onChange={(e) =>
            updateOption(
              "quality",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          inputProps={{ min: 1, max: 100 }}
          sx={{ mb: 2, mt: 1 }}
        />

        {/* Angle */}
        <TextField
          fullWidth
          size="small"
          label="Angle (degrees)"
          type="number"
          value={options.angle || ""}
          onChange={(e) =>
            updateOption(
              "angle",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          sx={{ mb: 2 }}
        />

        {/* Border Radius */}
        <TextField
          fullWidth
          size="small"
          label="Border Radius"
          type="number"
          value={options.radius || ""}
          onChange={(e) =>
            updateOption(
              "radius",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          sx={{ mb: 2 }}
        />

        {/* Opacity */}
        <TextField
          fullWidth
          size="small"
          label="Opacity (0-100)"
          type="number"
          value={options.opacity || ""}
          onChange={(e) =>
            updateOption(
              "opacity",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          inputProps={{ min: 0, max: 100 }}
          sx={{ mb: 2 }}
        />

        {/* Background Color */}
        <TextField
          fullWidth
          size="small"
          label="Background Color (Hex)"
          value={options.background || ""}
          onChange={(e) =>
            updateOption("background", e.target.value || undefined)
          }
          placeholder="#ffffff"
        />
      </CardContent>
    </Card>
  );
};

export default AdvancedTab;
